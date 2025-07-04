import React from "react";
import { Wallet, Loader, AlertCircle, CheckCircle } from "lucide-react";

const formatAddress = (address = "") =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const Login = ({
  error,
  accounts,
  isConnecting,
  isExtensionAvailable,
  selectedAccount,
  connectWallet,
  selectAccount,
}) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-4 flex items-center justify-center">
    <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <div className="mx-auto mb-5 flex items-center justify-center">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 shadow-lg">
            <Wallet className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          Hackathonia
        </h1>
        <p className="text-indigo-200/90 max-w-xs mx-auto">
          Securely connect your Polkadot wallet
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/20 backdrop-blur border border-red-500/30 mb-6 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
          <span className="text-red-100 font-medium text-sm">{error}</span>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={connectWallet}
          disabled={!isExtensionAvailable || isConnecting}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-lg
            hover:from-indigo-600 hover:to-purple-700 transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2 h-14"
        >
          {isConnecting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              <span>Connect Wallet</span>
            </>
          )}
        </button>

        {!isExtensionAvailable && (
          <p className="mt-3 text-center text-sm text-rose-400">
            Polkadot extension not detected
          </p>
        )}
      </div>

      {accounts.length > 1 && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="bg-indigo-500/20 h-8 w-1 rounded-r"></span>
            Select Account
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {accounts.map((account, index) => (
              <div
                key={account.address}
                onClick={() => selectAccount(account)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedAccount?.address === account.address
                    ? "border-indigo-400 bg-indigo-500/20 shadow-lg"
                    : "border-white/10 hover:border-indigo-400/50 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">
                      {account.meta.name || `Account ${index + 1}`}
                    </div>
                    <div className="text-sm text-indigo-200/80 font-mono tracking-tight mt-1">
                      {formatAddress(account.address)}
                    </div>
                  </div>
                  {selectedAccount?.address === account.address && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    <style jsx>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(192, 132, 252, 0.5);
        border-radius: 4px;
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-in-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}</style>
  </div>
);

export default Login;
