#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod hackathon_escrow {
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;
    use ink::primitives::U256;

    /// Represents a hackathon escrow account
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct HackathonEscrow {
        pub hackathon_id: u32,
        pub total_funds: U256,
        pub organizer: Address,
        pub multisig_addresses: Vec<Address>,
        pub required_signatures: u32,
        pub is_active: bool,
    }

    /// Represents a payout request
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct PayoutRequest {
        pub request_id: u32,
        pub hackathon_id: u32,
        pub recipient: Address,
        pub amount: U256,
        pub reason: String,
        pub signatures: Vec<Address>,
        pub is_executed: bool,
        pub created_at: u64,
    }

    /// Contract storage
    #[ink(storage)]
    pub struct HackathonEscrowContract {
        /// Map hackathon ID to escrow details
        hackathon_escrows: Mapping<u32, HackathonEscrow>,
        /// Map request ID to payout request
        payout_requests: Mapping<u32, PayoutRequest>,
        /// Counter for hackathon IDs
        next_hackathon_id: u32,
        /// Counter for payout request IDs
        next_request_id: u32,
        /// Contract owner
        owner: Address,
    }

    /// Contract errors
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum ContractError {
        HackathonNotFound,
        InsufficientFunds,
        NotAuthorized,
        InvalidSignatureCount,
        RequestNotFound,
        RequestAlreadyExecuted,
        AlreadySigned,
        NotEnoughSignatures,
        TransferFailed,
        InvalidAddress,
        HackathonInactive,
    }

    pub type Result<T> = core::result::Result<T, ContractError>;

    impl HackathonEscrowContract {
        /// Constructor - Initialize the contract
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                hackathon_escrows: Mapping::new(),
                payout_requests: Mapping::new(),
                next_hackathon_id: 1,
                next_request_id: 1,
                owner: Self::env().caller(),
            }
        }

        #[ink(message, payable)]
        pub fn create_hackathon(
            &mut self,
            multisig_addresses: Vec<Address>,
            required_signatures: u32,
        ) -> Result<u32> {
            let caller = self.env().caller();
            let initial_funds = self.env().transferred_value();

            // Validate inputs
            if multisig_addresses.is_empty() || required_signatures == 0 {
                return Err(ContractError::InvalidSignatureCount);
            }

            if required_signatures > multisig_addresses.len() as u32 {
                return Err(ContractError::InvalidSignatureCount);
            }

            let hackathon_id = self.next_hackathon_id;
            self.next_hackathon_id += 1;

            let escrow = HackathonEscrow {
                hackathon_id,
                total_funds: initial_funds,
                organizer: caller,
                multisig_addresses,
                required_signatures,
                is_active: true,
            };

            self.hackathon_escrows.insert(hackathon_id, &escrow);

            Ok(hackathon_id)
        }

        /// Deposit additional funds to a hackathon escrow
        #[ink(message, payable)]
        pub fn deposit_funds(&mut self, hackathon_id: u32) -> Result<()> {
            let amount = self.env().transferred_value();

            let mut escrow = self
                .hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            if !escrow.is_active {
                return Err(ContractError::HackathonInactive);
            }

            escrow.total_funds += amount;
            self.hackathon_escrows.insert(hackathon_id, &escrow);

            Ok(())
        }

        /// Add a multisig address to an existing hackathon (only organizer)
        #[ink(message)]
        pub fn add_multisig_address(
            &mut self,
            hackathon_id: u32,
            multisig_address: Address,
        ) -> Result<()> {
            let caller = self.env().caller();

            let mut escrow = self
                .hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            // Only organizer can add multisig addresses
            if caller != escrow.organizer {
                return Err(ContractError::NotAuthorized);
            }

            if !escrow.is_active {
                return Err(ContractError::HackathonInactive);
            }

            // Check if address already exists
            if !escrow.multisig_addresses.contains(&multisig_address) {
                escrow.multisig_addresses.push(multisig_address);
                self.hackathon_escrows.insert(hackathon_id, &escrow);
            }

            Ok(())
        }

        /// Request a payout (only multisig addresses can request)
        #[ink(message)]
        pub fn request_payout(
            &mut self,
            hackathon_id: u32,
            recipient: Address,
            amount: U256,
            reason: String,
        ) -> Result<u32> {
            let caller = self.env().caller();

            let escrow = self
                .hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            // Only multisig addresses can request payouts
            if !escrow.multisig_addresses.contains(&caller) {
                return Err(ContractError::NotAuthorized);
            }

            if !escrow.is_active {
                return Err(ContractError::HackathonInactive);
            }

            if amount > escrow.total_funds {
                return Err(ContractError::InsufficientFunds);
            }

            let request_id = self.next_request_id;
            self.next_request_id += 1;

            let payout_request = PayoutRequest {
                request_id,
                hackathon_id,
                recipient,
                amount,
                reason,
                signatures: Vec::new(),
                is_executed: false,
                created_at: self.env().block_timestamp(),
            };

            self.payout_requests.insert(request_id, &payout_request);

            Ok(request_id)
        }

        /// Sign a payout request (only multisig addresses)
        #[ink(message)]
        pub fn sign_payout(&mut self, request_id: u32) -> Result<()> {
            let caller = self.env().caller();

            let mut payout_request = self
                .payout_requests
                .get(request_id)
                .ok_or(ContractError::RequestNotFound)?;

            if payout_request.is_executed {
                return Err(ContractError::RequestAlreadyExecuted);
            }

            let escrow = self
                .hackathon_escrows
                .get(payout_request.hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            // Only multisig addresses can sign
            if !escrow.multisig_addresses.contains(&caller) {
                return Err(ContractError::NotAuthorized);
            }

            // Check if already signed
            if payout_request.signatures.contains(&caller) {
                return Err(ContractError::AlreadySigned);
            }

            payout_request.signatures.push(caller);
            let signatures_count = payout_request.signatures.len() as u32;

            self.payout_requests.insert(request_id, &payout_request);

            // Auto-execute if enough signatures
            if signatures_count >= escrow.required_signatures {
                self.execute_payout_internal(request_id)?;
            }

            Ok(())
        }

        /// Execute payout (internal function)
        fn execute_payout_internal(&mut self, request_id: u32) -> Result<()> {
            let mut payout_request = self
                .payout_requests
                .get(request_id)
                .ok_or(ContractError::RequestNotFound)?;

            if payout_request.is_executed {
                return Err(ContractError::RequestAlreadyExecuted);
            }

            let mut escrow = self
                .hackathon_escrows
                .get(payout_request.hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            // Check if enough signatures
            if (payout_request.signatures.len() as u32) < escrow.required_signatures {
                return Err(ContractError::NotEnoughSignatures);
            }

            // Check if sufficient funds
            if payout_request.amount > escrow.total_funds {
                return Err(ContractError::InsufficientFunds);
            }

            // Execute transfer
            if self
                .env()
                .transfer(payout_request.recipient, payout_request.amount)
                .is_err()
            {
                return Err(ContractError::TransferFailed);
            }

            // Update balances
            escrow.total_funds -= payout_request.amount;
            payout_request.is_executed = true;

            self.hackathon_escrows
                .insert(payout_request.hackathon_id, &escrow);
            self.payout_requests.insert(request_id, &payout_request);

            Ok(())
        }

        /// Deactivate hackathon (only organizer)
        #[ink(message)]
        pub fn deactivate_hackathon(&mut self, hackathon_id: u32) -> Result<()> {
            let caller = self.env().caller();

            let mut escrow = self
                .hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            if caller != escrow.organizer {
                return Err(ContractError::NotAuthorized);
            }

            escrow.is_active = false;
            self.hackathon_escrows.insert(hackathon_id, &escrow);

            Ok(())
        }

        /// Get hackathon details
        #[ink(message)]
        pub fn get_hackathon(&self, hackathon_id: u32) -> Result<HackathonEscrow> {
            self.hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)
        }

        /// Get payout request details
        #[ink(message)]
        pub fn get_payout_request(&self, request_id: u32) -> Result<PayoutRequest> {
            self.payout_requests
                .get(request_id)
                .ok_or(ContractError::RequestNotFound)
        }

        /// Get contract balance
        #[ink(message)]
        pub fn get_contract_balance(&self) -> U256 {
            self.env().balance()
        }

        /// Get hackathon balance
        #[ink(message)]
        pub fn get_hackathon_balance(&self, hackathon_id: u32) -> Result<U256> {
            let escrow = self
                .hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            Ok(escrow.total_funds)
        }
    }
}