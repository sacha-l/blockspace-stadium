import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Loader, 
  Wallet, 
  LogOut, 
  FolderOpen, 
  FileText, 
  Settings, 
  Plus,
  Calendar,
  Users,
  Trophy,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter
} from 'lucide-react';import SubmitMilestone1Form from './SubmitMilestone1Form';
import api from "./services/api";

const PolkadotHackathonDashboard = () => {
  const [isExtensionAvailable, setIsExtensionAvailable] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [error, setError] = useState('');
  const [injector, setInjector] = useState(null);
  const [activeTab, setActiveTab] = useState('projects');

  // Mock data for demonstration
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "DeFi Innovation Challenge",
      description: "Build the next generation of DeFi protocols",
      status: "active",
      startDate: "2025-01-15",
      endDate: "2025-02-15",
      participants: 45,
      prizePool: "50,000 DOT",
      submissions: 12
    },
    {
      id: 2,
      name: "Web3 Gaming Hackathon",
      description: "Create immersive blockchain gaming experiences",
      status: "upcoming",
      startDate: "2025-03-01",
      endDate: "2025-03-31",
      participants: 23,
      prizePool: "25,000 DOT",
      submissions: 0
    },
    {
      id: 3,
      name: "Polkadot Parachain Builder",
      description: "Build innovative parachains for the Polkadot ecosystem",
      status: "completed",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      participants: 67,
      prizePool: "100,000 DOT",
      submissions: 23
    }
  ]);

  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      projectName: "DeFi Innovation Challenge",
      teamName: "DefiBuilders",
      submissionTitle: "Cross-Chain Yield Optimizer",
      submittedAt: "2025-02-10",
      status: "pending",
      score: null
    },
    {
      id: 2,
      projectName: "Polkadot Parachain Builder",
      teamName: "ChainCrafters",
      submissionTitle: "Privacy-First Social Network",
      submittedAt: "2024-12-28",
      status: "scored",
      score: 85
    },
    {
      id: 3,
      projectName: "DeFi Innovation Challenge",
      teamName: "BlockchainInnovators",
      submissionTitle: "Automated Market Maker 2.0",
      submittedAt: "2025-02-08",
      status: "under_review",
      score: null
    }
  ]);

  // Check for extension availability on component mount
  useEffect(() => {
    checkExtension()

  }, [])
  useEffect(() => {
    api.healthCheck().then(response => {
      console.log('API Health Check:', response);
    }).catch(error => {
      console.error('API Health Check Failed:', error);
    });
  }, []);

  const checkExtension = async () => {

    try {
      await waitForExtension();
      setIsExtensionAvailable(true);
      setError('');
    } catch (err) {
      setError('Polkadot-JS extension not found. Please install it first.');
      setIsExtensionAvailable(false);
    }
  };

  const waitForExtension = () => {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 10;
      
      const checkInterval = setInterval(() => {
        attempts++;
        
        if (window.injectedWeb3 && Object.keys(window.injectedWeb3).length > 0) {
          clearInterval(checkInterval);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error('Extension timeout'));
        }
      }, 500);
    });
  };

  const connectWallet = async () => {
    if (!isExtensionAvailable) return;
    
    setIsConnecting(true);
    setError('');
    
    try {
      const { web3Accounts, web3Enable, web3FromSource } = await import('@polkadot/extension-dapp');
      
      const extensions = await web3Enable('Hackathonia');
      
      if (extensions.length === 0) {
        throw new Error('No extension authorization given.');
      }

      const allAccounts = await web3Accounts();
      
      if (allAccounts.length === 0) {
        throw new Error('No accounts found. Please create an account in your extension.');
      }

      setAccounts(allAccounts);
      setIsConnected(true);
      
      if (allAccounts.length === 1) {
        await selectAccount(allAccounts[0]);
      }
      
    } catch (err) {
      setError(`Connection failed: ${err.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const selectAccount = async (account) => {
    try {
      const { web3FromSource } = await import('@polkadot/extension-dapp');
      const accountInjector = await web3FromSource(account.meta.source);
      
      setSelectedAccount(account);
      setInjector(accountInjector);
      
    } catch (err) {
      setError(`Failed to select account: ${err.message}`);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccounts([]);
    setSelectedAccount(null);
    setInjector(null);
    setError('');
    setActiveTab('projects');
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scored': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Login Component
  const LoginComponent = () => (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 p-4 flex items-center justify-center">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Hackathonia</h1>
          <p className="text-gray-600">Connect your Polkadot wallet to continue</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg border bg-red-100 text-red-700 border-red-200 mb-4">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <button
          onClick={connectWallet}
          disabled={!isExtensionAvailable || isConnecting}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold 
                   hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                   transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isConnecting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </>
          )}
        </button>

        {isConnected && accounts.length > 1 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Account</h3>
            <div className="space-y-2">
              {accounts.map((account, index) => (
                <div
                  key={account.address}
                  onClick={() => selectAccount(account)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedAccount?.address === account.address
                      ? 'border-purple-500 bg-purple-50 shadow-md'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">
                        {account.meta.name || `Account ${index + 1}`}
                      </div>
                      <div className="text-sm text-gray-600 font-mono">
                        {formatAddress(account.address)}
                      </div>
                    </div>
                    {selectedAccount?.address === account.address && (
                      <CheckCircle className="w-5 h-5 text-purple-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Projects Tab Component
  const ProjectsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Submit Milestone 1</h2>
          <p className="text-gray-600">Submit your hackathon MVP and demonstrate your core functionality to the judges</p>
        </div>
      </div>

      <SubmitMilestone1Form />
    </div>
  );

  // Submissions Tab Component
  const SubmissionsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Submissions</h2>
          <p className="text-gray-600">Review and manage hackathon submissions</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{submission.submissionTitle}</div>
                    <div className="text-sm text-gray-500">Submitted {submission.submittedAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{submission.projectName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{submission.teamName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                      {submission.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {submission.score ? `${submission.score}/100` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-purple-600 hover:text-purple-900">Review</button>
                      <button className="text-gray-600 hover:text-gray-900">Download</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Settings Tab Component
  const SettingsTab = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage your dashboard preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Wallet Address</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md font-mono text-sm">
                {selectedAccount?.address}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Name</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                {selectedAccount?.meta.name || 'Unnamed Account'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Extension Source</label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
                {selectedAccount?.meta.source}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50" />
                <span className="ml-2 text-sm text-gray-700">Email notifications</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Browser notifications</span>
              </label>
            </div>
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50" />
                <span className="ml-2 text-sm text-gray-700">Dark mode</span>
              </label>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard Component
  const DashboardComponent = () => {
    const tabs = [
      { id: 'projects', label: 'Submit M1', icon: FolderOpen },
      { id: 'submissions', label: 'Submissions', icon: FileText },
      { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const renderTabContent = () => {
      switch (activeTab) {
        case 'projects':
          return <ProjectsTab />;
        case 'submissions':
          return <SubmissionsTab />;
        case 'settings':
          return <SettingsTab />;
        default:
          return <ProjectsTab />;
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Hackathonia</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  {selectedAccount?.meta.name || 'Account'} • {formatAddress(selectedAccount?.address)}
                </div>
                <button
                  onClick={disconnect}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderTabContent()}
        </main>
      </div>
    );
  };

  // Main render logic
  if (!isConnected || !selectedAccount) {
    return <LoginComponent />;
  }

  return <DashboardComponent />;
};

export default PolkadotHackathonDashboard;
