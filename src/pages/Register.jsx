import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password);
      toast.success("Registration successful!");
      navigate("/"); // Redirect, AuthContext will handle the session
    } catch (error) {
      toast.error(
        "Registration failed. This email may already be in use.",
        error
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 border rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Email Address</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label>Password (6+ characters)</label>
          <input
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            {...register("confirmPassword", { required: true })}
            className="input input-bordered w-full"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn btn-primary"
        >
          {isSubmitting ? "Registering..." : "Create Account"}
        </button>
      </form>
      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-primary">
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Register;
