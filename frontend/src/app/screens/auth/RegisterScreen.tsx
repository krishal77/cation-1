import { useState } from "react";
import { ArrowLeft, User, Eye, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { InputField } from "../../components/common/InputField";
import { PrimaryButton } from "../../components/common/PrimaryButton";

export function RegisterScreen({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const { register, isLoading, error, clearError } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const handleRegister = async () => {
    clearError();
    setLocalError(null);
    if (!firstName || !email || !password) {
      setLocalError("Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    try {
      const fullName = lastName ? `${firstName} ${lastName}` : firstName;
      await register(fullName, email, password);
      onDone();
    } catch {
    }

  };

  const displayError = localError || error;

  return (
    <div className="h-full min-h-full flex-1 flex flex-col bg-[#F7F9F6] px-6 pt-14">
      <button onClick={onBack} className="w-9 h-9 rounded-full bg-[#EEF1F3] flex items-center justify-center mb-4 text-[#222E1C]">
        <ArrowLeft size={18} />
      </button>
      <h1 className="text-3xl font-black text-[#222E1C] font-display">Join the Journey</h1>
      <p className="text-[#5F6B5E] text-sm mt-1 mb-6 font-medium">Create your UNESCO heritage passport</p>
      <div className="flex flex-col gap-3.5 bg-[#FFFFFF] p-6 rounded-3xl border border-[#E4E7EB] shadow-[0_4px_20px_rgba(35,53,31,0.03)]">
        {displayError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-xs font-medium">
            {displayError}
          </div>
        )}
        <div className="flex gap-3">
          <InputField placeholder="First Name" value={firstName} onChange={setFirstName} />
          <InputField placeholder="Last Name" value={lastName} onChange={setLastName} />
        </div>
        <InputField placeholder="Email address" icon={<User size={16} />} value={email} onChange={setEmail} />
        <InputField placeholder="Password" type="password" icon={<Eye size={16} />} value={password} onChange={setPassword} />
        <div className="flex items-start gap-2.5 mt-1">
          <div className="w-5 h-5 rounded bg-[#23351F] flex items-center justify-center flex-shrink-0 mt-0.5">
            <Check size={12} className="text-white" />
          </div>
          <p className="text-[#5F6B5E] text-xs leading-relaxed">I agree to the Terms of Service and Privacy Policy</p>
        </div>
        <PrimaryButton label={isLoading ? "Creating Account..." : "Create Account"} full onClick={handleRegister} />
      </div>
      <div className="mt-auto pb-10 text-center">
        <span className="text-[#5F6B5E] text-sm">Already exploring? </span>
        <button onClick={onBack} className="text-[#23351F] text-sm font-black underline">Sign In</button>
      </div>
    </div>
  );
}
