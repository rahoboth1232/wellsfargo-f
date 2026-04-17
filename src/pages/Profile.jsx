import { useState } from "react";
import { useProfile } from "../hooks/useProfile";


const WF_RED = "#C8102E";
const WF_GOLD = "#FFCD11";

// ─── Helper functions ─────────────────────────────────────────────────────────
function formatDOB(iso) {
  if (!iso) return "N/A";
  const [y, m, d] = iso.split("-");
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function parseAddress(addr) {
  if (!addr) return { street: "", city: "", state: "", zip: "", country: "India" };
  const parts = addr.split(",").map((s) => s.trim());
  const zip = parts.find((p) => /\d{5,6}/.test(p)) || "";
  const country = "India";
  const city = parts.length > 3 ? parts[parts.length - 3] : "";
  const state = parts.length > 2 ? parts[parts.length - 2] : "";
  const street = parts.slice(0, 2).join(", ");
  return { street, city, state, zip, country };
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function PersonIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function ContactIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.99 5.99l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function LockIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function BellIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function ShieldIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function DocIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function EditIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

// ─── Reusable UI Components ───────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: checked ? WF_RED : "#CBD5E1",
        border: "none", cursor: "pointer",
        position: "relative", transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 3,
        left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: "#fff", transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)", display: "block",
      }} />
    </button>
  );
}

function InfoRow({ label, value, editable, onEdit }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "14px 0", borderBottom: "1px solid #F1F5F9",
    }}>
      <div>
        <div style={{ fontSize: 12, color: "#64748B", marginBottom: 3, letterSpacing: "0.03em" }}>{label}</div>
        <div style={{ fontSize: 15, color: "#1E293B", fontWeight: 500 }}>{value}</div>
      </div>
      {editable && (
        <button
          onClick={onEdit}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            background: "none", border: `1px solid ${WF_RED}`,
            color: WF_RED, padding: "6px 14px", borderRadius: 4,
            fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = WF_RED; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = WF_RED; }}
        >
          <EditIcon /> Update
        </button>
      )}
    </div>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid #E2E8F0",
      borderRadius: 8, marginBottom: 20, overflow: "hidden",
    }}>
      {(title || description) && (
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #F1F5F9", background: "#FAFBFC" }}>
          {title && <div style={{ fontSize: 16, fontWeight: 700, color: "#1E293B", marginBottom: description ? 4 : 0 }}>{title}</div>}
          {description && <div style={{ fontSize: 13, color: "#64748B" }}>{description}</div>}
        </div>
      )}
      <div style={{ padding: "0 24px" }}>{children}</div>
    </div>
  );
}

function SaveBanner({ onSave, onCancel }) {
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onSave(); }, 1200);
  };
  return (
    <div style={{
      background: saved ? "#F0FDF4" : "#FFF7E6",
      border: `1px solid ${saved ? "#BBF7D0" : "#FDE68A"}`,
      borderRadius: 6, padding: "12px 20px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 20,
    }}>
      <span style={{ fontSize: 14, color: saved ? "#166534" : "#92400E", fontWeight: 500 }}>
        {saved ? "✓ Changes saved successfully." : "You have unsaved changes."}
      </span>
      {!saved && (
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{
            background: "none", border: "1px solid #CBD5E1", borderRadius: 4,
            padding: "7px 16px", fontSize: 13, cursor: "pointer", color: "#475569",
          }}>Cancel</button>
          <button onClick={handleSave} style={{
            background: WF_RED, border: "none", borderRadius: 4,
            padding: "7px 18px", fontSize: 13, color: "#fff", fontWeight: 700, cursor: "pointer",
          }}>Save Changes</button>
        </div>
      )}
    </div>
  );
}

function EditModal({ field, userData, onClose }) {
  const labels = {
    full_name: "Full Name",
    email: "Email Address",
    mobile: "Mobile Number",
    password: "Password",
    street: "Street Address",
    city: "City",
    state_zip: "State / ZIP",
  };
  const values = {
    full_name: userData.full_name || "",
    email: userData.email || "",
    mobile: userData.mobile || "",
    password: "",
    street: userData._addr?.street || "",
    city: userData._addr?.city || "",
    state_zip: `${userData._addr?.state || ""} ${userData._addr?.zip || ""}`.trim(),
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
        zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 10, padding: 32, width: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", marginBottom: 6 }}>
          Update {labels[field] || field}
        </div>
        <div style={{ fontSize: 13, color: "#64748B", marginBottom: 22 }}>
          For security, changes may require identity verification.
        </div>
        <input
          type={field === "password" ? "password" : "text"}
          defaultValue={values[field] || ""}
          style={{
            width: "100%", padding: "10px 14px", border: "1px solid #CBD5E1",
            borderRadius: 5, fontSize: 15, boxSizing: "border-box", marginBottom: 20, outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            background: "none", border: "1px solid #CBD5E1", borderRadius: 4,
            padding: "9px 20px", fontSize: 14, cursor: "pointer", color: "#475569",
          }}>Cancel</button>
          <button onClick={onClose} style={{
            background: WF_RED, border: "none", borderRadius: 4,
            padding: "9px 22px", fontSize: 14, color: "#fff", fontWeight: 700, cursor: "pointer",
          }}>Continue</button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab Panels ───────────────────────────────────────────────────────────────
function PersonalTab({ userData }) {
  const [editing, setEditing] = useState(null);
  return (
    <>
      <SectionCard title="Personal Details" description="Your legal name and identifying information as it appears on your accounts.">
        <InfoRow label="Full Legal Name" value={userData.full_name || "N/A"} editable onEdit={() => setEditing("full_name")} />
        <InfoRow label="Date of Birth" value={formatDOB(userData.date_of_birth)} editable={false} />
        <InfoRow label="Social Security Number" value={userData.masked_ssn || "N/A"} editable={false} />
        <InfoRow label="Customer ID" value={userData.id ? `#${userData.id}` : "N/A"} editable={false} />
        <div style={{ padding: "14px 0" }} />
      </SectionCard>
      {editing && <EditModal field={editing} userData={userData} onClose={() => setEditing(null)} />}
    </>
  );
}

function ContactTab({ userData }) {
  const [editing, setEditing] = useState(null);
  const addr = userData._addr || {};
  return (
    <>
      <SectionCard title="Email Address" description="Used for account alerts, statements, and important communications.">
        <InfoRow label="Primary Email" value={userData.email || "Not on file"} editable onEdit={() => setEditing("email")} />
        <div style={{ padding: "14px 0" }} />
      </SectionCard>
      <SectionCard title="Phone Numbers" description="Phone numbers on file for account access and fraud alerts.">
        <InfoRow label="Primary Mobile" value={userData.mobile || "Not on file"} editable onEdit={() => setEditing("mobile")} />
        <div style={{ padding: "14px 0" }} />
      </SectionCard>
      <SectionCard title="Mailing Address" description="Your primary address for correspondence and account documents.">
        <InfoRow label="Street Address" value={addr.street || "N/A"} editable onEdit={() => setEditing("street")} />
        <InfoRow label="City" value={addr.city || "N/A"} editable onEdit={() => setEditing("city")} />
        <InfoRow label="State / ZIP" value={`${addr.state || ""} ${addr.zip || ""}`.trim() || "N/A"} editable onEdit={() => setEditing("state_zip")} />
        <InfoRow label="Country" value={addr.country || "India"} editable={false} />
        <div style={{ padding: "14px 0" }} />
      </SectionCard>
      {editing && <EditModal field={editing} userData={userData} onClose={() => setEditing(null)} />}
    </>
  );
}

function SecurityTab({ userData }) {
  return (
    <>
      <SectionCard title="Password" description="A strong password keeps your account secure.">
        <InfoRow label="Current Password" value="●●●●●●●●●●●●" editable onEdit={() => {}} />
        <div style={{ padding: "14px 0" }} />
      </SectionCard>
      <SectionCard title="Two-Step Verification" description="Add an extra layer of security to your account sign-in.">
        <div style={{ padding: "16px 0" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 18px", background: "#F8FAFC", borderRadius: 6,
            border: "1px solid #E2E8F0", marginBottom: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📱</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>Text Message (SMS)</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>Sends a code to {userData.mobile || "N/A"}</div>
              </div>
            </div>
            <span style={{ background: "#DCFCE7", color: "#166534", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>Active</span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 18px", background: "#F8FAFC", borderRadius: 6, border: "1px solid #E2E8F0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔑</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>Authenticator App</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>Use Google Authenticator or similar</div>
              </div>
            </div>
            <button style={{ background: "none", border: `1px solid ${WF_RED}`, color: WF_RED, padding: "6px 16px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Set Up</button>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Recent Account Activity" description="Review sign-in history to detect unauthorized access.">
        {[
          { device: "Chrome — Windows", location: "New Delhi, India", time: "Today, 9:42 AM", current: true },
          { device: "Safari — iPhone 15", location: "New Delhi, India", time: "Yesterday, 6:15 PM", current: false },
          { device: "Wells Fargo Mobile App", location: "New Delhi, India", time: "Apr 13, 2:30 PM", current: false },
        ].map((session, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 0", borderBottom: i < 2 ? "1px solid #F1F5F9" : "none",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#1E293B", marginBottom: 3 }}>{session.device}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{session.location} · {session.time}</div>
            </div>
            {session.current
              ? <span style={{ background: "#EFF6FF", color: "#1D4ED8", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>This Device</span>
              : <button style={{ background: "none", border: "none", color: WF_RED, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Sign Out</button>}
          </div>
        ))}
        <div style={{ padding: "14px 0" }} />
      </SectionCard>
    </>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    low_balance: true, large_transaction: true, sign_in: true,
    transfer_sent: true, transfer_received: true, bill_due: false,
    promotions: false, statements_ready: true,
  });
  const [dirty, setDirty] = useState(false);
  const toggle = (key) => { setPrefs((p) => ({ ...p, [key]: !p[key] })); setDirty(true); };
  const groups = [
    {
      title: "Security Alerts", desc: "Critical notifications for account safety.",
      items: [
        { key: "sign_in", label: "Sign-in from new device", desc: "Alert when a new device accesses your account" },
        { key: "large_transaction", label: "Large transactions", desc: "Transactions over $500" },
      ],
    },
    {
      title: "Account Alerts", desc: "Stay on top of your account activity.",
      items: [
        { key: "low_balance", label: "Low balance warning", desc: "When balance falls below threshold" },
        { key: "transfer_sent", label: "Transfer sent", desc: "Confirmation when you send a transfer" },
        { key: "transfer_received", label: "Transfer received", desc: "Notification when funds are deposited" },
        { key: "bill_due", label: "Bill payment due", desc: "Reminders before due date" },
      ],
    },
    {
      title: "Document Alerts", desc: "Notifications about your documents.",
      items: [
        { key: "statements_ready", label: "Statements ready", desc: "When your monthly statement is available" },
        { key: "promotions", label: "Offers & promotions", desc: "Special offers tailored to you" },
      ],
    },
  ];
  return (
    <>
      {dirty && <SaveBanner onSave={() => setDirty(false)} onCancel={() => setDirty(false)} />}
      {groups.map((group) => (
        <SectionCard key={group.title} title={group.title} description={group.desc}>
          {group.items.map((item, i) => (
            <div key={item.key} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "14px 0", borderBottom: i < group.items.length - 1 ? "1px solid #F1F5F9" : "none",
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#1E293B", marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>{item.desc}</div>
              </div>
              <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
            </div>
          ))}
          <div style={{ padding: "14px 0" }} />
        </SectionCard>
      ))}
    </>
  );
}

function PrivacyTab() {
  const [prefs, setPrefs] = useState({
    share_affiliates: true, share_third_party: false,
    targeted_ads: false, analytics: true, personalization: true,
  });
  const [dirty, setDirty] = useState(false);
  const toggle = (key) => { setPrefs((p) => ({ ...p, [key]: !p[key] })); setDirty(true); };
  return (
    <>
      {dirty && <SaveBanner onSave={() => setDirty(false)} onCancel={() => setDirty(false)} />}
      <div style={{
        background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8,
        padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 12,
      }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
        <div style={{ fontSize: 13, color: "#78350F", lineHeight: 1.6 }}>
          Your privacy matters to us. These preferences control how Wells Fargo uses your information. Some sharing is required by law and cannot be limited.
        </div>
      </div>
      <SectionCard title="Information Sharing" description="Control how Wells Fargo shares your personal information.">
        {[
          { key: "share_affiliates", label: "Share with Wells Fargo affiliates", desc: "Used for marketing products within our family of companies" },
          { key: "share_third_party", label: "Share with third-party partners", desc: "Used for marketing non-Wells Fargo products and services" },
        ].map((item, i, arr) => (
          <div key={item.key} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#1E293B", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{item.desc}</div>
            </div>
            <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}
        <div style={{ padding: "14px 0" }} />
      </SectionCard>
      <SectionCard title="Online Experience" description="Manage your digital preferences.">
        {[
          { key: "targeted_ads", label: "Personalized advertisements", desc: "See ads tailored to your account activity" },
          { key: "analytics", label: "Usage analytics", desc: "Help us improve by sharing anonymous usage data" },
          { key: "personalization", label: "Product recommendations", desc: "Receive personalized product suggestions" },
        ].map((item, i, arr) => (
          <div key={item.key} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 0", borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none",
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#1E293B", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{item.desc}</div>
            </div>
            <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}
        <div style={{ padding: "14px 0" }} />
      </SectionCard>
    </>
  );
}

function DeliveryTab() {
  const [choices, setChoices] = useState({
    statements: "electronic", tax_docs: "electronic", notices: "paper", checks: "electronic",
  });
  const [dirty, setDirty] = useState(false);
  const set = (key, val) => { setChoices((c) => ({ ...c, [key]: val })); setDirty(true); };
  const docs = [
    { key: "statements", label: "Account Statements", desc: "Monthly account summaries" },
    { key: "tax_docs", label: "Tax Documents", desc: "1099s, year-end statements" },
    { key: "notices", label: "Legal & Regulatory Notices", desc: "Required compliance communications" },
    { key: "checks", label: "Check Images", desc: "Copies of cleared checks" },
  ];
  return (
    <>
      {dirty && <SaveBanner onSave={() => setDirty(false)} onCancel={() => setDirty(false)} />}
      <SectionCard title="Document Delivery" description="Choose how you'd like to receive your documents.">
        {docs.map((doc, i) => (
          <div key={doc.key} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 0", borderBottom: i < docs.length - 1 ? "1px solid #F1F5F9" : "none",
            flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#1E293B", marginBottom: 2 }}>{doc.label}</div>
              <div style={{ fontSize: 12, color: "#64748B" }}>{doc.desc}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["electronic", "paper"].map((opt) => (
                <button key={opt} onClick={() => set(doc.key, opt)} style={{
                  padding: "6px 16px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer",
                  background: choices[doc.key] === opt ? WF_RED : "#fff",
                  color: choices[doc.key] === opt ? "#fff" : "#475569",
                  border: `1px solid ${choices[doc.key] === opt ? WF_RED : "#CBD5E1"}`,
                }}>
                  {opt === "electronic" ? "📧 Electronic" : "📬 Paper Mail"}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div style={{ padding: "14px 0" }} />
      </SectionCard>
      <SectionCard title="Go Paperless" description="Switch all documents to electronic delivery at once.">
        <div style={{ padding: "16px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 14, color: "#475569", maxWidth: 400 }}>
            Switch all your documents to electronic delivery and help reduce paper waste.
          </div>
          <button
            onClick={() => { setChoices({ statements: "electronic", tax_docs: "electronic", notices: "electronic", checks: "electronic" }); setDirty(true); }}
            style={{ background: WF_RED, border: "none", borderRadius: 4, padding: "10px 22px", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Go Paperless Now
          </button>
        </div>
      </SectionCard>
    </>
  );
}

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: "personal", label: "Personal Information", icon: PersonIcon },
  { id: "contact", label: "Contact Information", icon: ContactIcon },
  { id: "security", label: "Security & Password", icon: LockIcon },
  { id: "notifications", label: "Alerts & Notifications", icon: BellIcon },
  { id: "privacy", label: "Privacy Preferences", icon: ShieldIcon },
  { id: "delivery", label: "Delivery Preferences", icon: DocIcon },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ProfileSection() {
  const [activeTab, setActiveTab] = useState("personal");

  const {data} = useProfile()

  // Fallback sample data if no data prop is passed
  const rawData = data || {
    address: " no data",
    date_of_birth: " ",
    email: "no data",
    full_name: " ",
    id: 2,
    image: null,
    masked_ssn: "XXX-XX-2223",
    mobile: "(123)-456-7890",
  };

  // Enrich data with parsed address
  const userData = {
    ...rawData,
    _addr: parseAddress(rawData.address),
  };

  const initials = getInitials(userData.full_name);

  const panels = {
    personal: <PersonalTab userData={userData} />,
    contact: <ContactTab userData={userData} />,
    security: <SecurityTab userData={userData} />,
    notifications: <NotificationsTab />,
    privacy: <PrivacyTab />,
    delivery: <DeliveryTab />,
  };

  return (
    <div style={{ fontFamily: "'Arial', sans-serif", background: "#F1F5F9", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── Main Layout ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 24 }}>

        {/* ── Sidebar ── */}
        <div>
          {/* Profile Card */}
          <div style={{
            background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8,
            padding: 24, marginBottom: 16, textAlign: "center",
          }}>
            {userData.image ? (
              <img
                src={userData.image}
                alt={userData.full_name}
                style={{ width: 76, height: 76, borderRadius: "50%", objectFit: "cover", margin: "0 auto 14px", border: `3px solid ${WF_GOLD}`, display: "block" }}
              />
            ) : (
              <div style={{
                width: 76, height: 76, borderRadius: "50%",
                background: WF_RED, margin: "0 auto 14px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, color: "#fff", fontWeight: 800,
                border: `3px solid ${WF_GOLD}`,
              }}>
                {initials}
              </div>
            )}
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1E293B", marginBottom: 4 }}>{userData.full_name}</div>
            <div style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>{userData.email}</div>
            <div style={{ fontSize: 11, color: "#94A3B8" }}>ID #{userData.id}</div>
          </div>

          {/* Nav */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ background: WF_RED, padding: "11px 18px" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, letterSpacing: "0.05em", textTransform: "uppercase" }}>My Profile</span>
            </div>
            {TABS.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 18px", background: isActive ? "#FFF5F5" : "none",
                  border: "none", borderBottom: i < TABS.length - 1 ? "1px solid #F1F5F9" : "none",
                  borderLeft: isActive ? `3px solid ${WF_RED}` : "3px solid transparent",
                  cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                  color: isActive ? WF_RED : "#475569",
                }}>
                  <Icon size={16} />
                  <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Help Box */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 8, padding: 18, marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", marginBottom: 8 }}>Need Help?</div>
            <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6, marginBottom: 12 }}>
              Our team is available 24/7 to assist with profile and account questions.
            </div>
            <button style={{ width: "100%", background: WF_RED, border: "none", borderRadius: 4, padding: "9px 0", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              1-800-869-3557
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ animation: "fadeIn 0.25s ease" }} key={activeTab}>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1E293B", margin: "0 0 4px" }}>
              {TABS.find((t) => t.id === activeTab)?.label}
            </h1>
            <div style={{ width: 48, height: 3, background: WF_RED, borderRadius: 2 }} />
          </div>
          {panels[activeTab]}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        background: "#1E293B", padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
          © 2026 Wells Fargo Bank, N.A. All rights reserved. NMLSR ID 399801
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy Policy", "Security Center", "Terms of Use", "Accessibility"].map((l) => (
            <span key={l} style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}