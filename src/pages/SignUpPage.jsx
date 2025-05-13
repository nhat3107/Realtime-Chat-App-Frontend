import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: "",
    dateOfBirth: "",
    imageUrl: "",
  });
  const { signup, isSigningUp, authUser } = useAuthStore();

  const validate = () => {
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 8)
      return toast.error("Password must be at least 8 characters");
    if (!formData.confirmPassword)
      return toast.error("Confirm password is required");
    if (formData.confirmPassword !== formData.password)
      return toast.error("Passwords do not match");
    if (!formData.firstName.trim())
      return toast.error("First name is required");
    if (!formData.lastName.trim()) return toast.error("Last name is required");
    if (!formData.phoneNumber.trim())
      return toast.error("Phone number is required");
    if (!formData.gender.trim()) return toast.error("Gender is required");
    if (!formData.dateOfBirth.trim())
      return toast.error("Date of birth is required");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = validate();
    if (success) {
      try {
        // Create signup data
        const signupData = {
          email: formData.email,
          password: formData.password,
          username: formData.username,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          imageUrl: "",
        };

        const success = await signup(signupData);

        if (success) {
          toast.success("Account created successfully!");
        }
      } catch (error) {
        console.error("Error during signup:", error);
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
                Create Account
              </h1>
              <p className="text-base-content/60 text-base">
                Join our community and start your journey
              </p>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">First Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:input-primary transition-colors"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Last Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full focus:input-primary transition-colors"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>

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

            {/* Username Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full focus:input-primary transition-colors"
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            {/* Phone Number */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Phone Number</span>
              </label>
              <input
                type="tel"
                className="input input-bordered w-full focus:input-primary transition-colors"
                placeholder="+1 (555) 000-0000"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
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

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">
                    Confirm Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="input input-bordered w-full focus:input-primary transition-colors"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-5" />
                    ) : (
                      <Eye className="size-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Gender</span>
                </label>
                <select
                  className="select select-bordered w-full focus:select-primary transition-colors"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Date of Birth</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full focus:input-primary transition-colors"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    setFormData({ ...formData, dateOfBirth: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary w-full h-12 text-base font-medium hover:scale-[1.02] transition-transform"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link
                to="/login"
                className="link link-primary font-medium hover:underline"
              >
                Sign in
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
                    Welcome to Our Platform
                  </h2>
                  <p className="text-base-content/80 text-lg mb-8">
                    Join our growing community and start your journey today
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-xl mb-2">Connect</h3>
                      <p className="text-base-content/70">
                        Connect with friends and family
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
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-xl mb-2">Share</h3>
                      <p className="text-base-content/70">Share your moments</p>
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
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-xl mb-2">Discover</h3>
                      <p className="text-base-content/70">Find new content</p>
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
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          />
                        </svg>
                      </div>
                      <h3 className="font-semibold text-xl mb-2">Grow</h3>
                      <p className="text-base-content/70">Build your network</p>
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

export default SignUpPage;
