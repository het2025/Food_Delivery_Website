import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { authService } from "../../services/api";
import { Loader, Eye, EyeOff } from "lucide-react";

// Helper: Prevent XSS/injection in inputs
const safeValue = s => (typeof s === "string" ? s.replace(/[<>\"'`]/g, "") : "");

export default function LoginSignup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, user } = useUser();

  // Throttle submissions (rate limit per session)
  const lastSubmitRef = useRef(Date.now());
  const [throttle, setThrottle] = useState(false);

  const defaultMode = location.pathname === "/signup" ? "signup" : "login";
  const [mode, setMode] = useState(defaultMode);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    phone: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validation hints state
  const [showPasswordHints, setShowPasswordHints] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isValidLength: false
  });

  // ✅ NEW: Handle browser back button - redirect to home page
  useEffect(() => {
    // Push current state to history
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (event) => {
      event.preventDefault();
      // When back button is clicked, redirect to appropriate home
      if (user) {
        // If user is logged in, go to authenticated home
        navigate("/home", { replace: true });
      } else {
        // If user is not logged in, go to main landing page
        navigate("/", { replace: true });
      }
    };

    // Listen for back button
    window.addEventListener("popstate", handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate, user]);

  // Password: at least 8 chars, upper, lower, number, special
  const isStrongPassword = pass => 
    /[A-Z]/.test(pass) &&
    /[a-z]/.test(pass) &&
    /[0-9]/.test(pass) &&
    /[@$!%*?&]/.test(pass) &&
    pass.length >= 8;

  const handleChange = e => {
    const { name, value } = e.target;

    // Phone number: only allow numeric input
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      setFormData(prev => ({
        ...prev,
        [name]: numericValue
      }));
      setError("");
      setSuccess("");
      return;
    }

    // Password: update validation hints
    if (name === "password") {
      const cleanValue = safeValue(value);
      setFormData(prev => ({
        ...prev,
        [name]: cleanValue
      }));

      // Update password validation state
      setPasswordValidation({
        hasUpperCase: /[A-Z]/.test(cleanValue),
        hasNumber: /[0-9]/.test(cleanValue),
        hasSpecialChar: /[@$!%*?&]/.test(cleanValue),
        isValidLength: cleanValue.length >= 8 && cleanValue.length <= 32
      });

      setError("");
      setSuccess("");
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: safeValue(value)
    }));
    setError("");
    setSuccess("");
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function validateForm() {
    if (mode === "login") {
      if (!formData.email.trim() || !emailRegex.test(formData.email)) {
        setError("Please enter a valid email.");
        return false;
      }
      if (!formData.password || formData.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return false;
      }
    } else {
      if (!formData.name.trim() || formData.name.trim().length < 2) {
        setError("Enter a valid name (2+ chars).");
        return false;
      }
      if (!formData.email.trim() || !emailRegex.test(formData.email)) {
        setError("Enter a valid email address.");
        return false;
      }
      if (!isStrongPassword(formData.password)) {
        setError(
          "Password must be at least 8 characters, include upper, lower, number, and symbol."
        );
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return false;
      }
      if (formData.phone && formData.phone.replace(/\D/g, "").length !== 10) {
        setError("Phone number (optional) must be 10 digits.");
        return false;
      }
    }
    return true;
  }

  const handleSubmit = async e => {
    e.preventDefault();

    // Throttle: block if less than 2 seconds since last submit
    const now = Date.now();
    if (throttle || now - lastSubmitRef.current < 2000) {
      setError("Please wait before trying again.");
      return;
    }
    lastSubmitRef.current = now;
    setThrottle(true);
    setTimeout(() => setThrottle(false), 2500);

    if (!validateForm()) return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      let response;
      // Only allow alphanum and valid characters (block obvious SQL injection etc)
      const emailSafe = safeValue(formData.email.trim().toLowerCase());
      if (!emailRegex.test(emailSafe)) {
        setError("Invalid email address.");
        return;
      }
      if (mode === "login") {
        response = await authService.login({
          email: emailSafe,
          password: formData.password
        });
        if (response.success && response.data?.token) {
          setUser(response.data.user);
          setSuccess("Login successful! Redirecting...");
          setTimeout(() => navigate("/home"), 800);
        } else {
          setError("Invalid login credentials."); // never reveal if user/email exists
        }
      } else {
        response = await authService.register({
          name: safeValue(formData.name.trim()),
          email: emailSafe,
          password: formData.password,
          phone: safeValue(formData.phone.trim().replace(/\D/g, ""))
        });
        if (response.success && response.data?.token) {
          setUser(response.data.user);
          setSuccess("Account created! Redirecting...");
          setTimeout(() => navigate("/home"), 1000);
        } else {
          setError("Signup failed. Please try again."); // never reveal details
        }
      }
    } catch (err) {
      setError("An unknown error occurred. Please try again."); // hide error details
    } finally {
      setLoading(false);
    }
  };

  const switchMode = targetMode => {
    setMode(targetMode);
    setError("");
    setSuccess("");
    navigate(targetMode === "login" ? "/login" : "/signup", { replace: true });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url('/login_background.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="w-full max-w-md px-6 pt-3 pb-8 mx-4 rounded-2xl drop-shadow-lg sm:px-8 sm:mx-0"
        style={{
          background: "linear-gradient(132deg, rgba(255,255,255,0.48) 85%, rgba(255,255,255,0.24) 98%)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          border: "1px solid rgba(255,255,255,0.18)"
        }}
      >
        <div className="mb-3 text-center">
          <img src="/quickbite_logo.svg" alt="QuickBite" className="object-contain w-12 h-12 mx-auto mb-1" />
          <h1 className="mb-2 text-3xl font-bold text-gray-800">
            {mode === "login" ? "" : "Create Account"}
          </h1>
          <p className="mb-1 text-gray-600">
            {mode === "login"
              ? "Sign in to your QuickBite account"
              : "Join QuickBite and discover amazing food"}
          </p>
        </div>
        {success && (
          <div className="flex items-center justify-center gap-2 px-4 py-3 mb-4 text-center text-green-600 border border-green-200 rounded-lg bg-green-50">
              {success}
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center gap-2 px-4 py-3 mb-4 text-center text-red-600 border border-red-200 rounded-lg bg-red-50">
              {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
          {mode === "signup" && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                autoComplete="name"
                disabled={loading}
                onChange={handleChange}
                required
                maxLength={128}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Your name"
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.name.length}/128 characters
              </p>
            </div>
          )}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              autoComplete="email"
              disabled={loading}
              onChange={handleChange}
              required
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Enter your email"
              spellCheck={false}
            />
          </div>
          {mode === "signup" && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number (optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                autoComplete="off"
                disabled={loading}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Your 10-digit phone"
                maxLength={10}
                pattern="\d{10}"
              />
              <p className="mt-1 text-xs text-gray-500">
                Only numeric input allowed ({formData.phone.length}/10 digits)
              </p>
            </div>
          )}
          <div className="relative">
            <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              disabled={loading}
              onChange={handleChange}
              onFocus={() => mode === "signup" && setShowPasswordHints(true)}
              onBlur={() => mode === "signup" && setShowPasswordHints(false)}
              required
              minLength={8}
              maxLength={32}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder={mode === "login" ? "Enter your password" : "Create a strong password"}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute text-gray-400 right-4 top-9 hover:text-orange-400"
              onClick={() => setShowPassword(s => !s)}
              style={{ background: "none", border: "none" }}
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="w-6 h-6" />
              ) : (
                <Eye className="w-6 h-6" />
              )}
            </button>
            {mode === "signup" && (showPasswordHints || formData.password.length > 0) && (
              <div className="p-3 mt-2 space-y-1 border border-gray-200 rounded-lg bg-gray-50">
                <p className="mb-2 text-xs font-semibold text-gray-700">Password must contain:</p>
                <p className={`text-xs flex items-center gap-2 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                  <span>{passwordValidation.hasUpperCase ? '✓' : '○'}</span>
                  At least one capital letter (A-Z)
                </p>
                <p className={`text-xs flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                  <span>{passwordValidation.hasNumber ? '✓' : '○'}</span>
                  At least one number (0-9)
                </p>
                <p className={`text-xs flex items-center gap-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                  <span>{passwordValidation.hasSpecialChar ? '✓' : '○'}</span>
                  At least one special character (@$!%*?&)
                </p>
                <p className={`text-xs flex items-center gap-2 ${passwordValidation.isValidLength ? 'text-green-600' : 'text-gray-500'}`}>
                  <span>{passwordValidation.isValidLength ? '✓' : '○'}</span>
                  8-32 characters ({formData.password.length}/32)
                </p>
              </div>
            )}
          </div>
          {mode === "signup" && (
            <div className="relative">
              <label className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                autoComplete="new-password"
                disabled={loading}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={32}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute text-gray-400 right-4 top-9 hover:text-orange-400"
                onClick={() => setShowConfirmPassword(s => !s)}
                style={{ background: "none", border: "none" }}
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-6 h-6" />
                ) : (
                  <Eye className="w-6 h-6" />
                )}
              </button>
              {formData.confirmPassword.length > 0 && (
                <p className={`mt-1 text-xs flex items-center gap-1 ${
                  formData.password === formData.confirmPassword
                    ? 'text-green-600'
                    : 'text-red-500'
                }`}>
                  <span>{formData.password === formData.confirmPassword ? '✓' : '✗'}</span>
                  {formData.password === formData.confirmPassword
                    ? 'Passwords match'
                    : 'Passwords do not match'}
                </p>
              )}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || throttle}
            className="flex items-center justify-center w-full gap-2 py-3 font-semibold text-white transition-all duration-200 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader className="w-5 h-5 animate-spin" />}
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="font-semibold text-white underline hover:text-orange-900"
                disabled={loading}
                style={{ background: "none", border: "none", padding: "6px 4px", margin: 0 }}
              >
                Sign up here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-semibold text-white underline hover:text-orange-900"
                disabled={loading}
                style={{ background: "none", border: "none", padding: "6px 4px", margin: 0 }}
              >
                Log in here
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
