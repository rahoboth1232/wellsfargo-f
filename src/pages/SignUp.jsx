import { useState } from "react";
import {
  Lock, CheckCircle, ChevronDown, AlertCircle, Calendar,
  Smartphone, ChevronRight, Eye, EyeOff, ShieldCheck,
  Menu, X, PlusCircle,
} from "lucide-react";
import octagon from '../assets/octogon-white.avif'
import { registerApi } from "../api/registerApi";
import { useNavigate } from "react-router-dom";

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

const SUFFIX_OPTIONS = ["None", "Jr.", "Sr.", "II", "III", "IV", "V"];

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

// ── Shared field components ────────────────────────────────────────────────

function Field({ label, optional, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`text-sm font-semibold ${error ? "text-red-600" : "text-gray-600"}`}
        style={{ fontFamily: "sans-serif" }}>
        {label}{optional && <span className="font-normal text-gray-400"> (optional)</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 mt-0.5">
          <AlertCircle size={13} className="text-red-600 shrink-0" />
          <span className="text-xs text-red-600" style={{ fontFamily: "sans-serif" }}>{error}</span>
        </div>
      )}
    </div>
  );
}

function TextInput({ value, onChange, error, placeholder = "", type = "text" }) {
  return (
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`border-b-2 bg-transparent outline-none py-2 text-gray-900 text-base transition-colors focus:border-blue-700 placeholder-gray-300 ${error ? "border-red-500" : "border-gray-300"}`}
      style={{ fontFamily: "sans-serif" }} />
  );
}

function SelectInput({ value, onChange, options, error }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className={`w-full border-b-2 bg-transparent outline-none py-2 pr-8 text-gray-900 text-base appearance-none focus:border-blue-700 cursor-pointer ${error ? "border-red-500" : "border-gray-300"}`}
        style={{ fontFamily: "sans-serif" }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
    </div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="w-full shadow-md bg-[#005eb8]">
      <div className=" px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-4">
          <button className="text-white hover:opacity-75 transition-opacity">
            <Menu size={22} />
          </button>
          <img className="w-5 h-5" src={octagon} alt="" /> 
        </div>
        <button className="text-white text-sm font-semibold tracking-wide hover:opacity-75 transition-opacity"
          style={{ fontFamily: "sans-serif" }}>
          Exit
        </button>
      </div>
    </nav>
  );
}

// ── Step 1: Name ───────────────────────────────────────────────────────────

function StepName({ data, onChange, errors }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Let's get to know you</h1>
      <p className="text-gray-500 text-sm mb-8" style={{ fontFamily: "sans-serif" }}>
        Tell us your full legal name as it appears on your government ID.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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

// ── Step 2: Birthday ───────────────────────────────────────────────────────

function StepBirthday({ data, onChange, errors }) {
  const handleDateInput = (raw) => {
    let digits = raw.replace(/\D/g, "").slice(0, 8);
    let out = digits;
    if (digits.length > 4) out = digits.slice(0,2) + "/" + digits.slice(2,4) + "/" + digits.slice(4);
    else if (digits.length > 2) out = digits.slice(0,2) + "/" + digits.slice(2);
    onChange("dob", out);
  };
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">When's your birthday?</h1>
      <p className="text-gray-500 text-sm mb-8" style={{ fontFamily: "sans-serif" }}>
        You need to be at least 18 years old to apply.
      </p>
      <div className="max-w-xs">
        <Field label="Date of birth" error={errors.dob}>
          <div className="relative flex items-center">
            <input type="text" value={data.dob} onChange={(e) => handleDateInput(e.target.value)}
              placeholder="mm/dd/yyyy" maxLength={10}
              className={`w-full border-b-2 bg-transparent outline-none py-2 pr-8 text-gray-900 text-base transition-colors focus:border-blue-700 placeholder-gray-400 ${errors.dob ? "border-red-500" : "border-gray-300"}`}
              style={{ fontFamily: "sans-serif" }} />
            <Calendar size={18} className="absolute right-1 text-blue-700 pointer-events-none" />
          </div>
          {!errors.dob && <span className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: "sans-serif" }}>mm/dd/yyyy</span>}
        </Field>
      </div>
    </>
  );
}

// ── Step 3: Contact ────────────────────────────────────────────────────────

function StepContact({ data, onChange, errors }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">What's your contact info?</h1>
      <p className="text-gray-500 text-sm mb-8" style={{ fontFamily: "sans-serif" }}>
        We'll only use your number to help us service your account.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
        <Field label="Email address" error={errors.email}>
          <TextInput value={data.email} onChange={(v) => onChange("email", v)} error={errors.email} type="email" />
        </Field>
        <Field label="Phone number (mobile preferred)" error={errors.phone}>
          <TextInput value={data.phone} onChange={(v) => onChange("phone", v)} error={errors.phone} placeholder="000-000-0000" />
        </Field>
        <Field label="Password">
  <TextInput
    type="password"
    value={data.password}
    onChange={(v) => onChange("password", v)}
  />
</Field>
      </div>
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex gap-3">
          <Smartphone size={18} className="text-gray-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "sans-serif" }}>
              By giving us your mobile number, Chase has your consent to send you automated calls and texts to service all of your accounts with us.
            </p>
            {expanded && (
              <p className="text-sm text-gray-500 mt-2 leading-relaxed" style={{ fontFamily: "sans-serif" }}>
                Message and data rates may apply. You may opt out at any time by texting STOP. Standard message frequency varies. For help, text HELP.
              </p>
            )}
            <button onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-blue-700 text-sm font-medium mt-2 hover:underline"
              style={{ fontFamily: "sans-serif" }}>
              <ChevronRight size={14} className={`transition-transform ${expanded ? "rotate-90" : ""}`} />
              {expanded ? "Collapse" : "Please read"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Step 4: Address ────────────────────────────────────────────────────────

function StepAddress({ data, onChange, errors }) {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">What's your home address?</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Field label="Street address" error={errors.street}>
          <TextInput value={data.street} onChange={(v) => onChange("street", v)} error={errors.street} />
        </Field>
        <Field label="Suite/apt/other" optional>
          <TextInput value={data.suite} onChange={(v) => onChange("suite", v)} />
        </Field>
        <Field label="City" error={errors.city}>
          <TextInput value={data.city} onChange={(v) => onChange("city", v)} error={errors.city} />
        </Field>
        <Field label="State" error={errors.state}>
          <SelectInput value={data.state || "Select state"} onChange={(v) => onChange("state", v)}
            options={["Select state", ...US_STATES]} error={errors.state} />
        </Field>
        <Field label="ZIP code" error={errors.zip}>
          <TextInput value={data.zip} onChange={(v) => onChange("zip", v.replace(/\D/g,"").slice(0,5))} error={errors.zip} />
        </Field>
      </div>
      <button className="flex items-center gap-1 text-blue-700 text-sm font-medium mt-6 hover:underline"
        style={{ fontFamily: "sans-serif" }}>
        <ChevronRight size={14} />
        Important information if you're a resident of Canada for tax purposes.
      </button>
    </>
  );
}

// ── Step 5: Citizenship ────────────────────────────────────────────────────

function StepCitizenship({ data, onChange, errors }) {
  const [extraCountries, setExtraCountries] = useState([]);

  const addCountry = () => {
    if (extraCountries.length < 3) setExtraCountries((p) => [...p, "Select country"]);
  };
  const removeCountry = (i) => setExtraCountries((p) => p.filter((_, idx) => idx !== i));
  const updateCountry = (i, v) => setExtraCountries((p) => p.map((c, idx) => idx === i ? v : c));

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Tell us your citizenship status</h1>

      <p className="text-base text-gray-700 mb-3 font-medium" style={{ fontFamily: "sans-serif" }}>
        Are you a U.S. citizen?
      </p>

      <div className="flex flex-col gap-3 mb-6">
        {["Yes", "No"].map((opt) => (
          <label key={opt} className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onChange("usCitizen", opt)}
            style={{ fontFamily: "sans-serif" }}>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
              data.usCitizen === opt ? "border-blue-700" : "border-gray-400 group-hover:border-blue-400"
            }`}>
              {data.usCitizen === opt && <div className="w-2.5 h-2.5 rounded-full bg-blue-700" />}
            </div>
            <span className="text-base text-gray-800">{opt}</span>
          </label>
        ))}
      </div>

      {errors.usCitizen && (
        <div className="flex items-center gap-1.5 mb-4">
          <AlertCircle size={13} className="text-red-600" />
          <span className="text-xs text-red-600" style={{ fontFamily: "sans-serif" }}>{errors.usCitizen}</span>
        </div>
      )}

      {/* Primary country box */}
      <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
        <p className="text-xs text-gray-500 mb-1 font-medium" style={{ fontFamily: "sans-serif" }}>Country of citizenship</p>
        <p className="text-base font-semibold text-gray-900" style={{ fontFamily: "sans-serif" }}>
          {data.usCitizen === "Yes" ? "United States of America" : "—"}
        </p>
      </div>

      {/* Extra countries */}
      {extraCountries.map((country, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-2 font-medium" style={{ fontFamily: "sans-serif" }}>
                Additional country of citizenship
              </p>
              <SelectInput value={country} onChange={(v) => updateCountry(i, v)} options={["Select country", ...COUNTRIES]} />
            </div>
            <button onClick={() => removeCountry(i)} className="text-gray-400 hover:text-red-500 transition-colors mt-5">
              <X size={16} />
            </button>
          </div>
        </div>
      ))}

      {extraCountries.length < 3 && (
        <button onClick={addCountry}
          className="flex items-center gap-2 text-blue-700 text-sm font-semibold hover:underline mt-1"
          style={{ fontFamily: "sans-serif" }}>
          <PlusCircle size={16} />
          Add another country of citizenship
        </button>
      )}
    </>
  );
}

// ── Step 6: SSN ────────────────────────────────────────────────────────────

function StepSSN({ data, onChange, errors }) {
  const [show, setShow] = useState(false);

  const formatSSN = (raw) => {
    let digits = raw.replace(/\D/g, "").slice(0, 9);
    if (digits.length > 5) return digits.slice(0,3) + "-" + digits.slice(3,5) + "-" + digits.slice(5);
    if (digits.length > 3) return digits.slice(0,3) + "-" + digits.slice(3);
    return digits;
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">
        What's your Social Security number?
      </h1>

      <div className="max-w-sm mb-6">
        <Field label="Social Security number" error={errors.ssn}>
          <div className="relative flex items-center">
            <input
              type={show ? "text" : "password"}
              value={data.ssn}
              onChange={(e) => onChange("ssn", formatSSN(e.target.value))}
              placeholder="•••-••-••••"
              maxLength={11}
              className={`w-full border-b-2 bg-transparent outline-none py-2 pr-20 text-gray-900 text-base transition-colors focus:border-blue-700 placeholder-gray-300 ${errors.ssn ? "border-red-500" : "border-gray-300"}`}
              style={{ fontFamily: "sans-serif" }}
            />
            <button
              onClick={() => setShow(!show)}
              className="absolute right-1 text-blue-700 text-sm font-semibold hover:opacity-75 transition-opacity flex items-center gap-1"
              style={{ fontFamily: "sans-serif" }}>
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </Field>
      </div>

      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-start gap-3 max-w-lg">
        <ShieldCheck size={18} className="text-gray-500 shrink-0 mt-0.5" />
        <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "sans-serif" }}>
          We need to ask for your SSN to verify your information. We'll keep your data secure.
        </p>
      </div>
    </>
  );
}

// ── Validation ─────────────────────────────────────────────────────────────

function validate(step, data) {
  const e = {};
  if (step === 1) {
    if (!data.firstName.trim()) e.firstName = "Please tell us your first name.";
    if (!data.lastName.trim()) e.lastName = "Please tell us your last name.";
  }
  if (step === 2) {
    const dobRe = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dobRe.test(data.dob)) { e.dob = "Please enter a valid date (mm/dd/yyyy)."; }
    else {
      const [m, d, y] = data.dob.split("/").map(Number);
      const age = (new Date() - new Date(y, m - 1, d)) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) e.dob = "You must be at least 18 years old to apply.";
    }
  }
  if (step === 3) {
    if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) e.email = "Please enter a valid email address.";
    if (!data.phone.trim() || data.phone.replace(/\D/g,"").length < 10) e.phone = "Please enter a valid 10-digit phone number.";
  }
  if (step === 4) {
    if (!data.street.trim()) e.street = "Please enter your street address.";
    if (!data.city.trim()) e.city = "Please enter your city.";
    if (!data.state || data.state === "Select state") e.state = "Please select a state.";
    if (!data.zip || data.zip.length < 5) e.zip = "Please enter a valid 5-digit ZIP code.";
  }
  if (step === 5) {
    if (!data.usCitizen) e.usCitizen = "Please select an option.";
  }
  if (step === 6) {
    const digits = (data.ssn || "").replace(/\D/g, "");
    if (digits.length !== 9) e.ssn = "Please enter a valid 9-digit Social Security number.";
  }
  return e;
}

// ── Root ───────────────────────────────────────────────────────────────────

export default function ChaseMultiStepForm() {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "", middleName: "", lastName: "", suffix: "None",
    dob: "",
    password: "",
    email: "", phone: "",
    street: "", suite: "", city: "", state: "Select state", zip: "",
    usCitizen: "",
    ssn: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

const handleNext = async () => {
  const errs = validate(step, formData);

  if (Object.keys(errs).length) {
    setErrors(errs);
    return;
  }

  setErrors({});

  if (step < 6) {
    setStep((s) => s + 1);
  } else {
    const res = await handleSubmit();

    if (res.success) {
      // ✅ redirect to dashboard
  navigate("/dashboard");
    } else {
      // ❌ show backend error
      setErrors({
        api:
          res.error?.email?.[0] ||
          res.error?.username?.[0] ||
          res.error?.error ||
          "Registration failed"
      });
    }
  }
};
  const handleBack = () => { setErrors({}); setStep((s) => s - 1); };

  const progress = STEPS.find((s) => s.id === step)?.progress ?? 18;

const handleSubmit = async () => {
  try {
    const [m, d, y] = formData.dob.split("/");

    const payload = {
      username: formData.email,
      email: formData.email,
      password: formData.password,
      full_name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim(),
      mobile: formData.phone.replace(/\D/g, ""),
      ssn: formData.ssn.replace(/\D/g, ""),
      date_of_birth: `${y}-${m}-${d}`,
      address: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}`
    };

    const result = await registerApi(payload);

    localStorage.setItem("token", result.access);

    return { success: true };

  } catch (err) {
    return {
      success: false,
      error: err
    };
  }
};

  if (done) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'Georgia', serif" }}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="bg-white rounded-2xl shadow-md p-12 text-center max-w-md">
            <CheckCircle className="text-green-600 mx-auto mb-4" size={56} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "sans-serif" }}>
              Thank you,{" "}
              <span className="font-semibold text-gray-700">{formData.firstName}</span>.
              We'll review your Chase Total Checking application and get back to you shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'Georgia', serif" }}>
      <Navbar />

      <div className="flex-1 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">

          {/* Sidebar */}
          <aside className="bg-white border-r border-gray-100 px-8 py-10 md:w-72 shrink-0">
            <p className="text-xs text-gray-500 mb-1 tracking-widest uppercase font-medium"
              style={{ fontFamily: "sans-serif" }}>
              You're applying for:
            </p>
            <h2 className="text-xl font-bold text-gray-900 mb-6 leading-tight">
              Chase Total Checking<sup className="text-xs align-super">®</sup>
            </h2>

            <div className="flex items-center gap-2 mb-6">
              <CheckCircle size={17} className="text-green-600 shrink-0" />
              <span className="text-sm text-gray-700" style={{ fontFamily: "sans-serif" }}>
                We're applying your offer.
              </span>
            </div>

            <div className="border-t border-gray-200 pt-5 mb-8">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 bg-gray-100 rounded-md shrink-0">
                  <Lock size={14} className="text-gray-600" />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "sans-serif" }}>
                  <span className="font-semibold text-gray-700">Connection secured.</span>{" "}
                  We work to ensure your personal information stays safe.
                </p>
              </div>
            </div>

            {/* Step indicators */}
            <div className="space-y-3">
              {STEPS.map((s) => (
                <div key={s.id} className="flex items-center gap-2.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all duration-300 ${
                    s.id < step
                      ? "bg-green-600 text-white"
                      : s.id === step
                      ? "bg-blue-700 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`} style={{ fontFamily: "sans-serif" }}>
                    {s.id < step ? "✓" : s.id}
                  </div>
                  <span className={`text-xs font-medium transition-colors ${
                    s.id === step ? "text-blue-700" : s.id < step ? "text-green-700" : "text-gray-400"
                  }`} style={{ fontFamily: "sans-serif" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 px-8 md:px-12 py-10">
            {/* Progress */}
            <div className="mb-8">
              <p className="text-sm text-gray-500 mb-2 font-medium" style={{ fontFamily: "sans-serif" }}>
                Your information
              </p>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%`, background: "linear-gradient(90deg,#003087 0%,#0056d6 100%)" }} />
              </div>
            </div>

            {/* Steps */}
            <div className="min-h-72">
              {step === 1 && <StepName data={formData} onChange={handleChange} errors={errors} />}
              {step === 2 && <StepBirthday data={formData} onChange={handleChange} errors={errors} />}
              {step === 3 && <StepContact data={formData} onChange={handleChange} errors={errors} />}
              {step === 4 && <StepAddress data={formData} onChange={handleChange} errors={errors} />}
              {step === 5 && <StepCitizenship data={formData} onChange={handleChange} errors={errors} />}
              {step === 6 && <StepSSN data={formData} onChange={handleChange} errors={errors} />}
            </div>

            {/* Nav buttons */}
            <div className={`mt-10 flex ${step > 1 ? "justify-between" : "justify-end"}`}>
              {step > 1 && (
                <button onClick={handleBack}
                  className="px-10 py-3 rounded-md text-blue-700 font-semibold text-sm border-2 border-blue-700 hover:bg-blue-50 transition-colors"
                  style={{ fontFamily: "sans-serif" }}>
                  Back
                </button>
              )}
              <button onClick={handleNext}
                className="px-12 py-3 rounded-md text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg,#003087 0%,#0056d6 100%)", fontFamily: "sans-serif", boxShadow: "0 4px 14px rgba(0,80,180,0.25)" }}>
                Next
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}