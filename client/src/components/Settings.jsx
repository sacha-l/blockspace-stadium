import React, { useState, useEffect } from 'react';
import { AlertCircle, Plus, Send, Eye, Shield, DollarSign, Users, CheckCircle, XCircle } from 'lucide-react';

const SettingsTab = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [isConnected, setIsConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  // Form states
  const [createForm, setCreateForm] = useState({
    multisigAddresses: [''],
    requiredSignatures: 1,
    initialFunds: ''
  });

  const [depositForm, setDepositForm] = useState({
    hackathonId: '',
    amount: ''
  });

  const [addMultisigForm, setAddMultisigForm] = useState({
    hackathonId: '',
    multisigAddress: ''
  });

  const [requestPayoutForm, setRequestPayoutForm] = useState({
    hackathonId: '',
    recipient: '',
    amount: '',
    reason: ''
  });

  const [signPayoutForm, setSignPayoutForm] = useState({
    requestId: ''
  });

  const [deactivateForm, setDeactivateForm] = useState({
    hackathonId: ''
  });

  const [viewHackathonForm, setViewHackathonForm] = useState({
    hackathonId: ''
  });

  const [viewPayoutForm, setViewPayoutForm] = useState({
    requestId: ''
  });

  const [balanceForm, setBalanceForm] = useState({
    hackathonId: ''
  });

  // Mock wallet connection
  const connectWallet = async () => {
    setIsConnected(true);
    setConnectedAccount('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setConnectedAccount('');
  };

  // Helper functions
  const addMultisigAddress = () => {
    setCreateForm(prev => ({
      ...prev,
      multisigAddresses: [...prev.multisigAddresses, '']
    }));
  };

  const removeMultisigAddress = (index) => {
    setCreateForm(prev => ({
      ...prev,
      multisigAddresses: prev.multisigAddresses.filter((_, i) => i !== index)
    }));
  };

  const updateMultisigAddress = (index, value) => {
    setCreateForm(prev => ({
      ...prev,
      multisigAddresses: prev.multisigAddresses.map((addr, i) => 
        i === index ? value : addr
      )
    }));
  };

  // Mock contract interaction functions
  const executeContractFunction = async (functionName, params) => {
    setLoading(prev => ({ ...prev, [functionName]: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults = {
      createHackathon: { hackathonId: Math.floor(Math.random() * 1000), txHash: '0x123...' },
      depositFunds: { success: true, txHash: '0x456...' },
      addMultisigAddress: { success: true, txHash: '0x789...' },
      requestPayout: { requestId: Math.floor(Math.random() * 1000), txHash: '0xabc...' },
      signPayout: { success: true, signaturesCount: 2, txHash: '0xdef...' },
      deactivateHackathon: { success: true, txHash: '0xghi...' },
      getHackathon: {
        hackathonId: params.hackathonId,
        organizer: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        totalFunds: '1000000000000',
        multisigAddresses: ['5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'],
        requiredSignatures: 2,
        isActive: true
      },
      getPayoutRequest: {
        requestId: params.requestId,
        hackathonId: 1,
        recipient: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        amount: '100000000000',
        reason: 'Prize distribution',
        signatures: ['5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'],
        isExecuted: false,
        createdAt: Date.now()
      },
      getContractBalance: { balance: '5000000000000' },
      getHackathonBalance: { balance: '1000000000000' }
    };

    setResults(prev => ({ ...prev, [functionName]: mockResults[functionName] }));
    setLoading(prev => ({ ...prev, [functionName]: false }));
  };

  const WalletConnection = () => (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">Wallet Connection</span>
        </div>
        {isConnected ? (
          <div className="flex items-center space-x-3">
            <span className="text-green-400 text-sm">
              {connectedAccount.slice(0, 6)}...{connectedAccount.slice(-4)}
            </span>
            <button
              onClick={disconnectWallet}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Connect Wallet
          </button>
        )}
      </div>
      
      {isConnected && (
        <div className="mt-3">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Contract Address
          </label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="Enter contract address"
            className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
          />
        </div>
      )}
    </div>
  );

  const ResultDisplay = ({ result, functionName }) => {
    if (!result) return null;
    
    return (
      <div className="mt-4 p-4 bg-gray-700 rounded-lg">
        <h4 className="text-green-400 font-medium mb-2 flex items-center">
          <CheckCircle className="w-4 h-4 mr-2" />
          Result
        </h4>
        <pre className="text-sm text-gray-300 overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  const CreateHackathonForm = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Create Hackathon Escrow</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Multisig Addresses
        </label>
        {createForm.multisigAddresses.map((address, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={address}
              onChange={(e) => updateMultisigAddress(index, e.target.value)}
              placeholder="Enter account address"
              className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
            />
            {createForm.multisigAddresses.length > 1 && (
              <button
                onClick={() => removeMultisigAddress(index)}
                className="p-2 text-red-400 hover:text-red-300"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addMultisigAddress}
          className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
        >
          <Plus className="w-4 h-4" />
          <span>Add Address</span>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Required Signatures
        </label>
        <input
          type="number"
          value={createForm.requiredSignatures}
          onChange={(e) => setCreateForm(prev => ({ ...prev, requiredSignatures: parseInt(e.target.value) || 1 }))}
          min="1"
          max={createForm.multisigAddresses.length}
          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Initial Funds (optional)
        </label>
        <input
          type="text"
          value={createForm.initialFunds}
          onChange={(e) => setCreateForm(prev => ({ ...prev, initialFunds: e.target.value }))}
          placeholder="Enter amount in smallest unit"
          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
        />
      </div>

      <button
        onClick={() => executeContractFunction('createHackathon', createForm)}
        disabled={!isConnected || loading.createHackathon}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading.createHackathon ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Create Hackathon
          </>
        )}
      </button>

      <ResultDisplay result={results.createHackathon} functionName="createHackathon" />
    </div>
  );

  const DepositFundsForm = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Deposit Funds</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Hackathon ID
        </label>
        <input
          type="number"
          value={depositForm.hackathonId}
          onChange={(e) => setDepositForm(prev => ({ ...prev, hackathonId: e.target.value }))}
          placeholder="Enter hackathon ID"
          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Amount
        </label>
        <input
          type="text"
          value={depositForm.amount}
          onChange={(e) => setDepositForm(prev => ({ ...prev, amount: e.target.value }))}
          placeholder="Enter amount in smallest unit"
          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
        />
      </div>

      <button
        onClick={() => executeContractFunction('depositFunds', depositForm)}
        disabled={!isConnected || loading.depositFunds}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading.depositFunds ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <>
            <DollarSign className="w-4 h-4 mr-2" />
            Deposit Funds
          </>
        )}
      </button>

      <ResultDisplay result={results.depositFunds} functionName="depositFunds" />
    </div>
  );

  const AddMultisigForm = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Add Multisig Address</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Hackathon ID
        </label>
        <input
          type="number"
          value={addMultisigForm.hackathonId}
          onChange={(e) => setAddMultisigForm(prev => ({ ...prev, hackathonId: e.target.value }))}
          placeholder="Enter hackathon ID"
          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Multisig Address
        </label>
        <input
          type="text"
          value={addMultisigForm.multisigAddress}
          onChange={(e) => setAddMultisigForm(prev => ({ ...prev, multisigAddress: e.target.value }))}
          placeholder="Enter account address"
          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
        />
      </div>

      <button
        onClick={() => executeContractFunction('addMultisigAddress', addMultisigForm)}
        disabled={!isConnected || loading.addMultisigAddress}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading.addMultisigAddress ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <>
            <Users className="w-4 h-4 mr-2" />
            Add Multisig Address
          </>
        )}
      </button>

      <ResultDisplay result={results.addMultisigAddress} functionName="addMultisigAddress" />
    </div>
  );

  const RequestPayoutForm = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Request Payout</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Hackathon ID
        </label>
        <input
          type="number"
          value={requestPayoutForm.hackathonId}
          onChange={(e) => setRequestPayoutForm(prev => ({ ...prev, hackathonId: e.target.value }))}
          placeholder="Enter hackathon ID"
          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Recipient Address
        </label>
        <input
          type="text"
          value={requestPayoutForm.recipient}
          onChange={(e) => setRequestPayoutForm(prev => ({ ...prev, recipient: e.target.value }))}
          placeholder="Enter recipient address"
          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Amount
        </label>
        <input
          type="text"
          value={requestPayoutForm.amount}
          onChange={(e) => setRequestPayoutForm(prev => ({ ...prev, amount: e.target.value }))}
          placeholder="Enter amount in smallest unit"
          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Reason
        </label>
        <textarea
          value={requestPayoutForm.reason}
          onChange={(e) => setRequestPayoutForm(prev => ({ ...prev, reason: e.target.value }))}
          placeholder="Enter reason for payout"
          rows={3}
          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
        />
      </div>

      <button
        onClick={() => executeContractFunction('requestPayout', requestPayoutForm)}
        disabled={!isConnected || loading.requestPayout}
        className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading.requestPayout ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Request Payout
          </>
        )}
      </button>

      <ResultDisplay result={results.requestPayout} functionName="requestPayout" />
    </div>
  );

  const SignPayoutForm = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Sign Payout Request</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Request ID
        </label>
        <input
          type="number"
          value={signPayoutForm.requestId}
          onChange={(e) => setSignPayoutForm(prev => ({ ...prev, requestId: e.target.value }))}
          placeholder="Enter request ID"
          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
        />
      </div>

      <button
        onClick={() => executeContractFunction('signPayout', signPayoutForm)}
        disabled={!isConnected || loading.signPayout}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading.signPayout ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Sign Payout
          </>
        )}
      </button>

      <ResultDisplay result={results.signPayout} functionName="signPayout" />
    </div>
  );

  const DeactivateForm = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Deactivate Hackathon</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Hackathon ID
        </label>
        <input
          type="number"
          value={deactivateForm.hackathonId}
          onChange={(e) => setDeactivateForm(prev => ({ ...prev, hackathonId: e.target.value }))}
          placeholder="Enter hackathon ID"
          className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
        />
      </div>

      <div className="bg-red-900 border border-red-700 rounded-lg p-3">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
          <span className="text-red-300 text-sm">
            Warning: This action cannot be undone and will prevent new deposits and payouts.
          </span>
        </div>
      </div>

      <button
        onClick={() => executeContractFunction('deactivateHackathon', deactivateForm)}
        disabled={!isConnected || loading.deactivateHackathon}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading.deactivateHackathon ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <>
            <XCircle className="w-4 h-4 mr-2" />
            Deactivate Hackathon
          </>
        )}
      </button>

      <ResultDisplay result={results.deactivateHackathon} functionName="deactivateHackathon" />
    </div>
  );

  const ViewForms = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">View Hackathon Details</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Hackathon ID
          </label>
          <input
            type="number"
            value={viewHackathonForm.hackathonId}
            onChange={(e) => setViewHackathonForm(prev => ({ ...prev, hackathonId: e.target.value }))}
            placeholder="Enter hackathon ID"
            className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
          />
        </div>

        <button
          onClick={() => executeContractFunction('getHackathon', viewHackathonForm)}
          disabled={!isConnected || loading.getHackathon}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading.getHackathon ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Get Hackathon Details
            </>
          )}
        </button>

        <ResultDisplay result={results.getHackathon} functionName="getHackathon" />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">View Payout Request</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Request ID
          </label>
          <input
            type="number"
            value={viewPayoutForm.requestId}
            onChange={(e) => setViewPayoutForm(prev => ({ ...prev, requestId: e.target.value }))}
            placeholder="Enter request ID"
            className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
          />
        </div>

        <button
          onClick={() => executeContractFunction('getPayoutRequest', viewPayoutForm)}
          disabled={!isConnected || loading.getPayoutRequest}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading.getPayoutRequest ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Get Payout Request
            </>
          )}
        </button>

        <ResultDisplay result={results.getPayoutRequest} functionName="getPayoutRequest" />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">View Balances</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => executeContractFunction('getContractBalance', {})}
            disabled={!isConnected || loading.getContractBalance}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading.getContractBalance ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                Get Contract Balance
              </>
            )}
          </button>

          <div className="flex space-x-2">
            <input
              type="number"
              value={balanceForm.hackathonId}
              onChange={(e) => setBalanceForm(prev => ({ ...prev, hackathonId: e.target.value }))}
              placeholder="Hackathon ID"
              className="flex-1 p-2 border border-gray-600 rounded-md bg-gray-700 text-white"
            />
            <button
              onClick={() => executeContractFunction('getHackathonBalance', balanceForm)}
              disabled={!isConnected || loading.getHackathonBalance}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading.getHackathonBalance ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Get Balance
                </>
              )}
            </button>
          </div>
        </div>

        <ResultDisplay result={results.getContractBalance} functionName="getContractBalance" />
        <ResultDisplay result={results.getHackathonBalance} functionName="getHackathonBalance" />
      </div>
    </div>
  );

  const tabs = [
    { id: 'create', label: 'Create Hackathon', component: CreateHackathonForm },
    { id: 'deposit', label: 'Deposit Funds', component: DepositFundsForm },
    { id: 'addMultisig', label: 'Add Multisig', component: AddMultisigForm },
    { id: 'requestPayout', label: 'Request Payout', component: RequestPayoutForm },
    { id: 'signPayout', label: 'Sign Payout', component: SignPayoutForm },
    { id: 'deactivate', label: 'Deactivate', component: DeactivateForm },
    { id: 'view', label: 'View Data', component: ViewForms }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Hackathon Escrow Contract</h1>
          <p className="text-gray-400 text-center">Interact with your ink! smart contract functions</p>
        </div>

        <WalletConnection />

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          {tabs.find(tab => tab.id === activeTab)?.component()}
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;