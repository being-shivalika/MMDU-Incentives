import { Link } from "react-router-dom";
import { useState } from "react";
import { User,Lock,Eye,EyeOff,ArrowRight,} from "lucide-react";

const LoginPage = () => {
const [showPassword, setShowPassword] = useState(false);
const [role, setRole] = useState("");
const emailPlaceholders = {
  student: "Roll No / Admission No",
  teacher: "Employee ID",
  hod: "University ID",
  principal: "University ID",
  vc: "University ID",
  registrar: "University ID",
  rd: "Email ID",
  account: "Email ID",
  admin: "Email ID",
};
const passwordPlaceholders = {
  student: "Password",
  teacher: "Password",
  hod: "Password",
  principal: "Password",
  vc: "Password",
  registrar: "Password",
  rd: "Password",
  account: "Password",
  admin: "Password",
};

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
    <h1 className="text-4xl font-bold text-[#cba430]">
    MMU RPMS
    </h1>
    <p className="mt-2 text-sm text-[#242323]">
    Research Promotion Management System
    </p>
    </div>

    {/*For Login card */}
    <div className="mt-8 rounded-3xl border border-[#c5c3c3] bg-white p-8 shadow-xl">
    <h2 className="text-2xl font-semibold text-[#cba430]">
      Institutional Login
    </h2>
    <p className="mt-2 text-sm text-[#242323]">
    Login using your university credentials.
    </p>
    
    <div className="mt-8">
  <label className="mb-3 block text-lg font-semibold text-[#242323]">
    Select Role
  </label>

  <select
  value={role}
  onChange={(e) => setRole(e.target.value)}
  className="h-16 w-full rounded-2xl border border-[#c5c3c3] bg-white px-6 text-lg text-[#6c6969] outline-none transition focus:border-[#cba430]"
>
  <option value="">Select Role</option>

  <option value="student">Student</option>

  <option value="teacher">Teacher</option>

  <option value="hod">HOD</option>

  <option value="principal">Principal</option>

  <option value="vc">VC</option>

  <option value="registrar">Registrar</option>

  <option value="rd">R &amp; D</option>

  <option value="account">Account</option>

  <option value="admin">Admin</option>
</select>
  </div>

    <div className="mt-8">
    <label className="mb-3 block text-lg font-semibold text-[#242323]">
  {["admin", "rd", "account"].includes(role)
    ? "Email ID"
    : "University ID"}
</label>

    <div className="flex h-16 items-center rounded-2xl border border-[#c5c3c3] px-6 transition focus-within:border-[#cba430]">
    <User size={22} className="text-[#807d7d]" />

    <input
    type="text"
    placeholder={emailPlaceholders[role] || "Enter your ID"}
    className="ml-4 w-full text-xl outline-none placeholder:text-[#6c6969]" />
    </div>
    </div>

    <div className="mt-8">
    <div className="mb-3 flex items-end justify-between">
    <label className="text-lg font-semibold text-[#242323]">
    Password
    </label>

    <Link to="/forgot-password" className="text-base text-[#cba430] hover:underline" >
    Forgot Password?
    </Link>
    </div>

    <div className="flex h-16 items-center rounded-2xl border border-[#c5c3c3] px-6 transition focus-within:border-[#cba430]">
    <Lock size={22} className="text-[#807d7d]" />

    <input
    type={showPassword ? "text" : "password"}
    placeholder={passwordPlaceholders[role] || "Enter Password"}
    className="ml-4 w-full text-xl outline-none placeholder:text-[#6c6969]" />
    <button
    type="button"
    onClick={() => setShowPassword(!showPassword)} >
    {showPassword ? (
    <EyeOff size={22} className="text-[#807d7d]" />) : (<Eye size={22} className="text-[#807d7d]" /> )}
    </button>
    </div> 
    </div>
    {/* Login Button */}

    <button className="mt-7 flex h-12 w-full items-center justify-center rounded-xl bg-[#cba430] font-semibold text-white transition duration-300 hover:bg-[#cba430]">
    Sign In
   <ArrowRight size={18} className="ml-2" />
   </button>
   </div>
  
   <div className="mt-8 text-center">
   <div className="space-x-5 text-sm text-[#807d7d]">
    <button className="hover:text-[#cba430]">Privacy Policy</button>
    <span>•</span>
     <button className="hover:text-[#cba430]">IT Support</button>
    <span>•</span>
    <button className="hover:text-[#cba430]">Terms of Use</button>
   </div>
   <p className="mt-4 text-xs text-[#807d7d]">
    ©️ 2026 Maharishi Markandeshwar University. All rights reserved.
    </p>
   </div>
   </div>
   </div>
    </>
  );
};

export default LoginPage;