import { useState } from "react";
import {
  User,Lock,Eye,EyeOff,} from "lucide-react";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>  
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-white"
    style={{
          backgroundImage:
            "radial-gradient(rgba(197,195,195,0.3) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >

    <div className="w-full max-w-md">
    <div className="text-center">
    <h1 className="text-4xl font-bold text-[#8c0404]">
    MMU RPMS
    </h1>
    <p className="mt-2 text-sm text-[#242323]">
    Research Promotion Management System
    </p>
    </div>

    {/*For Login card */}
    <div className="mt-8 rounded-3xl border border-[#c5c3c3] bg-white p-8 shadow-xl">
    <h2 className="text-2xl font-semibold text-[#8c0404]">
      Institutional Login
    </h2>
    <p className="mt-2 text-sm text-[#242323]">
    Login using your university credentials.
    </p>

    <div className="mt-6">
    <label className="mb-2 block text-sm font-medium text-[#242323]">
        University ID
    </label>

    <div className="flex h-12 items-center rounded-xl border border-[#c5c3c3] px-4 transition focus-within:border-[#8c0404]">
    <User size={18} className="#807d7d" />

    <input
    type="text"
    placeholder="MMU-11253416"
    className="ml-3 w-full outline-none placeholder:text-[#c5c3c3]" />

    </div>
    </div>
    </div>

    </div>
    </div>
    </>
  );
};

export default LoginPage;