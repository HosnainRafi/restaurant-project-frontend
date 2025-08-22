import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { menuItemSchema } from "../../schemas/menuItemSchema";
import api from "../../lib/api";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import EditMenuItemForm from "../../components/EditMenuItemForm";
import { FaEdit, FaTrash, FaStar, FaUtensils, FaBolt } from "react-icons/fa";

const MenuDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Image file for create flow
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      isAvailable: true,
      isFeatured: false,
      isChefsRecommendation: false,
      isTodaysSpecial: false,
    },
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [itemsRes, categoriesRes] = await Promise.all([
        api.get("/menu-items"),
        api.get("/menu-categories"),
      ]);
      setMenuItems(itemsRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch menu data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Upload image to imgbb and return URL
  const uploadToImgbb = async (file) => {
    if (!file) return null;
    const API_KEY = import.meta.env.VITE_IMGBB_KEY;
    if (!API_KEY) throw new Error("Missing VITE_IMGBB_KEY");

    const form = new FormData();
    // imgbb accepts file blobs directly under 'image'
    form.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) throw new Error("Image upload failed");

    const json = await res.json();
    // Prefer data.url; fallback to display_url
    return json?.data?.url || json?.data?.display_url || null;
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = null;

      // Optional validations
      if (imageFile) {
        if (imageFile.size > 5 * 1024 * 1024) {
          toast.error("Max 5MB image size");
          return;
        }
        if (!/^image\//.test(imageFile.type)) {
          toast.error("Invalid file type");
          return;
        }

        const uploading = uploadToImgbb(imageFile);
        toast.promise(uploading, {
          loading: "Uploading image...",
          success: "Image uploaded!",
          error: "Image upload failed.",
        });
        imageUrl = await uploading;
      }

      const payload = {
        ...data,
        ...(imageUrl ? { imageUrl } : {}),
      };

      const promise = api.post("/menu-items", payload);
      toast.promise(promise, {
        loading: "Adding new item...",
        success: "Menu item added successfully!",
        error: "Failed to add item.",
      });

      const createdRes = await promise;

      // Optimistic prepend then sync
      setMenuItems((prev) => [createdRes.data.data, ...prev]);
      reset();
      setImageFile(null);
      fetchData();
    } catch (error) {
      // toast already handled via promise
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const promise = api.delete(`/menu-items/${itemId}`);
    toast.promise(promise, {
      loading: "Deleting item...",
      success: "Item deleted successfully!",
      error: "Failed to delete item.",
    });
    try {
      await promise;
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch {
      // toast already handled
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  // If you want to support replacing the image in the edit modal:
  // - Add a file input in EditMenuItemForm (e.g., name="imageFile")
  // - Pass back a File in data.imageFile if selected
  const handleEditSubmit = async (data) => {
    if (!selectedItem) return;

    // Example pattern to support optional new image in edit form:
    // let newImageUrl = null;
    // if (data?.imageFile instanceof File) {
    //   const uploading = uploadToImgbb(data.imageFile);
    //   toast.promise(uploading, {
    //     loading: "Uploading image...",
    //     success: "Image uploaded!",
    //     error: "Image upload failed.",
    //   });
    //   newImageUrl = await uploading;
    // }

    const payload = {
      ...data,
      // imageUrl: newImageUrl ?? data.imageUrl, // keep existing if none uploaded
    };

    const promise = api.patch(`/menu-items/${selectedItem._id}`, payload);
    toast.promise(promise, {
      loading: "Updating item...",
      success: "Item updated successfully!",
      error: "Failed to update item.",
    });
    try {
      const response = await promise;
      setMenuItems((prev) =>
        prev.map((item) =>
          item._id === selectedItem._id ? response.data.data : item
        )
      );
      setIsEditModalOpen(false);
      setSelectedItem(null);
    } catch {
      // toast already handled
    }
  };

  // Inline toggle helper for table checkboxes
  const toggleFlag = async (id, field, value) => {
    const promise = api.patch(`/menu-items/${id}`, { [field]: value });
    toast.promise(promise, {
      loading: "Updating...",
      success: "Updated!",
      error: "Failed to update.",
    });
    try {
      const res = await promise;
      setMenuItems((prev) =>
        prev.map((i) => (i._id === id ? res.data.data : i))
      );
    } catch {
      // toast already handled
    }
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return "N/A";
    // Support populated object or raw string id
    if (typeof categoryId === "object" && categoryId?.name)
      return categoryId.name;
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "N/A";
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 space-y-12">
      {/* Add New Menu Item Form */}
      <div className="bg-white rounded-lg shadow p-6 md:p-8 max-w-xl mx-auto">
        <h2 className="text-xl font-bold text-primary mb-6 text-center">
          Add New Menu Item
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4"
        >
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Item Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors?.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Price (in cents)
            </label>
            <input
              type="number"
              {...register("price", { valueAsNumber: true })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g., 1599 for $15.99"
            />
            {errors?.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors?.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Category
            </label>
            <select
              {...register("categoryId")}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors?.categoryId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoryId?.message}
              </p>
            )}
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">Max ~5MB. JPG/PNG.</p>
            {imageFile && (
              <div className="mt-2">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  className="h-24 w-24 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAvailable"
              {...register("isAvailable")}
              defaultChecked
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="isAvailable" className="text-gray-700">
              Available for ordering
            </label>
          </div>

          {/* New Flag Checkboxes */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isFeatured"
              {...register("isFeatured")}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="isFeatured">Featured</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isChefsRecommendation"
              {...register("isChefsRecommendation")}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="isChefsRecommendation">
              Chef&apos;s Recommendation
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isTodaysSpecial"
              {...register("isTodaysSpecial")}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <label htmlFor="isTodaysSpecial">Today&apos;s Special</label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition disabled:bg-gray-400"
          >
            {isSubmitting ? "Adding..." : "Add Item"}
          </button>
        </form>
      </div>

      {/* Existing Menu Items */}
      <div className="bg-white rounded-lg shadow p-6 md:p-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-primary">
            Existing Menu Items
          </h2>
          {/* Legend */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FaStar className="text-yellow-500" /> Featured
            </span>
            <span className="flex items-center gap-1">
              <FaUtensils className="text-emerald-600" /> Chef&apos;s
              Recommendation
            </span>
            <span className="flex items-center gap-1">
              <FaBolt className="text-pink-600" /> Today&apos;s Special
            </span>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading items...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                    Available
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                    Badges
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                    Flags
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {menuItems.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 text-gray-800 font-medium">
                      {item.name}
                    </td>
                    <td className="px-4 py-2 text-gray-600">
                      {getCategoryName(item.categoryId)}
                    </td>
                    <td className="px-4 py-2 text-gray-800 font-semibold">
                      ${(item.price / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {item.isAvailable ? "Yes" : "No"}
                      </span>
                    </td>
                    {/* Badges with icons */}
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {item.isFeatured && (
                          <span title="Featured" className="text-yellow-500">
                            <FaStar />
                          </span>
                        )}
                        {item.isChefsRecommendation && (
                          <span
                            title="Chef's Recommendation"
                            className="text-emerald-600"
                          >
                            <FaUtensils />
                          </span>
                        )}
                        {item.isTodaysSpecial && (
                          <span
                            title="Today's Special"
                            className="text-pink-600"
                          >
                            <FaBolt />
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Inline flag toggles */}
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-4">
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={!!item.isFeatured}
                            onChange={(e) =>
                              toggleFlag(
                                item._id,
                                "isFeatured",
                                e.target.checked
                              )
                            }
                          />
                          Featured
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={!!item.isChefsRecommendation}
                            onChange={(e) =>
                              toggleFlag(
                                item._id,
                                "isChefsRecommendation",
                                e.target.checked
                              )
                            }
                          />
                          Chef
                        </label>
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={!!item.isTodaysSpecial}
                            onChange={(e) =>
                              toggleFlag(
                                item._id,
                                "isTodaysSpecial",
                                e.target.checked
                              )
                            }
                          />
                          Today
                        </label>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item._id)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Menu Item"
      >
        {selectedItem && (
          <EditMenuItemForm
            item={selectedItem}
            categories={categories}
            onSubmit={handleEditSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default MenuDashboard;
