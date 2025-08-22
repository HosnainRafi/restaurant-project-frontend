import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { dbUser, isLoading: isAuthLoading } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  // When the user data loads, populate the form
  useEffect(() => {
    if (dbUser) {
      setValue("email", dbUser.email);
      // You can add other fields like name, phone here if they exist on your User model
    }
  }, [dbUser, setValue]);

  const onSubmit = async (data) => {
    try {
      await api.put("/customer/my-profile", data);
      toast.success("Profile updated successfully!");
      // You might want to refresh the dbUser state in your AuthProvider here
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  if (isAuthLoading) return <p>Loading profile...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <div>
          <label className="font-semibold">Email Address</label>
          <input
            type="email"
            {...register("email")}
            disabled
            className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100"
          />
        </div>

        {/* Add other editable fields here, e.g., Name */}
        {/* <div>
          <label className="font-semibold">Full Name</label>
          <input 
            type="text" 
            {...register("name")}
            className="w-full border rounded-lg px-3 py-2 mt-1"
          />
        </div> */}

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
