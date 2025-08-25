import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { ImSpinner3 } from "react-icons/im";
import { PlusCircle, Trash2 } from "lucide-react";

const CustomerProfile = () => {
  const { dbUser, loading: authLoading, refetchUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      photoURL: "",
      addresses: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const photoURL = watch("photoURL");

  // Load user data into the form when the component mounts
  useEffect(() => {
    if (dbUser) {
      reset({
        name: dbUser.name || "",
        email: dbUser.email || "",
        photoURL: dbUser.photoURL || "",
        addresses: dbUser.addresses?.length
          ? dbUser.addresses
          : [{ label: "Primary", details: "" }],
      });
    }
  }, [dbUser, reset]);

  // --- START: THE CLOUDINARY FIX ---
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    ); // Use your preset name

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.secure_url) {
        setValue("photoURL", data.secure_url, { shouldDirty: true });
        toast.success("Image uploaded!");
      } else {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  // --- END: THE CLOUDINARY FIX ---

  const onSubmit = async (data) => {
    try {
      await api.patch("/auth/me", data);
      toast.success("Profile updated successfully!");
      refetchUser(); // Refresh auth context with new data
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  if (authLoading) {
    return <div className="text-center p-20">Loading profile...</div>;
  }

  return (
    <div className="pt-28 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-primary mb-6">My Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={photoURL || "/default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-primary"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                  <ImSpinner3 className="animate-spin text-white text-2xl" />
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="photo-upload"
                className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover transition"
              >
                Upload New Picture
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <p className="text-sm text-gray-500 mt-2">
                PNG, JPG, GIF up to 10MB.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Full Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              className="form-input"
            />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Email
            </label>
            <input
              {...register("email")}
              disabled
              className="form-input bg-gray-100"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              My Addresses
            </h3>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-start gap-4 p-4 border rounded-md"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      {...register(`addresses.${index}.label`)}
                      placeholder="Label (e.g., Home)"
                      className="form-input md:col-span-1"
                    />
                    <input
                      {...register(`addresses.${index}.details`)}
                      placeholder="Full Address Details"
                      className="form-input md:col-span-2"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ label: "", details: "" })}
                className="flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <PlusCircle size={18} /> Add New Address
              </button>
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="w-full md:w-auto flex justify-center items-center gap-2 bg-gradient-to-r from-primary to-primary-hover text-white py-2.5 px-6 rounded-md shadow-lg hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting && <ImSpinner3 className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfile;
