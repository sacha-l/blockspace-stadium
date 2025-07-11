// PolkadotHackathonDashboard.jsx (Refactored for best practices)
"use client";

import {
  ChartBar,
  FileText,
  FolderOpen,
  LogOut,
  Settings,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";

import ProjectsTab from "./components/Projects";
import SettingsTab from "./components/Settings";
import SubmissionsTab from "./components/Submissions";
import Milestone1Display from "./Milestone1Display";
import api from "./services/api";

import Login from "./components/Login";

const PolkadotHackathonDashboard = () => {
  const [state, setState] = useState({
    isExtensionAvailable: false,
    isConnected: false,
    isConnecting: false,
    accounts: [],
    selectedAccount: null,
    error: "",
    injector: null,
    activeTab: "projects",
    loaded: false,
  });

  const [formData, setFormData] = useState({});
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    api
      .healthCheck()
      .catch((err) => console.error("API Health Check Failed:", err));
    checkExtension();

    // Restore session if account exists in sessionStorage
    const sessionAccount = sessionStorage.getItem("session_account");
    if (sessionAccount) {
      const account = JSON.parse(sessionAccount);
      setState((prev) => ({
        ...prev,
        selectedAccount: account,
        isConnected: true,
      }));
    }
  }, []);

  useEffect(() => {
    if (!state.selectedAccount?.address) return;

    const fetchData = async () => {
      try {
        const { data } = await api.getEntryByAddress(
          state.selectedAccount.address
        );
        if (data) {
          setFormData(data);
        }
        // Always set loaded to true, even if no data
        setState((prev) => ({ ...prev, loaded: true }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setState((prev) => ({ ...prev, loaded: true }));
      }
    };

    fetchData();
  }, [state.selectedAccount]);

  const checkExtension = async () => {
    try {
      await waitForExtension();
      setState((prev) => ({ ...prev, isExtensionAvailable: true, error: "" }));
    } catch {
      setState((prev) => ({
        ...prev,
        isExtensionAvailable: false,
        error: "Polkadot-JS extension not found. Please install it first.",
      }));
    }
  };

  const waitForExtension = () =>
    new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 10;
      const interval = setInterval(() => {
        if (
          window.injectedWeb3 &&
          Object.keys(window.injectedWeb3).length > 0
        ) {
          clearInterval(interval);
          resolve();
        } else if (++attempts >= maxAttempts) {
          clearInterval(interval);
          reject();
        }
      }, 500);
    });

  const connectWallet = async () => {
    if (!state.isExtensionAvailable) return;

    setState((prev) => ({ ...prev, isConnecting: true, error: "" }));

    try {
      const { web3Enable, web3Accounts } = await import(
        "@polkadot/extension-dapp"
      );
      const extensions = await web3Enable("Blockspacebuilders");
      if (!extensions.length)
        throw new Error("No extension authorization given.");

      const allAccounts = await web3Accounts();
      if (!allAccounts.length)
        throw new Error("No accounts found in extension.");

      setState((prev) => ({
        ...prev,
        accounts: allAccounts,
        isConnected: true,
        isConnecting: false,
      }));

      if (allAccounts.length === 1) selectAccount(allAccounts[0]);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: `Connection failed: ${err.message}`,
        isConnecting: false,
      }));
    }
  };

  const selectAccount = async (account) => {
    try {
      const { web3FromSource } = await import("@polkadot/extension-dapp");
      const injector = await web3FromSource(account.meta.source);
      sessionStorage.setItem("session_account", JSON.stringify(account));
      setState((prev) => ({ ...prev, selectedAccount: account, injector }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: `Failed to select account: ${err.message}`,
      }));
    }
  };

  const disconnect = () => {
    setState({
      isExtensionAvailable: true,
      isConnected: false,
      isConnecting: false,
      accounts: [],
      selectedAccount: null,
      error: "",
      injector: null,
      activeTab: "projects",
      loaded: false,
    });
    setFormData({});
    sessionStorage.clear("session_account");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const formatAddress = (address = "") =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const renderTabContent = () => {
    switch (state.activeTab) {
      case "projects":
        return (
          <ProjectsTab
            sessionAddress={state.selectedAccount.address}
            onInputChange={handleInputChange}
            loaded={state.loaded}
            formData={formData}
          />
        );
      case "progress":
        return <Milestone1Display submissionInfo={formData} />;
      case "submissions":
        return (
          <SubmissionsTab sessionAddress={state?.selectedAccount?.address} />
        );
      case "settings":
        return <SettingsTab account={state.selectedAccount} />;
      default:
        return null;
    }
  };

  const tabs = [
    { id: "projects", label: "Submit M1", icon: FolderOpen },
    { id: "progress", label: "View", icon: ChartBar },
    { id: "submissions", label: "Submissions", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (!state.isConnected || !state.selectedAccount) {
    return (
      <Login
        error={state.error}
        accounts={state.accounts}
        isConnecting={state.isConnecting}
        isExtensionAvailable={state.isExtensionAvailable}
        selectedAccount={state.selectedAccount}
        connectWallet={connectWallet}
        selectAccount={selectAccount}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mr-3">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Blockspacebuilders</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {state.selectedAccount.meta.name || "Account"} •{" "}
              {formatAddress(state.selectedAccount.address)}
            </span>
            <button
              onClick={disconnect}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-8">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setState((prev) => ({ ...prev, activeTab: id }))}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                state.activeTab === id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default PolkadotHackathonDashboard;
