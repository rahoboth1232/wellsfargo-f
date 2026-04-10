import React, { useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Plane,
  Gift,
} from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

/* ───────── Account Card ───────── */
function AccountCard({ account }) {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
const [method, setMethod] = useState("");
const [message, setMessage] = useState("");

const handelsubmit = ()=>{
  toast.success("sent successfully")
  setShowModal(false)
}

  const formattedDate = useMemo(
    () =>
      new Date(account.last_transaction_date).toLocaleDateString("en-IN"),
    [account.last_transaction_date]
  );

  return (
    <div className="bg-white border border-gray-200 rounded mb-3">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-700">Bank accounts</span>
      </div>

      <div className="px-4 py-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1 mb-1">
           <span
  onClick={() => setShowModal(true)}
  className="text-xs font-semibold text-[#003087] hover:underline cursor-pointer"
>
  ({account.account_type}) <span>encrypted account</span>
</span>
              <ChevronRight size={12} className="text-[#003087]" />
            </div>

            <p className="text-2xl font-bold text-gray-900">
              ${account.balance}
            </p>

            <p className="text-[10px] text-gray-500 mt-0.5">
              Available balance
            </p>

            {open && (
              <div className="flex gap-10 w-full">
                <div>
                  <p className="text-[15px] text-gray-500 mt-0.5">
                    Last Transaction
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    ${account.last_transaction_amount}
                  </p>
                </div>

                <div>
                  <p className="text-[15px] text-gray-500 mt-0.5">Type</p>
                  <p className="text-xl font-bold text-gray-900">
                    {account.last_transaction_type}
                  </p>
                </div>

                <div>
                  <p className="text-[15px] text-gray-500 mt-0.5">Date</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formattedDate}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Link to="/transfer">
              <button className="bg-[#003087] text-white text-xs px-3 py-1.5 rounded font-semibold hover:bg-[#002070]">
                Transfer money
              </button>
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="border border-gray-300 text-xs px-3 py-1.5 rounded font-semibold text-gray-700 flex items-center gap-1 hover:bg-gray-50"
            >
              More <ChevronDown size={11} />
            </button>
          </div>
        </div>
      </div>

{showModal && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    
    <div className="bg-white w-[320px] rounded-xl shadow-xl p-5 relative animate-fadeIn">

      {/* ❌ Close button (top-right) */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
      >
        ✕
      </button>

      {/* ✅ Image */}
      <img
        src={`http://localhost:8000${account.images}`}
        alt="account"
        className="w-36 mx-auto mb-4 rounded-lg border"
      />

      {/* ✅ Title */}
      <h3 className="text-sm font-semibold text-gray-800 text-center mb-3">
        Send to
      </h3>

      {/* ✅ Options */}
      <div className="space-y-2 mb-4">
        
        <label className="flex items-center justify-between border rounded px-3 py-2 cursor-pointer hover:bg-gray-50">
          <span className="text-sm">Email</span>
          <input
            type="radio"
            value="email"
            checked={method === "email"}
            onChange={(e) => setMethod(e.target.value)}
          />
        </label>

        <label className="flex items-center justify-between border rounded px-3 py-2 cursor-pointer hover:bg-gray-50">
          <span className="text-sm">Phone</span>
          <input
            type="radio"
            value="phone"
            checked={method === "phone"}
            onChange={(e) => setMethod(e.target.value)}
          />
        </label>

      </div>

      {/* ✅ Button */}
      <button
     
        onClick={handelsubmit}
        className="w-full bg-[#003087] text-white py-2 rounded text-sm font-semibold hover:bg-[#002070]"
      >
        Send 
      </button>

      {/* ✅ Message */}
      {message && (
        <p className="text-xs text-center text-gray-600 mt-3">
          {message}
        </p>
      )}

    </div>
  </div>
)}

    </div>
  );
}

/* ───────── Credit Cards ───────── */
const CreditCards = () => {
  const [open, setOpen] = useState(true);

  const cards = [
    {
      name: "Slate (…4950)",
      balance: "$0.00",
      details: [
        { label: "Last statement balance", value: "$0.00" },
        { label: "Available credit", value: "$0.00" },
      ],
      cardColor: "from-gray-400 to-gray-600",
    },
    {
      name: "Freedom (…0490)",
      balance: "$1,948.18",
      details: [
        { label: "Min payment due", value: "$40.00" },
        { label: "Available credit", value: "$16,451.82" },
      ],
      cardColor: "from-blue-400 to-blue-700",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded mb-3">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <span className="text-xs font-bold text-gray-700">Credit cards</span>

        <button onClick={() => setOpen(!open)}>
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {open &&
        cards.map((card) => (
          <div key={card.name} className="px-4 py-3">
            <p className="text-xs font-semibold text-[#003087]">
              {card.name}
            </p>

            <p className="text-xl font-bold">{card.balance}</p>

            <div className="flex gap-6 mt-2">
              {card.details.map((d) => (
                <div key={d.label}>
                  <p className="text-xs font-semibold">{d.value}</p>
                  <p className="text-[10px] text-gray-500">{d.label}</p>
                </div>
              ))}
            </div>

            <div
              className={`w-14 h-9 mt-2 rounded bg-gradient-to-br ${card.cardColor}`}
            />
          </div>
        ))}
    </div>
  );
};

/* ───────── Rewards ───────── */
const Rewards = React.memo(() => (
  <div className="bg-white border border-gray-200 rounded mb-3">
    <div className="px-4 py-3">
      <p className="text-xs font-bold text-gray-700">Rewards</p>
      <div className="flex items-center gap-2 mt-2">
        <Star size={12} className="text-yellow-400 fill-yellow-400" />
        <p className="text-sm font-bold">1,406 points</p>
      </div>
    </div>
  </div>
));

/* ───────── Travel ───────── */
const Travel = React.memo(() => (
  <div className="bg-white border border-gray-200 rounded mb-3">
    <div className="px-4 py-3 flex items-center gap-2">
      <Plane size={16} className="text-[#003087]" />
      <p className="text-xs font-semibold text-[#003087]">
        Explore adventures around the world
      </p>
    </div>
  </div>
));

/* ───────── Chase Offers ───────── */
function ChaseOffers() {
  const [dot, setDot] = useState(0);

  return (
    <div className="bg-white border border-gray-200 rounded mb-3">
      <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
          <Gift size={13} /> Chase Offers
        </span>
      </div>

      <div className="flex justify-center gap-1.5 py-3">
        {[0, 1, 2, 3].map((i) => (
          <button
            key={i}
            onClick={() => setDot(i)}
            className={`rounded-full ${
              dot === i ? "w-4 h-2 bg-[#003087]" : "w-2 h-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ───────── Credit Journey ───────── */
const CreditJourney = React.memo(() => (
  <div className="bg-white border border-gray-200 rounded">
    <div className="px-4 py-3">
      <p className="text-xs font-bold text-gray-700">Credit Journey</p>
    </div>
  </div>
));

/* ───────── Root Dashboard ───────── */
export default function ChaseDashboard() {
  const { data: accounts, isLoading, isError } = useDashboard();
  console.log(accounts)

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading dashboard</p>;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-4 flex gap-4">
        
        <div className="flex-1 min-w-0">
          {accounts?.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}

          <CreditCards />
        </div>

        {/* Right column */}
        <div className="w-56 shrink-0">
          <Rewards />
          <Travel />
          <ChaseOffers />
          <CreditJourney />
        </div>
      </div>
    </div>
  );
}