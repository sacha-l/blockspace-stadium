import React from "react";

const SettingsTab = ({ account }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      <p className="text-gray-600">Manage your dashboard preferences</p>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Account Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Wallet Address
            </label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md font-mono text-sm">
              {account?.address}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Account Name
            </label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
              {account?.meta.name || "Unnamed Account"}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Extension Source
            </label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm">
              {account?.meta.source}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Dashboard Preferences
        </h3>
        <div className="space-y-4">
          {["Email notifications", "Browser notifications", "Dark mode"].map(
            (label, idx) => (
              <label key={idx} className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-purple-600 shadow-sm focus:ring-purple-200"
                  defaultChecked={label === "Browser notifications"}
                />
                <span className="ml-2 text-sm text-gray-700">{label}</span>
              </label>
            )
          )}
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

export default SettingsTab;
