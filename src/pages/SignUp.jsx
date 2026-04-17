import { useState } from "react";
import {
  Lock, CheckCircle, ChevronDown, AlertCircle, Calendar,
  Smartphone, ChevronRight, Eye, EyeOff, ShieldCheck,
  Menu, X, PlusCircle,
} from "lucide-react";
import { registerApi } from "../api/registerApi";
import { Link, useNavigate } from "react-router-dom";

/* ─── Wells Fargo Brand Tokens ──────────────────────────────────────────── */
const WF = {
  red:       "#D71E28",
  redDark:   "#A8141C",
  redLight:  "#F9E5E6",
  gold:      "#C8972B",
  goldLight: "#FDF6E7",
  navy:      "#1A3A5C",
  navyLight: "#E8EFF7",
  text:      "#1A1A1A",
  textMid:   "#4A4A4A",
  textMuted: "#767676",
  border:    "#D4D4D4",
  bg:        "#F5F5F0",
  white:     "#FFFFFF",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');

  .wf-root * { box-sizing: border-box; }
  .wf-root { font-family: 'Source Sans 3', Georgia, sans-serif; background: ${WF.bg}; min-height: 100vh; }

  /* Navbar */
  .wf-nav {
    background: ${WF.red};
    height: 56px; display: flex; align-items: center;
    padding: 0 24px; justify-content: space-between;
    box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  }
  .wf-nav-logo {
    display: flex; align-items: center; gap: 10px;
  }
  .wf-nav-icon {
    width: 36px; height: 36px; background: ${WF.white};
    border-radius: 4px; display: flex; align-items: center;
    justify-content: center;
  }
  .wf-nav-stagecoach {
    font-family: 'Playfair Display', serif;
    color: ${WF.red}; font-size: 13px; font-weight: 700;
    letter-spacing: -0.3px; line-height: 1;
  }
  .wf-nav-brand {
    font-family: 'Playfair Display', serif;
    color: ${WF.white}; font-size: 17px; font-weight: 700;
    letter-spacing: 0.2px;
  }
  .wf-nav-exit {
    background: transparent; border: 1.5px solid rgba(255,255,255,0.6);
    color: ${WF.white}; font-family: 'Source Sans 3', sans-serif;
    font-size: 13px; font-weight: 600; padding: 5px 16px;
    border-radius: 3px; cursor: pointer; letter-spacing: 0.3px;
    transition: background 0.15s;
  }
  .wf-nav-exit:hover { background: rgba(255,255,255,0.12); }

  /* Layout */
  .wf-page { display: flex; justify-content: center; padding: 32px 16px; }
  .wf-card {
    width: 100%; max-width: 960px;
    background: ${WF.white};
    border: 1px solid ${WF.border};
    border-radius: 4px;
    display: flex; flex-direction: row;
    box-shadow: 0 4px 24px rgba(0,0,0,0.09);
    overflow: hidden;
  }

  /* Sidebar */
  .wf-sidebar {
    width: 260px; min-width: 260px;
    background: ${WF.navy};
    padding: 32px 24px;
    display: flex; flex-direction: column;
  }
  .wf-sidebar-product-label {
    font-size: 10px; color: rgba(255,255,255,0.55);
    letter-spacing: 1.5px; text-transform: uppercase;
    font-weight: 600; margin-bottom: 6px;
  }
  .wf-sidebar-product-name {
    font-family: 'Playfair Display', serif;
    color: ${WF.white}; font-size: 18px; font-weight: 700;
    line-height: 1.3; margin-bottom: 24px;
  }
  .wf-sidebar-product-name sup {
    font-size: 10px; vertical-align: super;
  }
  .wf-sidebar-offer {
    display: flex; align-items: center; gap: 8px;
    background: rgba(200,151,43,0.18);
    border: 1px solid rgba(200,151,43,0.35);
    border-radius: 3px; padding: 9px 11px; margin-bottom: 20px;
  }
  .wf-sidebar-offer span {
    color: #F0C060; font-size: 12px; font-weight: 500;
  }
  .wf-sidebar-secure {
    display: flex; gap: 10px; align-items: flex-start;
    background: rgba(255,255,255,0.07);
    border-radius: 3px; padding: 11px; margin-bottom: 28px;
  }
  .wf-sidebar-secure p {
    font-size: 11.5px; color: rgba(255,255,255,0.65); line-height: 1.55; margin: 0;
  }
  .wf-sidebar-secure strong { color: rgba(255,255,255,0.9); font-weight: 600; }
  .wf-step-list { display: flex; flex-direction: column; gap: 10px; }
  .wf-step-item { display: flex; align-items: center; gap: 10px; }
  .wf-step-dot {
    width: 26px; height: 26px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; flex-shrink: 0;
    transition: all 0.25s;
  }
  .wf-step-dot.done   { background: #4CAF82; color: ${WF.white}; }
  .wf-step-dot.active { background: ${WF.red}; color: ${WF.white}; box-shadow: 0 0 0 3px rgba(215,30,40,0.25); }
  .wf-step-dot.future { background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.4); }
  .wf-step-label { font-size: 12.5px; font-weight: 500; transition: color 0.2s; }
  .wf-step-label.done   { color: #4CAF82; }
  .wf-step-label.active { color: ${WF.white}; font-weight: 600; }
  .wf-step-label.future { color: rgba(255,255,255,0.38); }
  .wf-sidebar-divider {
    height: 1px; background: rgba(255,255,255,0.1); margin: 20px 0;
  }

  /* Progress bar */
  .wf-progress-wrap { margin-bottom: 28px; }
  .wf-progress-label {
    font-size: 12px; color: ${WF.textMuted}; font-weight: 600;
    letter-spacing: 0.5px; margin-bottom: 8px;
    text-transform: uppercase;
  }
  .wf-progress-track {
    width: 100%; height: 4px; background: #E8E8E8; border-radius: 2px; overflow: hidden;
  }
  .wf-progress-fill {
    height: 100%; background: ${WF.red};
    border-radius: 2px; transition: width 0.5s cubic-bezier(.4,0,.2,1);
  }

  /* Main */
  .wf-main { flex: 1; padding: 36px 44px; }
  .wf-step-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px; font-weight: 700; color: ${WF.text};
    margin-bottom: 6px; line-height: 1.25;
  }
  .wf-step-sub {
    font-size: 14px; color: ${WF.textMuted}; margin-bottom: 28px; line-height: 1.6;
  }
  .wf-grid-2 {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 12px 28px; margin-bottom: 4px;
  }
  .wf-grid-1 { display: grid; grid-template-columns: 1fr; gap: 12px; }

  /* Field */
  .wf-field { display: flex; flex-direction: column; gap: 4px; }
  .wf-label {
    font-size: 12px; font-weight: 600; color: ${WF.textMid};
    letter-spacing: 0.3px; text-transform: uppercase;
  }
  .wf-label.error { color: ${WF.red}; }
  .wf-label .optional { font-weight: 400; text-transform: none; color: ${WF.textMuted}; letter-spacing: 0; }
  .wf-input {
    border: none; border-bottom: 2px solid ${WF.border};
    background: transparent; outline: none;
    padding: 9px 0; font-size: 15px; color: ${WF.text};
    font-family: 'Source Sans 3', sans-serif;
    transition: border-color 0.15s;
  }
  .wf-input::placeholder { color: #BBBBB5; }
  .wf-input:focus { border-bottom-color: ${WF.red}; }
  .wf-input.error { border-bottom-color: ${WF.red}; }
  .wf-select-wrap { position: relative; }
  .wf-select {
    width: 100%; border: none; border-bottom: 2px solid ${WF.border};
    background: transparent; outline: none; padding: 9px 0 9px 0;
    font-size: 15px; color: ${WF.text}; appearance: none;
    font-family: 'Source Sans 3', sans-serif; cursor: pointer;
    transition: border-color 0.15s;
  }
  .wf-select:focus { border-bottom-color: ${WF.red}; }
  .wf-select.error { border-bottom-color: ${WF.red}; }
  .wf-select-icon { position: absolute; right: 2px; top: 50%; transform: translateY(-50%); pointer-events: none; color: ${WF.textMuted}; }
  .wf-error-msg { display: flex; align-items: center; gap: 5px; margin-top: 2px; }
  .wf-error-msg span { font-size: 11.5px; color: ${WF.red}; }

  /* Info box */
  .wf-info-box {
    border: 1px solid #E0D8C4; border-left: 3px solid ${WF.gold};
    border-radius: 3px; padding: 13px 15px; background: ${WF.goldLight};
    display: flex; gap: 11px; align-items: flex-start;
  }
  .wf-info-box p { font-size: 13px; color: #5C4C2A; line-height: 1.6; margin: 0; }
  .wf-info-box .wf-icon { color: ${WF.gold}; flex-shrink: 0; margin-top: 1px; }

  /* Consent box */
  .wf-consent-box {
    border: 1px solid ${WF.border}; border-radius: 3px;
    padding: 14px 16px; background: #FAFAF8;
    display: flex; gap: 12px;
  }
  .wf-consent-box p { font-size: 12.5px; color: ${WF.textMuted}; line-height: 1.6; margin: 0; }

  /* Radio */
  .wf-radio-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .wf-radio-opt { display: flex; align-items: center; gap: 11px; cursor: pointer; }
  .wf-radio-circle {
    width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${WF.border};
    display: flex; align-items: center; justify-content: center; transition: border-color 0.15s; flex-shrink: 0;
  }
  .wf-radio-circle.active { border-color: ${WF.red}; }
  .wf-radio-dot { width: 10px; height: 10px; border-radius: 50%; background: ${WF.red}; }
  .wf-radio-label { font-size: 15px; color: ${WF.text}; }

  /* Country box */
  .wf-country-box {
    border: 1px solid ${WF.border}; border-radius: 3px;
    padding: 12px 15px; background: #FAFAF8; margin-bottom: 10px;
  }
  .wf-country-box-label { font-size: 10.5px; color: ${WF.textMuted}; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 3px; }
  .wf-country-box-val { font-size: 15px; font-weight: 600; color: ${WF.text}; }

  /* Buttons */
  .wf-btn-row { display: flex; justify-content: flex-end; gap: 12px; margin-top: 36px; align-items: center; }
  .wf-btn-back {
    background: transparent; border: 2px solid ${WF.navy}; color: ${WF.navy};
    font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 600;
    padding: 10px 28px; border-radius: 3px; cursor: pointer; letter-spacing: 0.3px;
    transition: all 0.15s;
  }
  .wf-btn-back:hover { background: ${WF.navyLight}; }
  .wf-btn-next {
    background: ${WF.red}; border: 2px solid ${WF.red}; color: ${WF.white};
    font-family: 'Source Sans 3', sans-serif; font-size: 14px; font-weight: 600;
    padding: 10px 36px; border-radius: 3px; cursor: pointer; letter-spacing: 0.3px;
    transition: all 0.15s;
  }
  .wf-btn-next:hover { background: ${WF.redDark}; border-color: ${WF.redDark}; }
  .wf-btn-next:active { transform: scale(0.98); }

  .wf-text-link {
    display: flex; align-items: center; gap: 4px;
    color: ${WF.red}; font-size: 13px; font-weight: 600;
    background: none; border: none; cursor: pointer; padding: 0;
    text-decoration: none; margin-top: 14px;
  }
  .wf-text-link:hover { text-decoration: underline; }

  .wf-api-error {
    background: ${WF.redLight}; border: 1px solid #F5B5B8;
    border-radius: 3px; padding: 12px 16px; margin-top: 16px;
    display: flex; align-items: center; gap: 8px;
    font-size: 13px; color: ${WF.redDark};
  }

  /* Done screen */
  .wf-done {
    min-height: 100vh; display: flex; flex-direction: column;
    background: ${WF.bg};
  }
  .wf-done-body {
    flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 16px;
  }
  .wf-done-card {
    background: ${WF.white}; border: 1px solid ${WF.border};
    border-top: 4px solid ${WF.red}; border-radius: 4px;
    padding: 48px; text-align: center; max-width: 460px; width: 100%;
    box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  }
  .wf-done-icon {
    width: 64px; height: 64px; background: #E8F5EF; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
  }
  .wf-done-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700; color: ${WF.text}; margin-bottom: 10px;
  }
  .wf-done-sub { font-size: 14px; color: ${WF.textMuted}; line-height: 1.7; }

  /* SSN reveal */
  .wf-ssn-wrap { position: relative; display: flex; align-items: center; }
  .wf-ssn-btn {
    position: absolute; right: 2px;
    background: none; border: none; cursor: pointer;
    color: ${WF.red}; font-size: 13px; font-weight: 600;
    display: flex; align-items: center; gap: 4px;
    font-family: 'Source Sans 3', sans-serif;
  }

  @media (max-width: 700px) {
    .wf-card { flex-direction: column; }
    .wf-sidebar { width: 100%; min-width: unset; padding: 20px; }
    .wf-main { padding: 24px 20px; }
    .wf-grid-2 { grid-template-columns: 1fr; }
  }
`;

/* ─── Constants ─────────────────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Name",        progress: 18 },
  { id: 2, label: "Birthday",    progress: 34 },
  { id: 3, label: "Contact",     progress: 50 },
  { id: 4, label: "Address",     progress: 65 },
  { id: 5, label: "Citizenship", progress: 80 },
  { id: 6, label: "SSN",         progress: 95 },
];

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];
const SUFFIX_OPTIONS = ["None","Jr.","Sr.","II","III","IV","V"];
const COUNTRIES = [
  "United States of America","Afghanistan","Albania","Algeria","Argentina","Armenia",
  "Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Belarus",
  "Belgium","Bolivia","Bosnia","Brazil","Bulgaria","Cambodia","Cameroon","Canada",
  "Chad","Chile","China","Colombia","Croatia","Cuba","Cyprus","Czech Republic",
  "Denmark","Ecuador","Egypt","Estonia","Ethiopia","Finland","France","Germany",
  "Ghana","Greece","Guatemala","Hungary","Iceland","India","Indonesia","Iran","Iraq",
  "Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kuwait",
  "Latvia","Lebanon","Libya","Lithuania","Luxembourg","Malaysia","Mexico","Moldova",
  "Morocco","Myanmar","Nepal","Netherlands","New Zealand","Nigeria","Norway","Oman",
  "Pakistan","Panama","Peru","Philippines","Poland","Portugal","Qatar","Romania",
  "Russia","Rwanda","Saudi Arabia","Senegal","Singapore","Slovakia","Somalia",
  "South Africa","South Korea","Spain","Sri Lanka","Sweden","Switzerland","Syria",
  "Taiwan","Tanzania","Thailand","Tunisia","Turkey","Uganda","Ukraine",
  "United Arab Emirates","United Kingdom","Uruguay","Venezuela","Vietnam","Zimbabwe",
];

/* ─── Shared Field Components ───────────────────────────────────────────── */
function Field({ label, optional, error, children }) {
  return (
    <div className="wf-field">
      <label className={`wf-label${error ? " error" : ""}`}>
        {label}{optional && <span className="optional"> (optional)</span>}
      </label>
      {children}
      {error && (
        <div className="wf-error-msg">
          <AlertCircle size={13} color={WF.red} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

function TextInput({ value, onChange, error, placeholder = "", type = "text", extra }) {
  return (
    <input
      type={type} value={value} placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`wf-input${error ? " error" : ""}`}
      style={extra}
    />
  );
}

function SelectInput({ value, onChange, options, error }) {
  return (
    <div className="wf-select-wrap">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className={`wf-select${error ? " error" : ""}`}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={15} className="wf-select-icon" />
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar() {
  return (
    <nav className="wf-nav">
      <div className="wf-nav-logo">
        <button style={{ background:"none",border:"none",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center" }}>
          <Menu size={20} />
        </button>
        <div className="wf-nav-icon" style={{ marginLeft: 12 }}>
          <span className="wf-nav-stagecoach">WF</span>
        </div>
        <span className="wf-nav-brand" style={{ marginLeft: 10 }}>Wells Fargo</span>
      </div>
      <Link to="/" className="wf-nav-exit">Exit</Link>
    </nav>
  );
}

/* ─── Steps ──────────────────────────────────────────────────────────────── */
function StepName({ data, onChange, errors }) {
  return (
    <>
      <h1 className="wf-step-title">Let's get to know you</h1>
      <p className="wf-step-sub">Enter your full legal name exactly as it appears on your government-issued ID.</p>
      <div className="wf-grid-2">
        <Field label="First name" error={errors.firstName}>
          <TextInput value={data.firstName} onChange={(v) => onChange("firstName", v)} error={errors.firstName} />
        </Field>
        <Field label="Middle name" optional>
          <TextInput value={data.middleName} onChange={(v) => onChange("middleName", v)} />
        </Field>
        <Field label="Last name" error={errors.lastName}>
          <TextInput value={data.lastName} onChange={(v) => onChange("lastName", v)} error={errors.lastName} />
        </Field>
        <Field label="Suffix" optional>
          <SelectInput value={data.suffix} onChange={(v) => onChange("suffix", v)} options={SUFFIX_OPTIONS} />
        </Field>
      </div>
    </>
  );
}

function StepBirthday({ data, onChange, errors }) {
  const handleDateInput = (raw) => {
    let digits = raw.replace(/\D/g,"").slice(0,8);
    let out = digits;
    if (digits.length > 4) out = digits.slice(0,2)+"/"+digits.slice(2,4)+"/"+digits.slice(4);
    else if (digits.length > 2) out = digits.slice(0,2)+"/"+digits.slice(2);
    onChange("dob", out);
  };
  return (
    <>
      <h1 className="wf-step-title">When's your birthday?</h1>
      <p className="wf-step-sub">You must be at least 18 years old to apply for an account.</p>
      <div style={{ maxWidth: 300 }}>
        <Field label="Date of birth" error={errors.dob}>
          <div className="wf-ssn-wrap">
            <input type="text" value={data.dob} placeholder="mm/dd/yyyy" maxLength={10}
              onChange={(e) => handleDateInput(e.target.value)}
              className={`wf-input${errors.dob ? " error" : ""}`}
              style={{ paddingRight: 28, width: "100%" }} />
            <Calendar size={16} style={{ position:"absolute",right:2,color:WF.gold,pointerEvents:"none" }} />
          </div>
          {!errors.dob && <span style={{ fontSize:11,color:WF.textMuted }}>mm/dd/yyyy</span>}
        </Field>
      </div>
    </>
  );
}

function StepContact({ data, onChange, errors }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <h1 className="wf-step-title">How can we reach you?</h1>
      <p className="wf-step-sub">We'll use your contact info to service your account and send important updates.</p>
      <div className="wf-grid-2" style={{ marginBottom: 20 }}>
        <Field label="Email address" error={errors.email}>
          <TextInput value={data.email} onChange={(v) => onChange("email",v)} error={errors.email} type="email" />
        </Field>
        <Field label="Mobile phone number" error={errors.phone}>
          <TextInput value={data.phone} onChange={(v) => onChange("phone",v)} error={errors.phone} placeholder="000-000-0000" />
        </Field>
        <Field label="Password">
          <TextInput type="password" value={data.password} onChange={(v) => onChange("password",v)} />
        </Field>
      </div>
      <div className="wf-consent-box">
        <Smartphone size={17} style={{ color:WF.textMuted, flexShrink:0, marginTop:1 }} />
        <div>
          <p>By providing your mobile number, you consent to Wells Fargo sending automated calls and texts to service all of your accounts.</p>
          {expanded && (
            <p style={{ marginTop: 8 }}>Message and data rates may apply. You may opt out at any time by texting STOP. Standard message frequency varies. For help, text HELP.</p>
          )}
          <button className="wf-text-link" style={{ marginTop: 8 }} onClick={() => setExpanded(!expanded)}>
            <ChevronRight size={13} style={{ transform: expanded?"rotate(90deg)":"none", transition:"transform 0.2s" }} />
            {expanded ? "Collapse" : "Read full disclosure"}
          </button>
        </div>
      </div>
    </>
  );
}

function StepAddress({ data, onChange, errors }) {
  return (
    <>
      <h1 className="wf-step-title">What's your home address?</h1>
      <div className="wf-grid-2">
        <Field label="Street address" error={errors.street}>
          <TextInput value={data.street} onChange={(v) => onChange("street",v)} error={errors.street} />
        </Field>
        <Field label="Suite / Apt / Other" optional>
          <TextInput value={data.suite} onChange={(v) => onChange("suite",v)} />
        </Field>
        <Field label="City" error={errors.city}>
          <TextInput value={data.city} onChange={(v) => onChange("city",v)} error={errors.city} />
        </Field>
        <Field label="State" error={errors.state}>
          <SelectInput value={data.state||"Select state"} onChange={(v) => onChange("state",v)}
            options={["Select state",...US_STATES]} error={errors.state} />
        </Field>
        <Field label="ZIP code" error={errors.zip}>
          <TextInput value={data.zip} onChange={(v) => onChange("zip",v.replace(/\D/g,"").slice(0,5))} error={errors.zip} />
        </Field>
      </div>
      <button className="wf-text-link">
        <ChevronRight size={13} />
        Important information for Canadian tax residents
      </button>
    </>
  );
}

function StepCitizenship({ data, onChange, errors }) {
  const [extraCountries, setExtraCountries] = useState([]);
  const addCountry = () => { if (extraCountries.length < 3) setExtraCountries(p=>[...p,"Select country"]); };
  const removeCountry = (i) => setExtraCountries(p=>p.filter((_,idx)=>idx!==i));
  const updateCountry = (i,v) => setExtraCountries(p=>p.map((c,idx)=>idx===i?v:c));

  return (
    <>
      <h1 className="wf-step-title">Tell us your citizenship status</h1>
      <p style={{ fontSize:14.5, color:WF.textMid, fontWeight:600, marginBottom:12 }}>Are you a U.S. citizen?</p>
      <div className="wf-radio-group">
        {["Yes","No"].map(opt => (
          <div key={opt} className="wf-radio-opt" onClick={() => onChange("usCitizen",opt)}>
            <div className={`wf-radio-circle${data.usCitizen===opt?" active":""}`}>
              {data.usCitizen===opt && <div className="wf-radio-dot" />}
            </div>
            <span className="wf-radio-label">{opt}</span>
          </div>
        ))}
      </div>
      {errors.usCitizen && (
        <div className="wf-error-msg" style={{ marginBottom:12 }}>
          <AlertCircle size={13} color={WF.red} />
          <span style={{ fontSize:11.5, color:WF.red }}>{errors.usCitizen}</span>
        </div>
      )}
      <div className="wf-country-box">
        <div className="wf-country-box-label">Country of citizenship</div>
        <div className="wf-country-box-val">
          {data.usCitizen==="Yes" ? "United States of America" : "—"}
        </div>
      </div>
      {extraCountries.map((country, i) => (
        <div key={i} className="wf-country-box">
          <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
            <div style={{ flex:1 }}>
              <div className="wf-country-box-label">Additional country of citizenship</div>
              <SelectInput value={country} onChange={(v) => updateCountry(i,v)} options={["Select country",...COUNTRIES]} />
            </div>
            <button onClick={() => removeCountry(i)}
              style={{ background:"none",border:"none",cursor:"pointer",color:WF.textMuted,marginTop:18 }}>
              <X size={15} />
            </button>
          </div>
        </div>
      ))}
      {extraCountries.length < 3 && (
        <button className="wf-text-link" onClick={addCountry} style={{ marginTop:4 }}>
          <PlusCircle size={15} />
          Add another country of citizenship
        </button>
      )}
    </>
  );
}

function StepSSN({ data, onChange, errors }) {
  const [show, setShow] = useState(false);
  const formatSSN = (raw) => {
    let d = raw.replace(/\D/g,"").slice(0,9);
    if (d.length > 5) return d.slice(0,3)+"-"+d.slice(3,5)+"-"+d.slice(5);
    if (d.length > 3) return d.slice(0,3)+"-"+d.slice(3);
    return d;
  };
  return (
    <>
      <h1 className="wf-step-title">Social Security number</h1>
      <p className="wf-step-sub">Your SSN helps us verify your identity and is required by federal law.</p>
      <div style={{ maxWidth: 340, marginBottom: 24 }}>
        <Field label="Social Security number" error={errors.ssn}>
          <div className="wf-ssn-wrap">
            <input type={show?"text":"password"} value={data.ssn} placeholder="•••-••-••••" maxLength={11}
              onChange={(e) => onChange("ssn", formatSSN(e.target.value))}
              className={`wf-input${errors.ssn?" error":""}`}
              style={{ paddingRight: 64, width:"100%" }} />
            <button className="wf-ssn-btn" onClick={() => setShow(!show)}>
              {show ? <EyeOff size={13} /> : <Eye size={13} />}
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </Field>
      </div>
      <div className="wf-info-box" style={{ maxWidth: 500 }}>
        <ShieldCheck size={18} className="wf-icon" />
        <p>Wells Fargo uses 128-bit SSL encryption and multi-layered security to protect your personal information. Your SSN is never stored in plain text.</p>
      </div>
    </>
  );
}

/* ─── Validation ─────────────────────────────────────────────────────────── */
function validate(step, data) {
  const e = {};
  if (step===1) {
    if (!data.firstName.trim()) e.firstName="Please enter your first name.";
    if (!data.lastName.trim()) e.lastName="Please enter your last name.";
  }
  if (step===2) {
    const re=/^\d{2}\/\d{2}\/\d{4}$/;
    if (!re.test(data.dob)) e.dob="Please enter a valid date (mm/dd/yyyy).";
    else {
      const [m,d,y]=data.dob.split("/").map(Number);
      const age=(new Date()-new Date(y,m-1,d))/(1000*60*60*24*365.25);
      if (age<18) e.dob="You must be at least 18 years old to apply.";
    }
  }
  if (step===3) {
    if (!data.email.trim()||!/\S+@\S+\.\S+/.test(data.email)) e.email="Please enter a valid email address.";
    if (!data.phone.trim()||data.phone.replace(/\D/g,"").length<10) e.phone="Please enter a valid 10-digit phone number.";
  }
  if (step===4) {
    if (!data.street.trim()) e.street="Please enter your street address.";
    if (!data.city.trim()) e.city="Please enter your city.";
    if (!data.state||data.state==="Select state") e.state="Please select a state.";
    if (!data.zip||data.zip.length<5) e.zip="Please enter a valid 5-digit ZIP code.";
  }
  if (step===5) {
    if (!data.usCitizen) e.usCitizen="Please select an option.";
  }
  if (step===6) {
    const digits=(data.ssn||"").replace(/\D/g,"");
    if (digits.length!==9) e.ssn="Please enter a valid 9-digit Social Security number.";
  }
  return e;
}

/* ─── Root ───────────────────────────────────────────────────────────────── */
export default function WellsFargoSignupForm() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName:"", middleName:"", lastName:"", suffix:"None",
    dob:"", password:"", email:"", phone:"",
    street:"", suite:"", city:"", state:"Select state", zip:"",
    usCitizen:"", ssn:"",
  });

  const handleChange = (field, value) => {
    setFormData(p=>({...p,[field]:value}));
    if (errors[field]) setErrors(p=>({...p,[field]:undefined}));
  };

  const handleSubmit = async () => {
    try {
      const [m,d,y] = formData.dob.split("/");
      const payload = {
        username: formData.email, email: formData.email,
        password: formData.password,
        full_name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
        mobile: formData.phone.replace(/\D/g,""),
        ssn: formData.ssn.replace(/\D/g,""),
        date_of_birth: `${y}-${m}-${d}`,
        address: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`
      };
      const result = await registerApi(payload);
      localStorage.setItem("token", result.access);
      return { success:true };
    } catch(err) {
      return { success:false, error:err };
    }
  };

  const handleNext = async () => {
    const errs = validate(step, formData);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    if (step < 6) { setStep(s=>s+1); }
    else {
      const res = await handleSubmit();
      if (res.success) { navigate("/dashboard"); }
      else {
        setErrors({ api: res.error?.email?.[0]||res.error?.username?.[0]||res.error?.error||"Registration failed" });
      }
    }
  };
  const handleBack = () => { setErrors({}); setStep(s=>s-1); };
  const progress = STEPS.find(s=>s.id===step)?.progress??18;

  if (done) {
    return (
      <div className="wf-root">
        <style>{styles}</style>
        <Navbar />
        <div className="wf-done-body">
          <div className="wf-done-card">
            <div className="wf-done-icon">
              <CheckCircle size={32} color="#2E7D5A" />
            </div>
            <h2 className="wf-done-title">Application Submitted</h2>
            <p className="wf-done-sub">
              Thank you, <strong style={{ color:WF.text }}>{formData.firstName}</strong>. We've received your
              Wells Fargo Everyday Checking application and will be in touch shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wf-root">
      <style>{styles}</style>
      <Navbar />
      <div className="wf-page">
        <div className="wf-card">

          {/* Sidebar */}
          <aside className="wf-sidebar">
            <p className="wf-sidebar-product-label">You're applying for</p>
            <h2 className="wf-sidebar-product-name">
              Wells Fargo Everyday Checking<sup>®</sup>
            </h2>
            <div className="wf-sidebar-offer">
              <CheckCircle size={14} color="#F0C060" style={{ flexShrink:0 }} />
              <span>Your offer has been applied.</span>
            </div>
            <div className="wf-sidebar-divider" />
            <div className="wf-sidebar-secure">
              <Lock size={14} color="rgba(255,255,255,0.5)" style={{ flexShrink:0, marginTop:1 }} />
              <p><strong>Secured connection.</strong> Your personal information is protected with bank-level encryption.</p>
            </div>
            <div className="wf-step-list">
              {STEPS.map(s => {
                const state = s.id < step ? "done" : s.id === step ? "active" : "future";
                return (
                  <div key={s.id} className="wf-step-item">
                    <div className={`wf-step-dot ${state}`}>
                      {state==="done" ? "✓" : s.id}
                    </div>
                    <span className={`wf-step-label ${state}`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Main */}
          <main className="wf-main">
            <div className="wf-progress-wrap">
              <p className="wf-progress-label">Application progress</p>
              <div className="wf-progress-track">
                <div className="wf-progress-fill" style={{ width:`${progress}%` }} />
              </div>
            </div>

            <div style={{ minHeight: 280 }}>
              {step===1 && <StepName data={formData} onChange={handleChange} errors={errors} />}
              {step===2 && <StepBirthday data={formData} onChange={handleChange} errors={errors} />}
              {step===3 && <StepContact data={formData} onChange={handleChange} errors={errors} />}
              {step===4 && <StepAddress data={formData} onChange={handleChange} errors={errors} />}
              {step===5 && <StepCitizenship data={formData} onChange={handleChange} errors={errors} />}
              {step===6 && <StepSSN data={formData} onChange={handleChange} errors={errors} />}
            </div>

            {errors.api && (
              <div className="wf-api-error">
                <AlertCircle size={15} />
                {errors.api}
              </div>
            )}

            <div className="wf-btn-row" style={{ justifyContent: step>1?"space-between":"flex-end" }}>
              {step > 1 && (
                <button className="wf-btn-back" onClick={handleBack}>Back</button>
              )}
              <button className="wf-btn-next" onClick={handleNext}>
                {step===6 ? "Submit Application" : "Continue"}
              </button>
            </div>

            <p style={{ fontSize:11, color:WF.textMuted, marginTop:20, lineHeight:1.6 }}>
              Wells Fargo Bank, N.A. Member FDIC. Equal Housing Lender.
              By continuing, you agree to our{" "}
              <a href="#" style={{ color:WF.red, textDecoration:"none" }}>Terms & Conditions</a>{" "}
              and{" "}
              <a href="#" style={{ color:WF.red, textDecoration:"none" }}>Privacy Policy</a>.
            </p>
          </main>

        </div>
      </div>
    </div>
  );
}