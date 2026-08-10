import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Ui/Input";
import Button from "../../components/Ui/Button";
import Card from "../../components/Ui/Card";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";
import { requestForgotPassword, submitResetPassword } from "../../services/authService";
import { KeyRound, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password state
  const [viewMode, setViewMode] = useState("login"); // 'login' | 'forgot' | 'reset'
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const loggedInUser = await login(email, password);
      const role = loggedInUser.role?.toLowerCase();
      let dashboardRoute = ROUTES.HOME;

      switch (role) {
        case "student":
        case "faculty":
          dashboardRoute = ROUTES.APPLICANT_DASHBOARD;
          break;
        case "hod":
          dashboardRoute = ROUTES.DEPARTMENT_REVIEW;
          break;
        case "principal":
          dashboardRoute = ROUTES.PRINCIPAL_DASHBOARD;
          break;
        case "director":
          dashboardRoute = ROUTES.DIRECTOR_DASHBOARD;
          break;
        case "rd_cell":
        case "rpc_cell":
          dashboardRoute = ROUTES.RESEARCH_REVIEW;
          break;
        case "accounts":
          dashboardRoute = ROUTES.ACCOUNTS;
          break;
        case "registrar":
          dashboardRoute = ROUTES.REGISTRAR;
          break;
        case "vc":
          dashboardRoute = ROUTES.VC;
          break;
        case "admin":
          dashboardRoute = ROUTES.ADMIN;
          break;
      }

      navigate(dashboardRoute);
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    if (!forgotEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestForgotPassword(forgotEmail);
      if (res.success) {
        setSuccessMessage("Password reset OTP generated successfully.");
        if (res.resetToken) {
          setResetToken(res.resetToken);
        }
        setViewMode("reset");
      } else {
        setError(res.message || "Failed to process password reset request.");
      }
    } catch (err) {
      setError(err.message || "No account found with this email address.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!resetToken) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }
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
      const res = await submitResetPassword(forgotEmail, resetToken, newPassword);
      if (res.success) {
        setEmail(forgotEmail);
        setPassword("");
        setViewMode("login");
        setSuccessMessage("Password reset successfully! Please log in with your new password.");
      } else {
        setError(res.message || "Failed to reset password.");
      }
    } catch (err) {
      setError(err.message || "Invalid or expired reset code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="min-h-screen flex items-center justify-center bg-slate-50/80 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-neutral-100/80">
        
        {/* Banner header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            MMDU RPMS Portal
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Research Promotion & Incentive Management System
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-800 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" /> {successMessage}
          </div>
        )}

        {/* ================= 1. LOGIN VIEW ================= */}
        {viewMode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                label="Email Address"
                type="email"
                placeholder="e.g. faculty@mmdu.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-200 p-3 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wide">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccessMessage("");
                    setForgotEmail(email);
                    setViewMode("forgot");
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-200 p-3 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <Button
              varient="primary"
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-700 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-md"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        )}

        {/* ================= 2. FORGOT PASSWORD REQUEST VIEW ================= */}
        {viewMode === "forgot" && (
          <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold text-neutral-900">Forgot Password</h2>
            </div>
            <p className="text-xs text-neutral-500">
              Enter your registered MMDU email address. We will generate a secure 6-digit reset OTP code for your account.
            </p>

            <div>
              <Input
                label="Registered Email Address"
                type="email"
                placeholder="e.g. faculty@mmdu.ac.in"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-200 p-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <Button
              varient="primary"
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-blue-700 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50 transition-colors shadow-md"
            >
              {isLoading ? "Generating OTP..." : "Send Reset Code (OTP)"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccessMessage("");
                setViewMode("login");
              }}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 pt-2 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
            </button>
          </form>
        )}

        {/* ================= 3. RESET PASSWORD SUBMIT VIEW ================= */}
        {viewMode === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4 text-left">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <h2 className="text-base font-bold text-neutral-900">Set New Password</h2>
            </div>
            <p className="text-xs text-neutral-500">
              OTP code sent for <span className="font-bold text-neutral-800">{forgotEmail}</span>. Enter the OTP code and your new password.
            </p>

            <div>
              <Input
                label="6-Digit Reset OTP Code"
                type="text"
                placeholder="e.g. 482910"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-200 p-3 text-sm font-mono tracking-widest text-center font-bold text-neutral-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <Input
                label="New Password"
                type="password"
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-200 p-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-200 p-3 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <Button
              varient="primary"
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-emerald-700 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50 transition-colors shadow-md"
            >
              {isLoading ? "Updating Password..." : "Reset & Save Password"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccessMessage("");
                setViewMode("forgot");
              }}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 pt-2 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Email Step
            </button>
          </form>
        )}

      </div>
    </Card>
  );
};

export default LoginPage;
