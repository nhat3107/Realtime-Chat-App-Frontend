import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const validate = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validate();
    if (success) {
      try {
        const success = await login(formData);
        if (success) {
          toast.success("Logged in successfully!");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to login");
        console.error("Error during login:", error);
      }
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr,1fr]">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-base-200 border-r border-base-content/10">
        <div className="w-full max-w-lg space-y-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center 
                group-hover:bg-primary/20 transition-all duration-300 hover:scale-110"
              >
                <User className="size-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold mt-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-base-content/60 text-base">
                Sign in to continue your journey
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full focus:input-primary transition-colors"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            {/* Password Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full focus:input-primary transition-colors"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full h-12 text-base font-medium hover:scale-[1.02] transition-transform"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-base-content/60">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="link link-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Modern Design */}
      <div className="hidden lg:block bg-gradient-to-br from-primary/10 via-base-300 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Animated background shapes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg relative">
            {/* Main content */}
            <div className="text-center space-y-8">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <div className="relative bg-base-100/90 backdrop-blur-sm p-10 rounded-lg border border-base-content/10 shadow-lg">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                    Welcome Back!
                  </h2>
                  <p className="text-base-content/80 text-lg mb-8">
                    We're excited to have you back. Sign in to continue your
                    journey with us.
                  </p>

                  {/* Feature cards */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-base-100/80 backdrop-blur-sm p-6 rounded-lg border border-base-content/5 hover:border-primary/20 transition-colors duration-300 shadow-sm">
                      <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          className="size-6 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-xl mb-2">
                        Quick Access
                      </h3>
                      <p className="text-base-content/70">
                        Get back to your projects instantly
                      </p>
                    </div>

                    <div className="bg-base-100/80 backdrop-blur-sm p-6 rounded-lg border border-base-content/5 hover:border-primary/20 transition-colors duration-300 shadow-sm">
                      <div className="size-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          className="size-6 text-secondary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-xl mb-2">Secure</h3>
                      <p className="text-base-content/70">
                        Your data is always protected
                      </p>
                    </div>

                    <div className="bg-base-100/80 backdrop-blur-sm p-6 rounded-lg border border-base-content/5 hover:border-primary/20 transition-colors duration-300 shadow-sm">
                      <div className="size-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          className="size-6 text-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-xl mb-2">Fast</h3>
                      <p className="text-base-content/70">
                        Lightning quick access
                      </p>
                    </div>

                    <div className="bg-base-100/80 backdrop-blur-sm p-6 rounded-lg border border-base-content/5 hover:border-primary/20 transition-colors duration-300 shadow-sm">
                      <div className="size-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                        <svg
                          className="size-6 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-xl mb-2">Sync</h3>
                      <p className="text-base-content/70">
                        Everything stays in sync
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
