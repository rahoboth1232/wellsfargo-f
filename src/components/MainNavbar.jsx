import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Lock,
  MessageSquare,
  MapPin,
  Globe,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";

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

const NAV_LINKS = {
  Accounts: "/dashboard",
  Brokerage: "#",
  "Transfer & Pay": "/transfer",
  "Plan & Learn": "#",
  "Security & Support": "#",
};

// ─── Nav Dropdown Content ─────────────────────────────────────────────────────
const NAV_DROPDOWN_ITEMS = {
  Accounts: [
    {
      heading: "My Accounts",
      links: [
        { label: "Account Summary", href: "/dashboard" },
        { label: "Account Activity", href: "/transaction" },
       
      ],
    },
    
  ],
  "Transfer & Pay": [
    {
      heading: "Transfers",
      links: [
        { label: "Transfer Funds", href: "/transfer" },
        { label: "Wire Transfer", href: "#" },
        { label: "Transfer Activity", href: "/transferactivity" },
        { label: "Schedule Transfers", href: "#" },
      ],
    },
   
  ],
};

const MY_PROFILE_LINKS = [
  "View Personal Profile",
];

const ACCOUNT_SETTINGS_LINKS = [
  "Manage Alerts",
  "View Account & Card Profile",
  "Manage Delivery Preferences",
  "Text Banking",
];

// ─── User Dropdown ────────────────────────────────────────────────────────────
function UserDropdown() {
  const [myProfileOpen, setMyProfileOpen] = useState(true);
  const [accountSettingsOpen, setAccountSettingsOpen] = useState(true);
  const [manageAccessOpen, setManageAccessOpen] = useState(false);

  return (
    <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 shadow-xl z-50 rounded-sm overflow-hidden">
     

      {[
        { icon: <MessageSquare size={14} />, label: "Message Center" },
        { icon: <MapPin size={14} />, label: "Locations" },
        { icon: <Globe size={14} />, label: "Language Preference" },
      ].map(({ icon, label }) => (
        <button
          key={label}
          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-800 hover:bg-gray-50 border-b border-gray-100 transition-colors"
        >
          <span className="text-gray-500">{icon}</span>
          {label}
        </button>
      ))}

      <Link
        onClick={() => setMyProfileOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-teal-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
      >
        My Profile
        {myProfileOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </Link>
      {myProfileOpen && (
        <div className="border-b border-gray-200">
          {MY_PROFILE_LINKS.map((link) => (
            <Link
              key={link}
              to="/Profile"
              className="w-full text-left px-8 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-700 border-b border-gray-100 last:border-0 transition-colors"
            >
              {link}
            </Link>
          ))}
        </div>
      )}

      <button
        onClick={() => setAccountSettingsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-teal-700 hover:bg-gray-50 border-b border-gray-100 transition-colors"
      >
        Account Settings
        {accountSettingsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {accountSettingsOpen && (
        <div className="border-b border-gray-200">
          {ACCOUNT_SETTINGS_LINKS.map((link) => (
            <button
              key={link}
              className="w-full text-left px-8 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-700 border-b border-gray-100 last:border-0 transition-colors"
            >
              {link}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setManageAccessOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-teal-700 hover:bg-gray-50 transition-colors"
      >
        Manage Access
        {manageAccessOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
    </div>
  );
}

// ─── Nav Item Dropdown ────────────────────────────────────────────────────────
function NavDropdown({ item }) {
  const sections = NAV_DROPDOWN_ITEMS[item];
  if (!sections) return null;

  return (
    <div className="absolute left-0 top-full mt-0 bg-white border border-gray-200 shadow-xl z-50 rounded-sm overflow-hidden min-w-[480px] flex">
      {sections.map((section) => (
        <div key={section.heading} className="flex-1 py-3 border-r border-gray-100 last:border-r-0">
          <p className="px-5 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {section.heading}
          </p>
          {section.links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function ChaseNavbar() {
  const [active, setActive] = useState("Accounts");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeNavDropdown, setActiveNavDropdown] = useState(null);

  const dropdownRef = useRef(null);
  const navDropdownRef = useRef(null);
  const navigate = useNavigate();
  const { data } = useProfile();

  // Close user dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (navDropdownRef.current && !navDropdownRef.current.contains(e.target)) {
        setActiveNavDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    const loginPage = localStorage.getItem("loginPage");
    navigate(loginPage);
  };

  const handleNavClick = (item) => {
    setActive(item);
    if (NAV_DROPDOWN_ITEMS[item]) {
      setActiveNavDropdown((prev) => (prev === item ? null : item));
    } else {
      setActiveNavDropdown(null);
    }
  };

  return (
    <div>
      {/* ── Top Bar ── */}
      <div className="bg-red-700 px-6 py-3 flex items-center justify-between relative z-40">
        <span className="text-white font-black text-xl tracking-wide uppercase leading-none">
          WELLS FARGO
        </span>

        <div className="flex items-center gap-5 text-white text-sm">
          <button className="hover:text-yellow-200 transition-colors">
            <Search size={20} />
          </button>

          <div className="w-px h-5 bg-red-400" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 hover:text-yellow-200 transition-colors font-medium"
          >
            <Lock size={16} />
            <span>Sign Off</span>
          </button>

          <div className="w-px h-5 bg-red-400" />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 hover:text-yellow-200 transition-colors"
            >
              <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-red-600">
                <User size={16} />
              </div>
              <span className="font-semibold">
                Welcome, {data?.full_name || "User"}
              </span>
              {dropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {dropdownOpen && <UserDropdown />}
          </div>
        </div>
      </div>

      {/* ── Nav Bar ── */}
      <nav className="bg-white border-b border-gray-200 shadow-sm" ref={navDropdownRef}>
        <div className="flex items-center divide-x divide-gray-200">
          {NAV_ITEMS.map((item) => {
            const hasNavDropdown = !!NAV_DROPDOWN_ITEMS[item];
            const isNavDropdownOpen = activeNavDropdown === item;

            return (
              <div key={item} className="relative">
                {hasNavDropdown ? (
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center gap-1 px-8 py-4 text-sm font-medium transition-colors whitespace-nowrap
                      ${
                        active === item
                          ? "text-red-700 border-b-2 border-red-700 -mb-px"
                          : "text-gray-600 hover:text-red-700"
                      }`}
                  >
                    {item}
                    {HAS_DROPDOWN.includes(item) &&
                      (isNavDropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                  </button>
                ) : (
                  <Link
                    to={NAV_LINKS[item]}
                    onClick={() => handleNavClick(item)}
                    className={`flex items-center gap-1 px-8 py-4 text-sm font-medium transition-colors whitespace-nowrap
                      ${
                        active === item
                          ? "text-red-700 border-b-2 border-red-700 -mb-px"
                          : "text-gray-600 hover:text-red-700"
                      }`}
                  >
                    {item}
                    {HAS_DROPDOWN.includes(item) && <ChevronDown size={14} />}
                  </Link>
                )}

                {isNavDropdownOpen && <NavDropdown item={item} />}
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
} 