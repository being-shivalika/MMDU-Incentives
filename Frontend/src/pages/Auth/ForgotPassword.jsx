import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Send } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center px-4 py-10 bg-white"
        style={{
          backgroundImage:
            "radial-gradient(rgba(197,195,195,0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#8c0404]">MMU RPMS</h1>

            <p className="mt-2 text-sm text-[#242323]">
              Research Promotion Management System{" "}
            </p>
          </div>

          <div className="mt-8 rounded-3xl border border-[#c5c3c3] bg-white p-8 shadow-xl">
            <h2 className="text-2xl font-semibold text-[#8c0404]">
              Forgot Password
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#242323]">
              Enter your registered email address to receive password reset
              instructions.{" "}
            </p>

            <div className="mt-8">
              <label className="mb-3 block text-lg font-semibold text-[#242323]">
                Registered Email
              </label>

              <div className="flex h-16 items-center rounded-2xl border border-[#c5c3c3] px-6 transition focus-within:border-[#8c0404]">
                <Mail size={22} className="text-[#807d7d]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="ml-4 w-full text-lg outline-none placeholder:text-[#6c6969]"
                />
              </div>
            </div>

            <button className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-[#8c0404] font-semibold text-white transition duration-300 hover:bg-[#6f0303]">
              Send Reset Link
              <Send size={18} className="ml-2" />
            </button>

            <Link
              to="/"
              className="mt-6 flex items-center justify-center text-[#8c0404] hover:underline"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Login
            </Link>
          </div>

          <div className="mt-8 text-center">
            <div className="space-x-5 text-sm text-[#807d7d]">
              <button className="hover:text-[#8c0404]">Privacy Policy</button>
              <span>•</span>
              <button className="hover:text-[#8c0404]">IT Support</button>
              <span>•</span>
              <button className="hover:text-[#8c0404]">Terms of Use</button>
            </div>
            <p className="mt-4 text-xs text-[#807d7d]">
              © 2026 Maharishi Markandeshwar University. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
