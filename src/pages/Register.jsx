import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { ImSpinner3 } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";
import api from "@/lib/api"; // 👈 Import your API utility

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Reusable function to sync the user with your backend
  const syncUserWithBackend = async (firebaseUser) => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken(true);
      await api.post(
        "/auth/sync",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Profile synced successfully!");
    } catch (error) {
      console.error("Backend sync failed:", error);
      toast.error("Could not sync your profile. Please try logging in again.");
      // Even if sync fails, the user is logged in, so we still redirect
    } finally {
      navigate("/");
    }
  };

  // Handler for email/password registration
  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      toast.success("Registration successful! Syncing profile...");
      await syncUserWithBackend(userCredential.user);
    } catch (error) {
      const errorMessage =
        error.code === "auth/email-already-in-use"
          ? "This email is already registered."
          : "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  // Handler for Google sign-in
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success("Google login successful! Syncing profile...");
      await syncUserWithBackend(result.user);
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error("Google login failed. Please try again.");
    }
  };

  return (
    <div className="pt-28 pb-12 flex items-center justify-center bg-gradient-to-br from-[#F9F9F6] to-[#FFF7F2] px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-primary mb-2">
          Create Account
        </h2>
        <p className="text-center text-text-secondary mb-6">
          Join us and enjoy premium dining experiences
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Password (6+ characters)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-primary to-primary-hover text-white py-2.5 rounded-md shadow-lg hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting && <ImSpinner3 className="animate-spin text-white" />}
            {isSubmitting ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-gray-300 flex-1"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px bg-gray-300 flex-1"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-2.5 shadow-sm hover:bg-gray-50 transition"
        >
          <FcGoogle size={20} />
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>

        <p className="text-center mt-6 text-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
