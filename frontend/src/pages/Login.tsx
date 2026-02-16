import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import type { LoginCredentials } from "../types";

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await login(data);
      setAuth(response.user, response.token);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Login failed. Please try again.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-linear-to-br flex min-h-screen items-center justify-center from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl bg-surface-card/95 p-8 shadow-soft backdrop-blur-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
              <span className="text-2xl font-bold text-accent">X</span>
            </div>
            <h1 className="text-2xl font-bold text-content">Welcome back</h1>
            <p className="mt-2 text-content-secondary">Sign in to continue to Project X</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-content">Email</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full rounded-xl border-2 bg-surface px-4 py-3 transition-all focus:outline-none focus:ring-0 ${
                  errors.email ? "border-danger focus:border-danger" : "border-transparent focus:border-accent"
                }`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-2 text-sm text-danger">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-content">Password</label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full rounded-xl border-2 bg-surface px-4 py-3 transition-all focus:outline-none focus:ring-0 ${
                  errors.password ? "border-danger focus:border-danger" : "border-transparent focus:border-accent"
                }`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-2 text-sm text-danger">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-accent py-3.5 font-semibold text-white shadow-soft transition-all duration-200 hover:bg-accent-hover hover:shadow-card-hover active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-content-secondary">
            Don't have an account?{" "}
            <Link to="/registration" className="font-medium text-accent hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
