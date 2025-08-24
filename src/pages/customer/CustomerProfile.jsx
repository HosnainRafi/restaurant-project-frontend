import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { ImSpinner3 } from "react-icons/im";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const CustomerProfile = () => {
  const { user, refetchUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    const promise = api.put("/users/me", data);

    toast.promise(promise, {
      loading: "Updating profile...",
      success: "Profile updated successfully!",
      error: "Failed to update profile.",
    });

    try {
      await promise;
      refetchUser();
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <ImSpinner3 className="animate-spin text-primary text-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 flex justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">
          My Profile
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              {...register("name")}
              placeholder="Your full name"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
            {errors.name && (
              <span className="text-red-500 text-sm mt-1">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              disabled
              className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed outline-none"
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>
            )}
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Phone Number</label>
            <input
              type="text"
              {...register("phone")}
              placeholder="e.g. +880 1XXXXXXXXX"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Address</label>
            <textarea
              {...register("address")}
              rows={3}
              placeholder="Your delivery address"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-primary text-white py-2.5 rounded-lg hover:bg-primary/90 transition flex justify-center items-center ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <ImSpinner3 className="animate-spin h-5 w-5" />
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfile;
