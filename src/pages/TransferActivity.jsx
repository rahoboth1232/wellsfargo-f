import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  Download,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useTransferData } from "../hooks/useTransfer";

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTER_TABS = ["All", "Completed", "Pending", "Failed"];

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const [date, time] = dateStr.split(" ");
  return (
    <span>
      <span className="text-gray-800">{date}</span>
      <span className="ml-1.5 text-gray-400 text-xs">{time}</span>
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    completed: {
      icon: <CheckCircle2 size={13} />,
      label: "Completed",
      className: "bg-green-50 text-green-700 border border-green-200",
    },
    pending: {
      icon: <Clock size={13} />,
      label: "Pending",
      className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    },
    failed: {
      icon: <XCircle size={13} />,
      label: "Failed",
      className: "bg-red-50 text-red-700 border border-red-200",
    },
    cancelled: {
      icon: <AlertCircle size={13} />,
      label: "Cancelled",
      className: "bg-gray-100 text-gray-500 border border-gray-200",
    },
  };

  const config = map[status?.toLowerCase()] ?? map.pending;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field)
    return (
      <span className="inline-flex flex-col ml-1 opacity-40">
        <ChevronUp size={9} />
        <ChevronDown size={9} />
      </span>
    );
  return sortDir === "asc" ? (
    <ChevronUp size={13} className="ml-1 text-teal-700" />
  ) : (
    <ChevronDown size={13} className="ml-1 text-teal-700" />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TransferActivity() {
  const { data, isLoading, isError, refetch, isFetching } = useTransferData();
  console.log(data,"asyg")

  const [activeFilter, setActiveFilter] = useState("All");
  const [sortField, setSortField] = useState("created_at");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);

  const transfers = data?.transfer_requests ?? [];

  // ── Filter ──
  const filtered = transfers.filter((tr) => {
    if (activeFilter === "All") return true;
    return tr.status?.toLowerCase() === activeFilter.toLowerCase();
  });

  // ── Sort ──
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField] ?? "";
    let bVal = b[sortField] ?? "";
    if (sortField === "amount") {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // ── Paginate ──
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  };

  const handleFilterChange = (f) => {
    setActiveFilter(f);
    setPage(1);
    setExpandedRow(null);
  };

  // ── Summary counts ──
  const counts = {
    All: transfers.length,
    Completed: transfers.filter((t) => t.status?.toLowerCase() === "completed").length,
    Pending: transfers.filter((t) => t.status?.toLowerCase() === "pending").length,
    Failed: transfers.filter((t) => t.status?.toLowerCase() === "failed").length,
  };

  const totalAmount = filtered
    .filter((t) => t.status?.toLowerCase() === "completed")
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-screen-xl mx-auto px-6 py-6">

        {/* ── Page Header ── */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-light text-gray-700">Transfer & Payment Activity</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              View and manage your recent transfers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-1.5 text-xs text-teal-700 hover:underline font-medium disabled:opacity-50"
            >
              <RefreshCw size={13} className={isFetching ? "animate-spin" : ""} />
              Refresh
            </button>
            <div className="w-px h-4 bg-gray-300" />
            <button className="flex items-center gap-1.5 text-xs text-teal-700 hover:underline font-medium">
              <Download size={13} />
              Download Activity
            </button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Transfers", value: counts.All, color: "text-gray-800" },
            { label: "Completed", value: counts.Completed, color: "text-green-700" },
            { label: "Pending", value: counts.Pending, color: "text-yellow-600" },
            { label: "Total Completed Amount", value: formatCurrency(totalAmount), color: "text-teal-700" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-sm px-4 py-3">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className={`text-xl font-semibold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── Main Table Card ── */}
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">

          {/* Filter bar */}
          <div className="bg-gray-700 flex items-center justify-between px-4">
            <div className="flex items-center">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleFilterChange(tab)}
                  className={`relative px-5 py-3 text-sm font-medium transition-colors
                    ${activeFilter === tab ? "text-yellow-400" : "text-gray-300 hover:text-white"}`}
                >
                  {tab}
                  {counts[tab] > 0 && (
                    <span
                      className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full
                        ${activeFilter === tab ? "bg-yellow-400 text-gray-800" : "bg-gray-600 text-gray-300"}`}
                    >
                      {counts[tab]}
                    </span>
                  )}
                  {activeFilter === tab && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[7px] border-r-[7px] border-t-[7px] border-l-transparent border-r-transparent border-t-gray-700" />
                  )}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-400 pr-2">
              {filtered.length} record{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-12 px-4 py-2.5 border-b border-gray-200 bg-gray-50">
            {[
              { label: "Date", field: "created_at", cols: "col-span-3" },
              { label: "From Account", field: "from_account", cols: "col-span-2" },
              { label: "To Account", field: "to_account", cols: "col-span-2" },
              { label: "Amount", field: "amount", cols: "col-span-2 text-right" },
              { label: "Status", field: "status", cols: "col-span-2 text-center" },
              { label: "", field: null, cols: "col-span-1" },
            ].map(({ label, field, cols }) => (
              <div
                key={label || "expand"}
                className={`${cols} flex items-center text-xs font-semibold text-teal-700 ${field ? "cursor-pointer hover:text-teal-800 select-none" : ""}`}
                onClick={() => field && handleSort(field)}
              >
                {label}
                {field && <SortIcon field={field} sortField={sortField} sortDir={sortDir} />}
              </div>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-16 text-sm text-gray-400 gap-2">
              <RefreshCw size={16} className="animate-spin text-teal-600" />
              Loading transfers...
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex items-center justify-center py-16 text-sm text-red-500 gap-2">
              <XCircle size={16} />
              Failed to load transfer activity.
              <button onClick={() => refetch()} className="underline ml-1 text-teal-700">
                Retry
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && paginated.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
              <ArrowRightLeft size={32} className="text-gray-200" />
              <p className="text-sm">No {activeFilter !== "All" ? activeFilter.toLowerCase() : ""} transfers found.</p>
            </div>
          )}

          {/* Rows */}
          {!isLoading && !isError && paginated.map((tr, idx) => (
            <div key={idx}>
              {/* Main row */}
              <div
                className={`grid grid-cols-12 px-4 py-3 border-b border-gray-100 items-center
                  transition-colors cursor-pointer
                  ${expandedRow === idx ? "bg-blue-50" : "bg-white hover:bg-gray-50"}`}
                onClick={() => setExpandedRow(expandedRow === idx ? null : idx)}
              >
                {/* Date */}
                <div className="col-span-3 text-xs">{formatDate(tr.created_at)}</div>

                {/* From */}
                <div className="col-span-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium capitalize">
                    {tr.from_account ?? "—"}
                  </span>
                </div>

                {/* To */}
                <div className="col-span-2">
                  <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-medium capitalize">
                    {tr.to_account ?? "—"}
                  </span>
                </div>

                {/* Amount */}
                <div className="col-span-2 text-right">
                  <span className={`text-sm font-semibold ${tr.status?.toLowerCase() === "failed" ? "text-gray-400 line-through" : "text-gray-800"}`}>
                    {formatCurrency(tr.amount)}
                  </span>
                </div>

                {/* Status */}
                <div className="col-span-2 flex justify-center">
                  <StatusBadge status={tr.status} />
                </div>

                {/* Expand toggle */}
                <div className="col-span-1 flex justify-end">
                  {expandedRow === idx
                    ? <ChevronUp size={15} className="text-gray-400" />
                    : <ChevronDown size={15} className="text-gray-400" />}
                </div>
              </div>

              {/* Expanded detail panel */}
              {expandedRow === idx && (
                <div className="bg-blue-50 border-b border-blue-100 px-8 py-4">
                  <div className="grid grid-cols-4 gap-6 text-xs">
                    <div>
                      <p className="text-gray-400 uppercase tracking-wide font-semibold mb-1">From Account</p>
                      <p className="text-gray-800 font-medium capitalize">{tr.from_account ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase tracking-wide font-semibold mb-1">To Account</p>
                      <p className="text-gray-800 font-medium capitalize">{tr.to_account ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase tracking-wide font-semibold mb-1">Amount</p>
                      <p className="text-gray-800 font-semibold">{formatCurrency(tr.amount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase tracking-wide font-semibold mb-1">Status</p>
                      <StatusBadge status={tr.status} />
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400 uppercase tracking-wide font-semibold mb-1">Date & Time</p>
                      <p className="text-gray-800">{tr.created_at ?? "—"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400 uppercase tracking-wide font-semibold mb-1">Transfer Type</p>
                      <p className="text-gray-800 capitalize">{tr.action ?? "Internal"}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* ── Pagination ── */}
          {!isLoading && !isError && sorted.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
              <span className="text-xs text-gray-400">
                Showing {Math.min((page - 1) * PAGE_SIZE + 1, sorted.length)}–
                {Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="flex items-center gap-0.5 px-2 py-1.5 text-xs text-gray-500 hover:text-teal-700
                    disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronsLeft size={13} /> First
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-0.5 px-2 py-1.5 text-xs text-gray-500 hover:text-teal-700
                    disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={13} /> Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-0.5 mx-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .reduce((acc, p, i, arr) => {
                      if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === "..." ? (
                        <span key={`ellipsis-${i}`} className="px-1 text-xs text-gray-400">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-7 h-7 text-xs rounded transition-colors
                            ${page === p
                              ? "bg-teal-600 text-white font-semibold"
                              : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-0.5 px-2 py-1.5 text-xs text-teal-700 font-semibold
                    hover:underline disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight size={13} />
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                  className="flex items-center gap-0.5 px-2 py-1.5 text-xs text-gray-500 hover:text-teal-700
                    disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Last <ChevronsRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}