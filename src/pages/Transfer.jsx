import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useCreateTransfer, useTransferData } from "../hooks/useTransfer";
import toast from "react-hot-toast";

// ─── Constants ────────────────────────────────────────────────────────────────

const FREQUENCIES = [
  "One time",
  "Weekly",
  "Every two weeks",
  "Monthly",
  "Quarterly",
];

const SIDEBAR_LINKS = [
  "Go to Transfer & Payment Activity",
  "Manage alerts to stay on track with your payments",
  "View your statements for more transaction details",
];

// ─── Reusable Select Dropdown ─────────────────────────────────────────────────

function SelectDropdown({ id, placeholder, options, value, onChange, required }) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`w-full appearance-none border border-gray-300 rounded-sm px-4 py-3 pr-10 text-sm
          focus:outline-none focus:border-teal-600 bg-white cursor-pointer transition-colors
          ${!value ? "text-gray-500" : "text-gray-800"}`}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <ChevronDown size={16} className="text-teal-700" fill="#0f766e" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TransferForm() {
  const { data, isLoading } = useTransferData();
  const transferMutation = useCreateTransfer();

  const [form, setForm] = useState({
    action: "internal",
    from_account: "",
    to_account: "",
    frequency: "",
    amount: "",
    memo: "",
    date: "",
  });

  const handleChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setForm({
      action: "internal",
      from_account: "",
      to_account: "",
      frequency: "",
      amount: "",
      memo: "",
      date: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    transferMutation.mutate(form, {
      onSuccess: () => {
        toast.success("Transfer completed successfully");
        handleReset();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.error || "Transfer failed");
      },
    });
  };

  // Build account option list from API
  const accountOptions = isLoading
    ? []
    : (data?.accounts ?? []).map((acc) => ({
        value: String(acc.id),
        label: `${acc.account_number} — $${acc.balance} (${acc.account_type})`,
      }));

  // Remove selected "from" account from "to" list
  const toOptions = accountOptions.filter(
    (opt) => opt.value !== form.from_account
  );

  const isValid =
    form.from_account &&
    form.to_account &&
    form.amount &&
    form.date &&
    !transferMutation.isPending;

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-screen-xl mx-auto px-6 py-6">

        {/* Non-WF accounts link row */}
        <div className="flex justify-end mb-6">
          <span className="text-sm text-gray-600">
            Non-Wells Fargo accounts:{" "}
            <a href="#" className="text-teal-700 font-medium hover:underline">
              Add account
            </a>{" "}
            |{" "}
            <a href="#" className="text-teal-700 font-medium hover:underline">
              Manage
            </a>
          </span>
        </div>

        {/* Two-column layout */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-8">

            {/* ── Left: Form ── */}
            <div className="col-span-2">

              {/* From */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  From
                </label>
                <SelectDropdown
                  id="from_account"
                  placeholder="Select Account"
                  options={accountOptions}
                  value={form.from_account}
                  onChange={handleChange("from_account")}
                  required
                />
              </div>

              {/* To */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  To
                </label>
                <SelectDropdown
                  id="to_account"
                  placeholder="Select Account"
                  options={toOptions}
                  value={form.to_account}
                  onChange={handleChange("to_account")}
                  required
                />
              </div>

              {/* Frequency + Date side by side */}
              <div className="flex gap-6 mb-6">
                <div className="w-64">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Frequency
                  </label>
                  <SelectDropdown
                    id="frequency"
                    placeholder="Select one"
                    options={FREQUENCIES}
                    value={form.frequency}
                    onChange={handleChange("frequency")}
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={form.date}
                    onChange={(e) => handleChange("date")(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm text-gray-800
                      focus:outline-none focus:border-teal-600 bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Amount + Memo side by side */}
              <div className="flex gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Amount
                  </label>
                  <div
                    className="flex items-stretch w-56 border border-gray-300 rounded-sm overflow-hidden
                      focus-within:border-teal-600 transition-colors"
                  >
                    <div className="bg-gray-100 border-r border-gray-300 px-3 flex items-center">
                      <span className="text-gray-500 text-sm font-medium">$</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      value={form.amount}
                      onChange={(e) => handleChange("amount")(e.target.value)}
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      required
                      className="flex-1 px-3 py-3 text-sm text-gray-800 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Memo
                    <span className="ml-1 text-xs font-normal text-gray-400">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="memo"
                    value={form.memo}
                    onChange={(e) => handleChange("memo")(e.target.value)}
                    placeholder="Optional note"
                    className="w-full border border-gray-300 rounded-sm px-4 py-3 text-sm text-gray-800
                      focus:outline-none focus:border-teal-600 bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-200 mb-6" />

              {/* Action Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-10 py-3 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300
                    hover:bg-gray-200 transition-colors rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid}
                  className={`px-10 py-3 text-sm font-medium rounded-sm transition-colors
                    ${isValid
                      ? "bg-teal-600 text-white hover:bg-teal-700 cursor-pointer"
                      : "bg-teal-300 text-white cursor-not-allowed"
                    }`}
                >
                  {transferMutation.isPending ? "Processing..." : "Continue"}
                </button>
              </div>
            </div>

            {/* ── Right: Sidebar ── */}
            <div className="col-span-1">
              <div className="border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700 rounded-sm">
                You have no scheduled transfers or payments.
              </div>

              <div className="border-t border-gray-300">
                {SIDEBAR_LINKS.map((link, i) => (
                  <a
                    key={i}
                    href="#"
                    className="flex items-center justify-between py-4 border-b border-gray-200
                      text-sm text-gray-700 hover:text-teal-700 transition-colors group"
                  >
                    <span className="pr-4 leading-snug">{link}</span>
                    <ChevronRight
                      size={18}
                      className="flex-shrink-0 text-gray-400 group-hover:text-teal-700 transition-colors"
                    />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}