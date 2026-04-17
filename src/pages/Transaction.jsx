import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  PlusCircle,
} from "lucide-react";
import { useTransaction } from "../hooks/useTransaction";

const TABS = ["Activity", "Interest"];
const FILTER_TABS = [
  "Transactions",
  "Deposits",
  "Checks",
  "Withdrawals",
  "Declines",
];

const PENDING = [];

function formatDate(isoString) {
  const date = new Date(isoString);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

function formatAmount(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

function transformTransaction(item) {
  const isDeposit = item.type?.toLowerCase() === "deposit";

  return {
    id: `api-${item.id}`,
    date: formatDate(item.date),
    description: `${item.type} - ${item.account_type} account ••••${item.account_last4}`,
    credit: isDeposit ? formatAmount(item.amount) : null,
    debit: !isDeposit ? formatAmount(item.amount) : null,
  };
}

function SortIcon() {
  return (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp size={10} className="text-gray-500 -mb-0.5" />
      <ChevronDown size={10} className="text-gray-500" />
    </span>
  );
}

export default function AccountActivity() {
  const [activeTab, setActiveTab] = useState("Activity");
  const [activeFilter, setActiveFilter] = useState("Transactions");
  const [expanded, setExpanded] = useState({});

  const toggleRow = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const { data } = useTransaction();

  console.log(data)

  // ✅ normalize API response safely
  const rawList =
  data?.data ||
  data?.results ||
  data?.transactions ||
  (Array.isArray(data) ? data : []);

  // ✅ transform + sort latest first
  const allPosted = rawList
    .map(transformTransaction)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const filterData = (rows) => {
    if (activeFilter === "Deposits") return rows.filter((r) => r.credit);
    if (activeFilter === "Withdrawals") return rows.filter((r) => r.debit);
    if (activeFilter === "Checks") return [];
    if (activeFilter === "Declines") return [];
    return rows;
  };

  const visiblePosted = filterData(allPosted);

  return (
    <div className="bg-white text-sm font-sans">
      {/* Tabs */}
      <div className="flex border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold ${
              activeTab === tab
                ? "border-t-2 border-yellow-500"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-gray-700 flex items-center">
        <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-3">
          <Search size={16} /> Search
        </button>

        {FILTER_TABS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-5 py-3 ${
              activeFilter === f
                ? "text-yellow-400"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 px-4 py-2 border-b bg-white">
        <div className="col-span-2 font-semibold text-teal-700">
          Date <ChevronDown size={13} />
        </div>
        <div className="col-span-6 font-semibold text-teal-700">
          Description <SortIcon />
        </div>
        <div className="col-span-2 text-right font-semibold text-teal-700">
          Credit <SortIcon />
        </div>
        <div className="col-span-2 text-right font-semibold text-teal-700">
          Debit <SortIcon />
        </div>
      </div>

      {/* Transactions */}
      {visiblePosted.length > 0 ? (
        visiblePosted.map((row) => (
          <div key={row.id}>
            <div
              onClick={() => toggleRow(row.id)}
              className="grid grid-cols-12 px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
            >
              <div className="col-span-2 flex items-center gap-2">
                <PlusCircle size={16} />
                {row.date}
              </div>
              <div className="col-span-6">{row.description}</div>
              <div className="col-span-2 text-right text-green-600">
                {row.credit}
              </div>
              <div className="col-span-2 text-right">{row.debit}</div>
            </div>

            {/* Expanded Row */}
            {expanded[row.id] && (
              <div className="bg-blue-50 px-10 py-4 text-xs">
                <p>
                  <strong>Type:</strong>{" "}
                  {row.credit ? "Deposit" : "Withdrawal"}
                </p>
                <p>
                  <strong>Date:</strong> {row.date}
                </p>
                <p>
                  <strong>Amount:</strong> {row.credit || row.debit}
                </p>
                <p>
                  <strong>Description:</strong> {row.description}
                </p>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-10 text-gray-400">
          No transactions found
        </div>
      )}
    </div>
  );
}