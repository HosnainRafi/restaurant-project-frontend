import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth"; // 1. Import the useAuth hook
import api from "@/lib/api";
import { ImSpinner3 } from "react-icons/im";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// 2. Add a simple validation schema
const profileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const CustomerProfile = () => {
  const { user, refetchUser } = useAuth(); // Get the user and a function to refetch their data

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  // 3. Use useEffect to pre-fill the form with the user's data
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

  // 4. Update the onSubmit handler to call the API
  const onSubmit = async (data) => {
    const promise = api.put("/users/me", data); // Use the consolidated user endpoint

    toast.promise(promise, {
      loading: "Updating profile...",
      success: "Profile updated successfully!",
      error: "Failed to update profile.",
    });

    try {
      await promise;
      refetchUser(); // Refetch user data to update the context
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
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">
          My Profile
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              disabled // Email should not be changed
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              {...register("phone")}
              placeholder="e.g. +880 1XXXXXXXXX"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              {...register("address")}
              rows={3}
              placeholder="Your delivery address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-primary text-white py-2.5 rounded-md shadow-lg hover:bg-primary/90 transition flex items-center justify-center ${
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
