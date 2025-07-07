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
        pub name: String,
        pub description: String,
        pub total_funds: U256,
        pub organizer: Address,
        pub multisig_addresses: Vec<Address>,
        pub required_signatures: u32,
        pub is_active: bool,
        pub created_at: u64,
        pub updated_at: u64,
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

    /// Represents a multi-sig change request
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct MultisigChangeRequest {
        pub change_id: u32,
        pub hackathon_id: u32,
        pub change_type: MultisigChangeType,
        pub old_address: Option<Address>,
        pub new_address: Option<Address>,
        pub new_threshold: Option<u32>,
        pub new_organizer: Option<Address>,
        pub signatures: Vec<Address>,
        pub is_executed: bool,
        pub created_at: u64,
    }

    /// Types of multi-sig changes
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout, Debug))]
    pub enum MultisigChangeType {
        AddSigner,
        RemoveSigner,
        ReplaceSigner,
        UpdateThreshold,
        TransferOrganizer,
    }

    /// Hackathon summary for dashboard view
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct HackathonSummary {
        pub hackathon: HackathonEscrow,
        pub pending_payout_count: u32,
        pub pending_change_count: u32,
        pub required_change_signatures: u32,
    }

    /// Hackathon statistics
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct HackathonStats {
        pub total_funds_deposited: U256,
        pub total_funds_paid_out: U256,
        pub remaining_balance: U256,
        pub executed_requests: u32,
        pub pending_requests: u32,
        pub multisig_count: u32,
        pub required_signatures: u32,
        pub days_since_creation: u64,
    }

    /// Payout request with additional context
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct PayoutRequestWithContext {
        pub request: PayoutRequest,
        pub hackathon_name: String,
        pub signatures_needed: u32,
        pub signatures_provided: u32,
        pub can_sign: bool,
        pub has_signed: bool,
    }

    /// Activity item for recent activity feed
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub struct ActivityItem {
        pub activity_type: ActivityType,
        pub id: u32,
        pub timestamp: u64,
        pub description: String,
    }

    /// Types of activities
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub enum ActivityType {
        PayoutRequest,
        MultisigChange,
    }

    /// User roles in a hackathon
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    #[cfg_attr(feature = "std", derive(ink::storage::traits::StorageLayout))]
    pub enum UserRole {
        Organizer,
        MultisigSigner,
        Viewer,
    }

    /// Contract storage
    #[ink(storage)]
    pub struct HackathonEscrowContract {
        /// Map hackathon ID to escrow details
        hackathon_escrows: Mapping<u32, HackathonEscrow>,
        /// Map request ID to payout request
        payout_requests: Mapping<u32, PayoutRequest>,
        /// Map change ID to multi-sig change request
        multisig_change_requests: Mapping<u32, MultisigChangeRequest>,
        /// Counter for hackathon IDs
        next_hackathon_id: u32,
        /// Counter for payout request IDs
        next_request_id: u32,
        /// Counter for change request IDs
        next_change_id: u32,
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
        InvalidAmount,
        DuplicateMultisigAddress,
        MultisigAddressNotFound,
        InsufficientSignaturesForChange,
        InvalidThreshold,
        PendingRequestsExist,
        CannotRemoveLastSigner,
        ChangeRequestNotFound,
        ChangeRequestAlreadyExecuted,
        AlreadyVotedForChange,
        InvalidChangeType,
        InvalidInput,
    }

    pub type Result<T> = core::result::Result<T, ContractError>;

    impl HackathonEscrowContract {
        /// Constructor - Initialize the contract
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                hackathon_escrows: Mapping::new(),
                payout_requests: Mapping::new(),
                multisig_change_requests: Mapping::new(),
                next_hackathon_id: 1,
                next_request_id: 1,
                next_change_id: 1,
                owner: Self::env().caller(),
            }
        }

        #[ink(message, payable)]
        pub fn create_hackathon(
            &mut self,
            name: String,
            description: String,
            multisig_addresses: Vec<Address>,
            required_signatures: u32,
        ) -> Result<u32> {
            let caller = self.env().caller();
            let initial_funds = self.env().transferred_value();

            // Validate inputs
            if name.is_empty() {
                return Err(ContractError::InvalidInput);
            }

            if multisig_addresses.is_empty() || required_signatures == 0 {
                return Err(ContractError::InvalidSignatureCount);
            }

            if required_signatures > multisig_addresses.len() as u32 {
                return Err(ContractError::InvalidSignatureCount);
            }

            // Check for duplicate addresses
            let mut unique_addresses = Vec::new();
            for addr in &multisig_addresses {
                if unique_addresses.contains(addr) {
                    return Err(ContractError::DuplicateMultisigAddress);
                }
                unique_addresses.push(*addr);
            }

            let hackathon_id = self.next_hackathon_id;
            self.next_hackathon_id += 1;

            let escrow = HackathonEscrow {
                hackathon_id,
                name,
                description,
                total_funds: initial_funds,
                organizer: caller,
                multisig_addresses,
                required_signatures,
                is_active: true,
                created_at: self.env().block_timestamp(),
                updated_at: self.env().block_timestamp(),
            };

            self.hackathon_escrows.insert(hackathon_id, &escrow);

            Ok(hackathon_id)
        }

        /// Deposit additional funds to a hackathon escrow
        #[ink(message, payable)]
        pub fn deposit_funds(&mut self, hackathon_id: u32) -> Result<()> {
            let amount = self.env().transferred_value();

            if amount == U256::from(0u32) {
                return Err(ContractError::InvalidAmount);
            }

            let mut escrow = self
                .hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            if !escrow.is_active {
                return Err(ContractError::HackathonInactive);
            }

            escrow.total_funds = escrow.total_funds.saturating_add(amount);
            escrow.updated_at = self.env().block_timestamp();
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
            if escrow.multisig_addresses.contains(&multisig_address) {
                return Err(ContractError::DuplicateMultisigAddress);
            }

            escrow.multisig_addresses.push(multisig_address);
            escrow.updated_at = self.env().block_timestamp();
            self.hackathon_escrows.insert(hackathon_id, &escrow);

            Ok(())
        }

        /// Request a multi-sig change (organizer or multisig can request)
        #[ink(message)]
        pub fn request_multisig_change(
            &mut self,
            hackathon_id: u32,
            change_type: MultisigChangeType,
            old_address: Option<Address>,
            new_address: Option<Address>,
            new_threshold: Option<u32>,
            new_organizer: Option<Address>,
        ) -> Result<u32> {
            let caller = self.env().caller();

            let escrow = self
                .hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            // Only organizer or multisig addresses can request changes
            if caller != escrow.organizer && !escrow.multisig_addresses.contains(&caller) {
                return Err(ContractError::NotAuthorized);
            }

            if !escrow.is_active {
                return Err(ContractError::HackathonInactive);
            }

            // Check for pending payout requests
            if self.has_pending_payouts(hackathon_id)? {
                return Err(ContractError::PendingRequestsExist);
            }

            // Validate change type and parameters
            self.validate_change_request(&escrow, &change_type, &old_address, &new_address, &new_threshold, &new_organizer)?;

            let change_id = self.next_change_id;
            self.next_change_id += 1;

            let change_request = MultisigChangeRequest {
                change_id,
                hackathon_id,
                change_type,
                old_address,
                new_address,
                new_threshold,
                new_organizer,
                signatures: Vec::new(),
                is_executed: false,
                created_at: self.env().block_timestamp(),
            };

            self.multisig_change_requests.insert(change_id, &change_request);

            Ok(change_id)
        }

        /// Sign a multi-sig change request
        #[ink(message)]
        pub fn sign_multisig_change(&mut self, change_id: u32) -> Result<()> {
            let caller = self.env().caller();

            let mut change_request = self
                .multisig_change_requests
                .get(change_id)
                .ok_or(ContractError::ChangeRequestNotFound)?;

            if change_request.is_executed {
                return Err(ContractError::ChangeRequestAlreadyExecuted);
            }

            let escrow = self
                .hackathon_escrows
                .get(change_request.hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            // Only multisig addresses can sign changes
            if !escrow.multisig_addresses.contains(&caller) {
                return Err(ContractError::NotAuthorized);
            }

            // Check if already signed
            if change_request.signatures.contains(&caller) {
                return Err(ContractError::AlreadyVotedForChange);
            }

            change_request.signatures.push(caller);
            let signatures_count = change_request.signatures.len() as u32;

            self.multisig_change_requests.insert(change_id, &change_request);

            // Auto-execute if enough signatures (requires 2/3 majority)
            let required_signatures = (escrow.multisig_addresses.len() * 2) / 3 + 1;
            if signatures_count >= required_signatures as u32 {
                self.execute_multisig_change_internal(change_id)?;
            }

            Ok(())
        }

        /// Execute multi-sig change (internal function)
        fn execute_multisig_change_internal(&mut self, change_id: u32) -> Result<()> {
            let mut change_request = self
                .multisig_change_requests
                .get(change_id)
                .ok_or(ContractError::ChangeRequestNotFound)?;

            if change_request.is_executed {
                return Err(ContractError::ChangeRequestAlreadyExecuted);
            }

            let mut escrow = self
                .hackathon_escrows
                .get(change_request.hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            // Check if enough signatures (2/3 majority)
            let required_signatures = (escrow.multisig_addresses.len() * 2) / 3 + 1;
            if (change_request.signatures.len() as u32) < required_signatures as u32 {
                return Err(ContractError::InsufficientSignaturesForChange);
            }

            // Execute the change based on type
            match change_request.change_type {
                MultisigChangeType::AddSigner => {
                    if let Some(new_address) = change_request.new_address {
                        if !escrow.multisig_addresses.contains(&new_address) {
                            escrow.multisig_addresses.push(new_address);
                        }
                    }
                },
                MultisigChangeType::RemoveSigner => {
                    if let Some(old_address) = change_request.old_address {
                        if escrow.multisig_addresses.len() <= 1 {
                            return Err(ContractError::CannotRemoveLastSigner);
                        }
                        escrow.multisig_addresses.retain(|&addr| addr != old_address);
                    }
                },
                MultisigChangeType::ReplaceSigner => {
                    if let (Some(old_address), Some(new_address)) = (change_request.old_address, change_request.new_address) {
                        if let Some(index) = escrow.multisig_addresses.iter().position(|&addr| addr == old_address) {
                            escrow.multisig_addresses[index] = new_address;
                        }
                    }
                },
                MultisigChangeType::UpdateThreshold => {
                    if let Some(new_threshold) = change_request.new_threshold {
                        if new_threshold > escrow.multisig_addresses.len() as u32 || new_threshold == 0 {
                            return Err(ContractError::InvalidThreshold);
                        }
                        escrow.required_signatures = new_threshold;
                    }
                },
                MultisigChangeType::TransferOrganizer => {
                    if let Some(new_organizer) = change_request.new_organizer {
                        escrow.organizer = new_organizer;
                    }
                },
            }

            change_request.is_executed = true;

            self.hackathon_escrows.insert(change_request.hackathon_id, &escrow);
            self.multisig_change_requests.insert(change_id, &change_request);

            Ok(())
        }

        /// Check if hackathon has pending payout requests
        fn has_pending_payouts(&self, hackathon_id: u32) -> Result<bool> {
            for request_id in 1..self.next_request_id {
                if let Some(request) = self.payout_requests.get(request_id) {
                    if request.hackathon_id == hackathon_id && !request.is_executed {
                        return Ok(true);
                    }
                }
            }
            Ok(false)
        }

        /// Validate change request parameters
        fn validate_change_request(
            &self,
            escrow: &HackathonEscrow,
            change_type: &MultisigChangeType,
            old_address: &Option<Address>,
            new_address: &Option<Address>,
            new_threshold: &Option<u32>,
            new_organizer: &Option<Address>,
        ) -> Result<()> {
            match change_type {
                MultisigChangeType::AddSigner => {
                    if let Some(addr) = new_address {
                        if escrow.multisig_addresses.contains(addr) {
                            return Err(ContractError::DuplicateMultisigAddress);
                        }
                    } else {
                        return Err(ContractError::InvalidChangeType);
                    }
                },
                MultisigChangeType::RemoveSigner => {
                    if let Some(addr) = old_address {
                        if !escrow.multisig_addresses.contains(addr) {
                            return Err(ContractError::MultisigAddressNotFound);
                        }
                        if escrow.multisig_addresses.len() <= 1 {
                            return Err(ContractError::CannotRemoveLastSigner);
                        }
                    } else {
                        return Err(ContractError::InvalidChangeType);
                    }
                },
                MultisigChangeType::ReplaceSigner => {
                    if let (Some(old_addr), Some(new_addr)) = (old_address, new_address) {
                        if !escrow.multisig_addresses.contains(old_addr) {
                            return Err(ContractError::MultisigAddressNotFound);
                        }
                        if escrow.multisig_addresses.contains(new_addr) {
                            return Err(ContractError::DuplicateMultisigAddress);
                        }
                    } else {
                        return Err(ContractError::InvalidChangeType);
                    }
                },
                MultisigChangeType::UpdateThreshold => {
                    if let Some(threshold) = new_threshold {
                        if *threshold > escrow.multisig_addresses.len() as u32 || *threshold == 0 {
                            return Err(ContractError::InvalidThreshold);
                        }
                    } else {
                        return Err(ContractError::InvalidChangeType);
                    }
                },
                MultisigChangeType::TransferOrganizer => {
                    if new_organizer.is_none() {
                        return Err(ContractError::InvalidChangeType);
                    }
                },
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

            if amount == U256::from(0u32) {
                return Err(ContractError::InvalidAmount);
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
            escrow.total_funds = escrow.total_funds.saturating_sub(payout_request.amount);
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
            escrow.updated_at = self.env().block_timestamp();
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

        /// Get all multisig addresses for a hackathon
        #[ink(message)]
        pub fn get_multisig_addresses(&self, hackathon_id: u32) -> Result<Vec<Address>> {
            let escrow = self
                .hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            Ok(escrow.multisig_addresses)
        }

        /// Get pending payout requests for a hackathon
        #[ink(message)]
        pub fn get_pending_requests(&self, hackathon_id: u32) -> Result<Vec<u32>> {
            let mut pending_requests = Vec::new();
            
            // Note: This is a simplified implementation. In production, you might want
            // to maintain a separate mapping for efficiency
            for request_id in 1..self.next_request_id {
                if let Some(request) = self.payout_requests.get(request_id) {
                    if request.hackathon_id == hackathon_id && !request.is_executed {
                        pending_requests.push(request_id);
                    }
                }
            }
            
            Ok(pending_requests)
        }

        /// Get multi-sig change request details
        #[ink(message)]
        pub fn get_multisig_change_request(&self, change_id: u32) -> Result<MultisigChangeRequest> {
            self.multisig_change_requests
                .get(change_id)
                .ok_or(ContractError::ChangeRequestNotFound)
        }

        /// Get pending multi-sig change requests for a hackathon
        #[ink(message)]
        pub fn get_pending_multisig_changes(&self, hackathon_id: u32) -> Result<Vec<u32>> {
            let mut pending_changes = Vec::new();
            
            for change_id in 1..self.next_change_id {
                if let Some(change) = self.multisig_change_requests.get(change_id) {
                    if change.hackathon_id == hackathon_id && !change.is_executed {
                        pending_changes.push(change_id);
                    }
                }
            }
            
            Ok(pending_changes)
        }

        /// Get required signatures for multi-sig changes (2/3 majority)
        #[ink(message)]
        pub fn get_required_change_signatures(&self, hackathon_id: u32) -> Result<u32> {
            let escrow = self
                .hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            let required = (escrow.multisig_addresses.len() * 2) / 3 + 1;
            Ok(required as u32)
        }

        /// Check if address can request changes (organizer or multisig)
        #[ink(message)]
        pub fn can_request_changes(&self, hackathon_id: u32, address: Address) -> Result<bool> {
            let escrow = self
                .hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            Ok(address == escrow.organizer || escrow.multisig_addresses.contains(&address))
        }

        /// Get hackathon summary for dashboard
        #[ink(message)]
        pub fn get_hackathon_summary(&self, hackathon_id: u32) -> Result<HackathonSummary> {
            let escrow = self
                .hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            let pending_payouts = self.get_pending_requests(hackathon_id)?;
            let pending_changes = self.get_pending_multisig_changes(hackathon_id)?;
            let required_change_sigs = self.get_required_change_signatures(hackathon_id)?;

            Ok(HackathonSummary {
                hackathon: escrow,
                pending_payout_count: pending_payouts.len() as u32,
                pending_change_count: pending_changes.len() as u32,
                required_change_signatures: required_change_sigs,
            })
        }

        /// Batch sign multiple payout requests
        #[ink(message)]
        pub fn batch_sign_payouts(&mut self, request_ids: Vec<u32>) -> Result<Vec<u32>> {
            let mut signed_requests = Vec::new();
            
            for request_id in request_ids {
                if self.sign_payout(request_id).is_ok() {
                    signed_requests.push(request_id);
                }
            }
            
            Ok(signed_requests)
        }

        /// Get all hackathons for an address (organizer or multisig)
        #[ink(message)]
        pub fn get_hackathons_for_address(&self, address: Address) -> Result<Vec<u32>> {
            let mut hackathons = Vec::new();
            
            for hackathon_id in 1..self.next_hackathon_id {
                if let Some(escrow) = self.hackathon_escrows.get(hackathon_id) {
                    if address == escrow.organizer || escrow.multisig_addresses.contains(&address) {
                        hackathons.push(hackathon_id);
                    }
                }
            }
            
            Ok(hackathons)
        }

        /// Update hackathon metadata (only organizer)
        #[ink(message)]
        pub fn update_hackathon_metadata(
            &mut self,
            hackathon_id: u32,
            name: Option<String>,
            description: Option<String>,
        ) -> Result<()> {
            let caller = self.env().caller();

            let mut escrow = self
                .hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            if caller != escrow.organizer {
                return Err(ContractError::NotAuthorized);
            }

            if !escrow.is_active {
                return Err(ContractError::HackathonInactive);
            }

            if let Some(new_name) = name {
                if !new_name.is_empty() {
                    escrow.name = new_name;
                }
            }

            if let Some(new_description) = description {
                escrow.description = new_description;
            }

            escrow.updated_at = self.env().block_timestamp();
            self.hackathon_escrows.insert(hackathon_id, &escrow);

            Ok(())
        }

        /// Get hackathon statistics
        #[ink(message)]
        pub fn get_hackathon_stats(&self, hackathon_id: u32) -> Result<HackathonStats> {
            let escrow = self
                .hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            let mut total_payouts = U256::from(0u32);
            let mut executed_requests = 0u32;
            let mut pending_requests = 0u32;

            for request_id in 1..self.next_request_id {
                if let Some(request) = self.payout_requests.get(request_id) {
                    if request.hackathon_id == hackathon_id {
                        if request.is_executed {
                            total_payouts = total_payouts.saturating_add(request.amount);
                            executed_requests += 1;
                        } else {
                            pending_requests += 1;
                        }
                    }
                }
            }

            Ok(HackathonStats {
                total_funds_deposited: escrow.total_funds.saturating_add(total_payouts),
                total_funds_paid_out: total_payouts,
                remaining_balance: escrow.total_funds,
                executed_requests,
                pending_requests,
                multisig_count: escrow.multisig_addresses.len() as u32,
                required_signatures: escrow.required_signatures,
                days_since_creation: (self.env().block_timestamp() - escrow.created_at) / 86400, // 86400 seconds = 1 day
            })
        }

        /// Get payout request with context for UI
        #[ink(message)]
        pub fn get_payout_request_with_context(&self, request_id: u32, caller: Address) -> Result<PayoutRequestWithContext> {
            let request = self
                .payout_requests
                .get(request_id)
                .ok_or(ContractError::RequestNotFound)?;

            let escrow = self
                .hackathon_escrows
                .get(request.hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            let can_sign = escrow.multisig_addresses.contains(&caller);
            let has_signed = request.signatures.contains(&caller);
            let signatures_provided = request.signatures.len() as u32;

            Ok(PayoutRequestWithContext {
                request,
                hackathon_name: escrow.name.clone(),
                signatures_needed: escrow.required_signatures,
                signatures_provided,
                can_sign,
                has_signed,
            })
        }

        /// Get all pending requests for an address with context
        #[ink(message)]
        pub fn get_pending_requests_for_address(&self, address: Address) -> Result<Vec<PayoutRequestWithContext>> {
            let mut requests_with_context = Vec::new();
            
            for request_id in 1..self.next_request_id {
                if let Some(request) = self.payout_requests.get(request_id) {
                    if !request.is_executed {
                        if let Ok(context) = self.get_payout_request_with_context(request_id, address) {
                            requests_with_context.push(context);
                        }
                    }
                }
            }
            
            Ok(requests_with_context)
        }

        /// Search hackathons by name (partial match)
        #[ink(message)]
        pub fn search_hackathons(&self, search_term: String) -> Result<Vec<u32>> {
            let mut matching_hackathons = Vec::new();
            let search_lower = search_term.to_lowercase();
            
            for hackathon_id in 1..self.next_hackathon_id {
                if let Some(escrow) = self.hackathon_escrows.get(hackathon_id) {
                    if escrow.name.to_lowercase().contains(&search_lower) || 
                       escrow.description.to_lowercase().contains(&search_lower) {
                        matching_hackathons.push(hackathon_id);
                    }
                }
            }
            
            Ok(matching_hackathons)
        }

        /// Get recent activity for a hackathon
        #[ink(message)]
        pub fn get_recent_activity(&self, hackathon_id: u32, limit: u32) -> Result<Vec<ActivityItem>> {
            let mut activities = Vec::new();
            
            // Get recent payout requests
            for request_id in 1..self.next_request_id {
                if activities.len() >= limit as usize {
                    break;
                }
                
                if let Some(request) = self.payout_requests.get(request_id) {
                    if request.hackathon_id == hackathon_id {
                        activities.push(ActivityItem {
                            activity_type: ActivityType::PayoutRequest,
                            id: request_id,
                            timestamp: request.created_at,
                            description: String::from("Payout request"),
                        });
                    }
                }
            }
            
            // Get recent change requests
            for change_id in 1..self.next_change_id {
                if activities.len() >= limit as usize {
                    break;
                }
                
                if let Some(change) = self.multisig_change_requests.get(change_id) {
                    if change.hackathon_id == hackathon_id {
                        activities.push(ActivityItem {
                            activity_type: ActivityType::MultisigChange,
                            id: change_id,
                            timestamp: change.created_at,
                            description: String::from("Multi-sig change request"),
                        });
                    }
                }
            }
            
            // Sort by timestamp (newest first) and limit
            activities.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
            activities.truncate(limit as usize);
            
            Ok(activities)
        }

        /// Get user role for a hackathon
        #[ink(message)]
        pub fn get_user_role(&self, hackathon_id: u32, address: Address) -> Result<UserRole> {
            let escrow = self
                .hackathon_escrows
                .get(hackathon_id)
                .ok_or(ContractError::HackathonNotFound)?;

            if address == escrow.organizer {
                Ok(UserRole::Organizer)
            } else if escrow.multisig_addresses.contains(&address) {
                Ok(UserRole::MultisigSigner)
            } else {
                Ok(UserRole::Viewer)
            }
        }
    }
}