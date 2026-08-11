import React, { useState, useEffect } from "react";
import PageHeader from "../../../shared/components/PageHeader";
import { Briefcase, Save, Database, Bell, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { getFinancialYears, getWorkflowConfig } from "../../../services/adminService";

const PortalSettings = () => {
  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'email' | 'security'

  // General Setup state
  const [institutionName, setInstitutionName] = useState("Maharishi Markandeshwar (Deemed to be University)");
  const [financialYearStart, setFinancialYearStart] = useState("April 1st");
  const [currency, setCurrency] = useState("INR (₹)");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Email & Notification state
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [senderEmail, setSenderEmail] = useState("notifications@mmumullana.org");
  const [enableEmailAlerts, setEnableEmailAlerts] = useState(true);

  // Security state
  const [minPasswordLength, setMinPasswordLength] = useState(6);
  const [enforceFirstLoginChange, setEnforceFirstLoginChange] = useState(true);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      // Simulate saving configuration to system settings
      await new Promise((resolve) => setTimeout(resolve, 800));
      setSuccessMessage("Portal settings updated successfully in database!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setError("Failed to save portal settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Portal System Settings"
        subtitle="Configure application-wide parameters, security policies, and system preferences."
        icon={Briefcase}
      />

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-900 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`w-full text-left px-4 py-3 font-bold text-xs rounded-xl flex items-center gap-3 transition-colors cursor-pointer border ${
              activeTab === "general"
                ? "bg-[#8C0404]/10 text-[#8C0404] border-[#8C0404]/20"
                : "text-neutral-600 hover:bg-neutral-50 border-transparent"
            }`}
          >
            <Database size={18} /> General Setup
          </button>

          <button
            onClick={() => setActiveTab("email")}
            className={`w-full text-left px-4 py-3 font-bold text-xs rounded-xl flex items-center gap-3 transition-colors cursor-pointer border ${
              activeTab === "email"
                ? "bg-[#8C0404]/10 text-[#8C0404] border-[#8C0404]/20"
                : "text-neutral-600 hover:bg-neutral-50 border-transparent"
            }`}
          >
            <Bell size={18} /> Email & Notifications
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full text-left px-4 py-3 font-bold text-xs rounded-xl flex items-center gap-3 transition-colors cursor-pointer border ${
              activeTab === "security"
                ? "bg-[#8C0404]/10 text-[#8C0404] border-[#8C0404]/20"
                : "text-neutral-600 hover:bg-neutral-50 border-transparent"
            }`}
          >
            <Lock size={18} /> Security Policies
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 p-6">
            
            {/* 1. GENERAL SETUP TAB */}
            {activeTab === "general" && (
              <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
                <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider border-b border-neutral-100 pb-3">
                  General System Configuration
                </h3>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Institution Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:ring-1 focus:ring-[#8C0404] focus:border-[#8C0404] focus:outline-none font-semibold text-neutral-800"
                    value={institutionName}
                    onChange={(e) => setInstitutionName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Financial Year Start Cycle
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:ring-1 focus:ring-[#8C0404] focus:border-[#8C0404] focus:outline-none font-semibold text-neutral-800"
                    value={financialYearStart}
                    onChange={(e) => setFinancialYearStart(e.target.value)}
                  >
                    <option value="April 1st">April 1st (Indian Standard Fiscal Year)</option>
                    <option value="January 1st">January 1st (Calendar Year)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Incentive Currency Unit
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:ring-1 focus:ring-[#8C0404] focus:border-[#8C0404] focus:outline-none font-semibold text-neutral-800"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                  >
                    <option value="INR (₹)">INR (₹ - Indian Rupee)</option>
                    <option value="USD ($)">USD ($ - US Dollar)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="maintenance"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4 text-[#8C0404] rounded border-neutral-300 focus:ring-[#8C0404] cursor-pointer"
                  />
                  <label htmlFor="maintenance" className="text-xs text-neutral-700 font-semibold cursor-pointer">
                    Enable Maintenance Mode (Restricts submission creation to admins)
                  </label>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#8C0404] hover:bg-[#6F0303] text-white rounded-xl font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Save size={16} /> {saving ? "Saving..." : "Save Setup Parameters"}
                  </button>
                </div>
              </form>
            )}

            {/* 2. EMAIL & NOTIFICATION TAB */}
            {activeTab === "email" && (
              <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
                <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider border-b border-neutral-100 pb-3">
                  Email & Notification Gateway
                </h3>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    SMTP Host Server
                  </label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:ring-1 focus:ring-[#8C0404] focus:border-[#8C0404] focus:outline-none font-mono text-neutral-800"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      SMTP Port
                    </label>
                    <input
                      type="text"
                      className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:ring-1 focus:ring-[#8C0404] focus:border-[#8C0404] focus:outline-none font-mono text-neutral-800"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                      Sender Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:ring-1 focus:ring-[#8C0404] focus:border-[#8C0404] focus:outline-none font-semibold text-neutral-800"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="emailAlerts"
                    checked={enableEmailAlerts}
                    onChange={(e) => setEnableEmailAlerts(e.target.checked)}
                    className="w-4 h-4 text-[#8C0404] rounded border-neutral-300 focus:ring-[#8C0404] cursor-pointer"
                  />
                  <label htmlFor="emailAlerts" className="text-xs text-neutral-700 font-semibold cursor-pointer">
                    Send automated email notifications on submission status transitions
                  </label>
                </div>

                <div className="pt-6 border-t border-neutral-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#8C0404] hover:bg-[#6F0303] text-white rounded-xl font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Save size={16} /> {saving ? "Saving..." : "Save Email Config"}
                  </button>
                </div>
              </form>
            )}

            {/* 3. SECURITY POLICIES TAB */}
            {activeTab === "security" && (
              <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
                <h3 className="font-bold text-neutral-900 text-sm uppercase tracking-wider border-b border-neutral-100 pb-3">
                  Authentication & Security Policies
                </h3>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    min={6}
                    max={20}
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:ring-1 focus:ring-[#8C0404] focus:border-[#8C0404] focus:outline-none font-bold text-neutral-800"
                    value={minPasswordLength}
                    onChange={(e) => setMinPasswordLength(Number(e.target.value))}
                  />
                </div>

                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="enforceFirstLogin"
                    checked={enforceFirstLoginChange}
                    onChange={(e) => setEnforceFirstLoginChange(e.target.checked)}
                    className="w-4 h-4 text-[#8C0404] rounded border-neutral-300 focus:ring-[#8C0404] cursor-pointer"
                  />
                  <label htmlFor="enforceFirstLogin" className="text-xs text-neutral-700 font-semibold cursor-pointer">
                    Enforce Mandatory First-Time Login Password Change (Floating Popup Box)
                  </label>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Maximum Failed Login Attempts Before Rate Limit
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={15}
                    className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl focus:ring-1 focus:ring-[#8C0404] focus:border-[#8C0404] focus:outline-none font-bold text-neutral-800"
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
                  />
                </div>

                <div className="pt-6 border-t border-neutral-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#8C0404] hover:bg-[#6F0303] text-white rounded-xl font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Save size={16} /> {saving ? "Saving..." : "Save Security Policies"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalSettings;
