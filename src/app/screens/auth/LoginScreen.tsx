import { useState } from "react";
import { User, Eye, Globe } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { MascotSVG } from "../../components/common/MascotSVG";
import { InputField } from "../../components/common/InputField";
import { PrimaryButton } from "../../components/common/PrimaryButton";

export function LoginScreen({ onDone, onRegister }: { onDone: () => void; onRegister: () => void }) {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleLogin = async () => {
    clearError();
    setLocalError(null);
    if (!email || !password) {
      setLocalError("Please enter email and password");
      return;
    }
    try {
      await login(email, password);
      onDone();
    } catch {
    }

  };

  const displayError = localError || error;

  return (
    <div className="h-full min-h-full flex-1 flex flex-col bg-[#F7F9F6] px-6 pt-16">
      <div className="flex flex-col items-center mb-8">
        <MascotSVG size={72} animate />
        <h1 className="text-3xl font-black text-[#222E1C] mt-4 font-display">Welcome Back</h1>
        <p className="text-[#5F6B5E] text-sm mt-1 font-medium">Sign in to continue your heritage journey</p>
      </div>
      <div className="flex flex-col gap-4 bg-white p-6 rounded-3xl border border-[#E4E7EB] shadow-[0_4px_20px_rgba(35,53,31,0.03)]">
        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-xs font-medium">
            {displayError}
          </div>
        )}
        <InputField placeholder="Email address" icon={<User size={16} />} value={email} onChange={setEmail} />
        <InputField placeholder="Password" type="password" icon={<Eye size={16} />} value={password} onChange={setPassword} />
        <div className="text-right">
          <button className="text-[#69A20D] text-xs font-bold hover:underline">Forgot password?</button>
        </div>
        <PrimaryButton label={isLoading ? "Signing In..." : "Sign In"} full onClick={handleLogin} />
        <div className="relative flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-[#E4E7EB]" />
          <span className="text-[#94A3B8] text-xs font-medium">or continue with</span>
          <div className="flex-1 h-px bg-[#E4E7EB]" />
        </div>
        <div className="flex gap-3">
          {["Google", "Apple"].map(p => (
            <button key={p} className="flex-1 flex items-center justify-center gap-2 border border-[#E4E7EB] rounded-2xl py-3 text-xs font-bold text-[#222E1C] bg-[#EEF1F3] hover:bg-[#EAF6DD] transition-all duration-200">
              <Globe size={15} className="text-[#69A20D]" />{p}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-auto pb-10 text-center">
        <span className="text-[#5F6B5E] text-sm">New explorer? </span>
        <button onClick={onRegister} className="text-[#23351F] text-sm font-black underline">Create Account</button>
      </div>
    </div>
  );
}
