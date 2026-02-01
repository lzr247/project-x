import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegistrationPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch("password");

  const onSubmit = async (data: RegisterForm) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(response.user, response.token);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Registration failed.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-soft p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
              <span className="text-2xl font-bold text-accent">X</span>
            </div>
            <h1 className="text-2xl font-bold text-content">Create account</h1>
            <p className="text-content-secondary mt-2">
              Start your productivity journey
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-content mb-2">
                Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-surface transition-all
                  focus:outline-none focus:ring-0
                  ${errors.name ? "border-danger" : "border-transparent focus:border-accent"}`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-danger">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-content mb-2">
                Email
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email",
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-surface transition-all
                  focus:outline-none focus:ring-0
                  ${errors.email ? "border-danger" : "border-transparent focus:border-accent"}`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-danger">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-content mb-2">
                Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-surface transition-all
                  focus:outline-none focus:ring-0
                  ${errors.password ? "border-danger" : "border-transparent focus:border-accent"}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-2 text-sm text-danger">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-content mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (v) => v === password || "Passwords don't match",
                })}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-surface transition-all
                  focus:outline-none focus:ring-0
                  ${errors.confirmPassword ? "border-danger" : "border-transparent focus:border-accent"}`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-danger">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-accent text-white font-semibold rounded-xl
                hover:bg-accent-hover active:scale-[0.98] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-card-hover mt-2"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-content-secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
