import React from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { Briefcase, Save, Database, Bell, Lock } from "lucide-react";

const PortalSettings = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Portal Settings"
        subtitle="Configure application-wide parameters and preferences."
        icon={Briefcase}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-3 bg-indigo-50 text-indigo-700 font-medium rounded-lg flex items-center gap-3 border border-indigo-100 transition-colors">
            <Database size={18} /> General Setup
          </button>
          <button className="w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 font-medium rounded-lg flex items-center gap-3 transition-colors">
            <Bell size={18} /> Email & Notifications
          </button>
          <button className="w-full text-left px-4 py-3 text-gray-600 hover:bg-gray-50 font-medium rounded-lg flex items-center gap-3 transition-colors">
            <Lock size={18} /> Security
          </button>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-6 text-lg">General Setup</h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
                <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" defaultValue="Maharishi Markandeshwar (Deemed to be University)" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Financial Year Start</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  <option>April 1st</option>
                  <option>January 1st</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Incentive Currency</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input type="checkbox" id="maintenance" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
                <label htmlFor="maintenance" className="text-sm text-gray-700 font-medium">Enable Maintenance Mode (Restricts access to non-admins)</label>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  <Save size={18} /> Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalSettings;
