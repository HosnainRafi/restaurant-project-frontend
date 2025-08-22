import { useForm } from "react-hook-form";
import { FaPlusCircle, FaCamera } from "react-icons/fa";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useState } from "react";

const AddFoodCategory = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // NEW: source of truth

  const uploadToImgbb = async (file) => {
    const API_KEY = import.meta.env.VITE_IMGBB_KEY;
    if (!API_KEY) throw new Error("Missing VITE_IMGBB_KEY");

    const form = new FormData();
    form.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error("Image upload failed");

    const json = await res.json();
    return json?.data?.url || json?.data?.display_url || null;
  };

  const onSubmit = async (data) => {
    try {
      const name = data?.categoryName?.trim();
      const description = data?.description?.trim();

      // Validate using selectedFile instead of data.image
      if (!selectedFile) {
        toast.error("Please select an image");
        return;
      }

      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Max 5MB image size");
        return;
      }
      if (!/^image\//.test(selectedFile.type)) {
        toast.error("Invalid file type");
        return;
      }

      // 1) Upload image to imgbb
      const uploading = uploadToImgbb(selectedFile);
      toast.promise(uploading, {
        loading: "Uploading image...",
        success: "Image uploaded!",
        error: "Image upload failed.",
      });
      const imageUrl = await uploading;

      // 2) Create category with imageUrl
      const payload = {
        name,
        description,
        imageUrl,
      };

      const creating = api.post("/menu-categories", payload);
      toast.promise(creating, {
        loading: "Creating category...",
        success: "Category created!",
        error: "Failed to create category.",
      });
      await creating;

      // 3) Reset
      reset();
      setPreviewUrl(null);
      setSelectedFile(null);
      // If this page lists categories elsewhere, refetch there
    } catch (e) {
      console.error(e);
    }
  };

  const openFilePicker = () => {
    document.getElementById("imageUpload")?.click();
  };

  const onImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file); // keep file in state (source of truth)

    if (!file) {
      setPreviewUrl(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max 5MB image size");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    if (!/^image\//.test(file.type)) {
      toast.error("Invalid file type");
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center mb-6">
          <FaPlusCircle className="inline mr-2" />
          Add Food Category
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              type="text"
              {...register("categoryName", { required: true })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="e.g. Desserts, Beverages"
            />
            {errors.categoryName && (
              <p className="text-red-500 text-sm mt-1">
                Category name is required
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description", { required: true })}
              rows="3"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Write a short description about this category"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                Description is required
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>

            <div
              className="border-2 border-dashed border-gray-300 rounded-md h-32 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition"
              onClick={openFilePicker}
            >
              <FaCamera className="text-3xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 font-medium">
                Click to upload category image
              </p>

              <input
                type="file"
                // Do NOT mark required here to avoid RHF blocking submit incorrectly
                {...register("image")}
                className="hidden"
                id="imageUpload"
                accept="image/*"
                onChange={onImageChange}
              />
            </div>

            {previewUrl && (
              <div className="mt-3">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="h-24 w-24 object-cover rounded-md border"
                />
              </div>
            )}

            {/* Show custom validation error if no file selected */}
            {!selectedFile && (
              <p className="text-xs text-gray-500 mt-1">
                JPG/PNG, up to ~5MB. We’ll upload to imgbb and store the link.
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:bg-gray-400"
          >
            <FaPlusCircle />
            {isSubmitting ? "Adding..." : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFoodCategory;
