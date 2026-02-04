import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Layout from "../../components/Layout";

/**
 * Login/Register - Premium minimal auth layout
 * Single UI for admin & user, role-based redirect
 */
export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pwd) => pwd.length >= 6;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    if (!isLogin) {
      if (!formData.name?.trim()) newErrors.name = "Name is required";
      if (formData.password && !validatePassword(formData.password))
        newErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isLogin) {
      const result = login(formData.email, formData.password);
      if (result.success) {
        addToast("Login successful!");
        navigate(result.role === "admin" ? "/admin" : from, { replace: true });
      } else {
        addToast(result.error || "Login failed", "error");
        setErrors({ password: result.error });
      }
    } else {
      const result = register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );
      if (result.success) {
        addToast("Registration successful!");
        navigate(from, { replace: true });
      } else {
        addToast(result.error || "Registration failed", "error");
        setErrors({ email: result.error });
      }
    }
  };

  const inputClass = (hasError) =>
    `w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background ${hasError ? "border-danger" : "border-border"
    }`;

  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-gradient-card rounded-2xl shadow-soft border border-border/60 p-8">
            <h2 className="font-serif text-2xl font-semibold text-textDark text-center mb-6">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <div className="h-px w-12 bg-gold mx-auto mb-8" />

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass(!!errors.name)}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-danger text-sm mt-1">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-textDark mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass(!!errors.email)}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-danger text-sm mt-1">{errors.email}</p>}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Phone (optional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass(false)}
                    placeholder="9876543210"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-textDark mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass(!!errors.password)}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-danger text-sm mt-1">{errors.password}</p>}
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-textDark mb-1">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={inputClass(!!errors.confirmPassword)}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="text-danger text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all duration-300 active:scale-[0.99]"
              >
                {isLogin ? "Login" : "Register"}
              </button>
            </form>

            <p className="mt-6 text-center text-muted text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-primary font-medium hover:underline"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>

            <p className="mt-4 text-center text-xs text-muted">
              Admin: admin@shop.com / Admin@123
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
