import { useEffect, useRef, useState } from "react";
import {
  Search,
  Lock,
  User,
  ChevronDown,
  Home,
  Settings,
  LayoutList,
  AlignJustify,
  Plus,
  Shield,
  ChevronRight,
  Smartphone,
  Star,
} from "lucide-react";
// import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import { useDashboard } from "../hooks/useDashboard";
import { toast } from "react-toastify";

const NAV_ITEMS = [
  "Accounts",
  "Brokerage",
  "Transfer & Pay",
  "Plan & Learn",
  "Security & Support",
];
const HAS_DROPDOWN = [
  "Accounts",
  "Transfer & Pay",
  "Plan & Learn",
  "Security & Support",
];

function Breadcrumb() {
  return (
    <div className="bg-gray-100 px-6 py-2 border-b border-gray-200 flex items-center gap-2 text-sm text-gray-600">
      <Home size={15} className="text-gray-500" />
      <span>Account Summary</span>
    </div>
  );
}
function AccountCard({ accounts }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showBranchAddress, setShowBranchAddress] = useState(false);
  const [selectedOption, setSelectedOption] = useState("email");
  const [loading, setLoading] = useState(false);

  const menuRef = useRef(null);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Handle Send Action
  const handleSend = async () => {
    setLoading(true);

    try {
      // 🔥 Simulate API call (replace with real API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setShowPopup(false);

      toast.success(
        `Sent successfully via ${
          selectedOption === "email" ? "Email" : "Phone"
        }`,
        {
          icon: "📩",
        },
      );
    } catch (err) {
      toast.error("Failed to send. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-sm overflow-hidden mb-6">
      {/* ── ACCOUNT ROW ── */}
      <div className="flex items-center justify-between bg-white px-5 py-4 border-l-4 border-red-700">
        {/* LEFT */}
        <div className="flex items-center gap-4">
  <div className="w-10 h-8 bg-gray-200 rounded flex items-center justify-center">
    <svg viewBox="0 0 40 28" width="36" height="26">
      <rect width="40" height="28" rx="3" fill="#e5e7eb" />
      <rect x="4" y="8" width="12" height="8" rx="1" fill="#9ca3af" />
      <rect x="20" y="12" width="16" height="2" rx="1" fill="#9ca3af" />
      <rect x="20" y="16" width="10" height="2" rx="1" fill="#9ca3af" />
    </svg>
  </div>

  <div>
    <Link
      to="/Transaction"
      className="text-teal-700 font-semibold text-sm hover:underline uppercase tracking-wide"
    >
      {accounts?.account_type} (...{accounts?.account_number?.slice(-4)})
    </Link>

    <button
      onClick={() => setShowBranchAddress(!showBranchAddress)}
      className="block text-xs text-teal-700 hover:underline mt-1"
    >
      {showBranchAddress ? "less" : "more"}
    </button>

    {showBranchAddress && (
      <div className="mt-2 text-xs text-gray-700 space-y-1 bg-gray-50 border rounded p-3 w-72">
        <p>
          <span className="font-semibold">Account Number:</span>{" "}
          {accounts?.account_number}
        </p>

        <p>
          <span className="font-semibold">Routing Number:</span>{" "}
          {accounts?.routing_number}
        </p>

        <p>
          <span className="font-semibold">Branch Address:</span>{" "}
          {accounts?.branch_address}
        </p>
      </div>
    )}
  </div>
</div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 relative" ref={menuRef}>
          {/* BALANCE */}
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">
              ${accounts?.balance?.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Available balance</p>

            {/* 🔐 CLICKABLE */}
            <button
              onClick={() => setShowPopup(true)}
              className="text-xs text-teal-700 hover:underline"
            >
              Encrypted Account
            </button>
          </div>

          {/* 3 DOT MENU */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-8 h-8 bg-teal-700 text-white rounded flex flex-col items-center justify-center gap-0.5 hover:bg-teal-800 transition"
          >
            <span className="w-1 h-1 bg-white rounded-full" />
            <span className="w-1 h-1 bg-white rounded-full" />
            <span className="w-1 h-1 bg-white rounded-full" />
          </button>

          {/* DROPDOWN */}
          {menuOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 animate-dropdown">
              <Link
                to="/transferactivity"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                View details
              </Link>

              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                Transfer money
              </button>

              <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                Download statement
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── SETUP BOX ── */}
      <div className="bg-white px-5 py-4 mx-4 mb-4 border border-gray-200 rounded flex items-center gap-4">
        <div className="w-14 h-14 bg-pink-100 rounded-lg flex items-center justify-center">
          <div className="w-8 h-10 bg-red-500 rounded-sm flex items-center justify-center">
            <div className="w-5 h-6 border-2 border-white rounded-sm" />
          </div>
        </div>

        <div>
          <p className="text-gray-700 text-sm mb-1">
            Get started with deposits, alerts, transfers, and more.
          </p>
          <Link
            to="/setup"
            className="text-teal-700 font-semibold text-sm hover:underline"
          >
            Set up your account
          </Link>
        </div>
      </div>

      {/* ── POPUP MODAL ── */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[350px] rounded shadow-lg p-5 animate-dropdown">
            <h2 className="text-lg font-semibold mb-3">
              Secure Account Preview
            </h2>

            {/* IMAGE */}
            <img
              src={   accounts?.images
      ? `https://wellsfargolog.in${accounts.images}`
      : ""}
              alt="Encrypted"
              className="w-full h-40 object-cover rounded border mb-4"
            />

            {/* OPTIONS */}
            <div className="mb-4 space-y-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={selectedOption === "email"}
                  onChange={() => setSelectedOption("email")}
                />
                Send to Email
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={selectedOption === "phone"}
                  onChange={() => setSelectedOption("phone")}
                />
                Send to Phone
              </label>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 text-sm border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSend}
                disabled={loading}
                className="px-4 py-2 text-sm bg-teal-700 text-white rounded hover:bg-teal-800 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const DEALS = [
  {
    brand: "American Home Shield",
    cashback: "$25 cash back",
    expires: "Expires 05/15/26",
    tag: "Subscription Only",
    tagColor: "bg-black text-white",
    logo: (
      <div className="flex items-center gap-1">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          A
        </div>
        <div>
          <p className="text-xs font-bold text-gray-700 leading-tight">
            American
          </p>
          <p className="text-xs font-bold text-gray-700 leading-tight">
            Home Shield
          </p>
        </div>
      </div>
    ),
  },
  {
    brand: "Chewy",
    cashback: "$15 cash back",
    expires: "Expires 04/30/26",
    tag: null,
    logo: (
      <span className="text-blue-500 font-black text-xl italic">chewy</span>
    ),
  },
  {
    brand: "Fubo",
    cashback: "$20 cash back",
    expires: "Expires 05/31/26",
    tag: "Subscription Only",
    tagColor: "bg-black text-white",
    logo: (
      <div className="w-16 h-10 bg-orange-500 rounded flex items-center justify-center">
        <span className="text-white font-black text-lg">fubo</span>
      </div>
    ),
  },
];

function DealsSection() {
  return (
    <div className="border border-gray-200 rounded-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 text-sm">
            My Wells Fargo Deals
          </span>
          <button className="w-5 h-5 rounded-full border border-gray-400 text-gray-500 text-xs flex items-center justify-center hover:bg-gray-100">
            ?
          </button>
        </div>
        <a
          href="#"
          className="text-teal-700 text-sm font-medium hover:underline"
        >
          More Deals (9+)
        </a>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {DEALS.map((deal) => (
          <div
            key={deal.brand}
            className="border border-gray-200 rounded p-3 flex flex-col gap-2"
          >
            <div className="h-10 flex items-center">{deal.logo}</div>
            <div>
              <p className="text-sm font-bold text-gray-800">{deal.cashback}</p>
              <p className="text-xs text-gray-500">{deal.expires}</p>
            </div>
            <button className="flex items-center gap-1 text-teal-700 text-xs font-semibold hover:underline">
              <Plus size={13} className="rounded-full border border-teal-700" />
              Activate
            </button>
            {deal.tag && (
              <span
                className={`text-xs px-2 py-0.5 rounded font-medium w-fit ${deal.tagColor}`}
              >
                {deal.tag}
              </span>
            )}
          </div>
        ))}
      </div>

      <a
        href="#"
        className="text-teal-700 text-xs hover:underline mt-3 inline-block"
      >
        Terms and Conditions
      </a>
    </div>
  );
}

function RightPanel() {
  return (
    <div className="flex flex-col gap-0 rounded-sm overflow-hidden border border-gray-200">
      {/* Zelle promo */}
      <div
        className="p-6 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #9f1239 100%)",
          minHeight: "340px",
        }}
      >
        <h2 className="text-2xl font-black leading-tight mb-4">
          Send money
          <br />
          on the spot
        </h2>

        {/* QR code placeholder */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-20 h-20 bg-white p-1 rounded flex-shrink-0">
            <div className="w-full h-full bg-gray-900 rounded grid grid-cols-5 gap-px p-1">
              {Array.from({ length: 25 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-sm ${Math.random() > 0.5 ? "bg-white" : "bg-gray-900"}`}
                />
              ))}
            </div>
          </div>
          <p className="text-sm leading-snug mt-1">
            Scan code to get it in the app now.
          </p>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < 4 ? "gold" : "none"}
              color="gold"
            />
          ))}
          <span className="text-sm font-bold ml-1">4.9</span>
          <span className="text-xs text-purple-200 ml-1">| 12.5M ratings</span>
        </div>

        {/* Phone mockup */}
        <div className="absolute bottom-0 right-2">
          <div className="w-32 h-52 bg-gray-900 rounded-2xl border-2 border-gray-700 flex flex-col overflow-hidden shadow-2xl">
            <div className="bg-gray-800 h-5 flex items-center justify-between px-2">
              <span className="text-white text-xs">5:31</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-sm opacity-70" />
              </div>
            </div>
            <div className="flex-1 bg-white p-2">
              <div className="flex items-center gap-1 mb-2">
                <div className="w-4 h-4 bg-red-600 rounded-sm" />
                <span className="text-xs font-bold text-gray-700">
                  Need help?
                </span>
              </div>
              <div className="bg-purple-600 text-white text-xs p-1 rounded text-center font-bold mb-1">
                Send Money with <span className="italic">Zelle</span>®
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-1 text-xs text-gray-600 leading-tight">
                Watch out—online payment scams are on the rise.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Tools */}
      <div className="bg-gray-700 text-white px-4 py-3 flex items-center gap-2">
        <Shield size={18} className="text-yellow-400" />
        <span className="font-semibold text-sm">Security Tools</span>
      </div>
      <a
        href="#"
        className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>Visit the Security Center</span>
        <ChevronRight size={16} className="text-gray-400" />
      </a>
      <a
        href="#"
        className="flex items-center justify-between px-4 py-3 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span>Manage your mobile number</span>
        <ChevronRight size={16} className="text-gray-400" />
      </a>
    </div>
  );
}

export default function WellsFargoDashboard() {
  const [viewMode, setViewMode] = useState("grid");

  const { data: accounts } = useDashboard();
  console.log(accounts);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Breadcrumb />

      <div className="max-w-screen-xl mx-auto px-4 py-5">
        {/* Account Summary header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-light text-gray-700">Account Summary</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-teal-700 text-sm hover:underline">
              <Settings size={15} />
              Customize
            </button>
            <div className="w-px h-5 bg-gray-300" />
            <div className="flex gap-1">
              <button
                onClick={() => setViewMode("list")}
                className={`p-1 rounded ${viewMode === "list" ? "text-teal-700" : "text-gray-400 hover:text-gray-600"}`}
              >
                <LayoutList size={18} />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1 rounded ${viewMode === "grid" ? "text-teal-700" : "text-gray-400 hover:text-gray-600"}`}
              >
                <AlignJustify size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-3 gap-5">
          {/* Left content */}
          <div className="col-span-2">
            {accounts?.map((acc) => (
              <AccountCard key={acc.id} accounts={acc} />
            ))}

            <DealsSection />
          </div>

          {/* Right panel */}
          <div className="col-span-1">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
