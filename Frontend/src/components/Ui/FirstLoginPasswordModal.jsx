import React, { useState } from "react";
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { changeFirstPassword } from "../../services/authService";
import Button from "./Button";
import Input from "./Input";

const FirstLoginPasswordModal = ({ isOpen, user, onSuccess, updateUser }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await changeFirstPassword(newPassword);
      setIsSuccess(true);

      if (updateUser) {
        updateUser(updatedUser || { isFirstLogin: false });
      }

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(updatedUser);
        }
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-slate-900/60 animate-in fade-in duration-300">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-neutral-100/90 text-left relative overflow-hidden">
        
        {/* Top Decorative Header */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-100">
          <div className="h-12 w-12 rounded-xl bg-[#8C0404]/10 border border-[#8C0404]/20 flex items-center justify-center text-[#8C0404] shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-900 leading-snug">
              First-Time Password Change
            </h2>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">
              MMDU RPMS Security Verification
            </p>
          </div>
        </div>

        {/* Informative Banner */}
        <div className="mb-5 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed font-medium">
          👋 Welcome <strong>{user?.name || "Faculty"}</strong>! You are logging in with your official account for the first time. Please update your default password to continue to your dashboard.
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Banner */}
        {isSuccess && (
          <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <span>Password changed successfully! Redirecting to your dashboard...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
              New Password
            </label>
            <div className="relative flex items-center">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading || isSuccess}
                className="w-full rounded-xl border border-neutral-200 p-3 pr-11 text-sm outline-none focus:border-[#8C0404] focus:ring-1 focus:ring-[#8C0404]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-neutral-400 hover:text-neutral-600 cursor-pointer p-1 rounded-md transition-colors"
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-1">
              Confirm New Password
            </label>
            <div className="relative flex items-center">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading || isSuccess}
                className="w-full rounded-xl border border-neutral-200 p-3 pr-11 text-sm outline-none focus:border-[#8C0404] focus:ring-1 focus:ring-[#8C0404]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 text-neutral-400 hover:text-neutral-600 cursor-pointer p-1 rounded-md transition-colors"
                tabIndex={-1}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full mt-2 rounded-xl bg-[#8C0404] py-3 text-sm font-bold text-white hover:bg-[#6F0303] disabled:opacity-50 transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="h-4 w-4" />
            {isLoading
              ? "Updating Password..."
              : isSuccess
              ? "Password Updated!"
              : "Update Password & Proceed to Dashboard"}
          </Button>
        </form>

        <p className="text-[11px] text-neutral-400 text-center mt-4">
          This security requirement is shown only on your first login.
        </p>
      </div>
    </div>
  );
};

export default FirstLoginPasswordModal;
