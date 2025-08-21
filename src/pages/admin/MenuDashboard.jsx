import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { menuItemSchema } from "../../schemas/menuItemSchema";
import api from "../../lib/api";
import toast from "react-hot-toast";
import Modal from "../../components/Modal";
import EditMenuItemForm from "../../components/EditMenuItemForm";

const MenuDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(menuItemSchema),
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [itemsRes, categoriesRes] = await Promise.all([
        api.get("/menu-items"),
        api.get("/menu-categories"),
      ]);
      setMenuItems(itemsRes.data.data);
      setCategories(categoriesRes.data.data);
    } catch (error) {
      toast.error("Failed to fetch menu data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      const promise = api.post("/menu-items", data);
      toast.promise(promise, {
        loading: "Adding new item...",
        success: "Menu item added successfully!",
        error: "Failed to add item.",
      });
      await promise;
      reset();
      fetchData();
    } catch (error) {
      console.error("Failed to add menu item:", error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }
    const promise = api.delete(`/menu-items/${itemId}`);
    toast.promise(promise, {
      loading: "Deleting item...",
      success: "Item deleted successfully!",
      error: "Failed to delete item.",
    });
    try {
      await promise;
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (data) => {
    if (!selectedItem) return;
    const promise = api.patch(`/menu-items/${selectedItem._id}`, data);
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
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "N/A";
  };

  return (
    <div>
      {/* Add New Item Form */}
      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add New Menu Item</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Item Name
            </label>
            <input
              type="text"
              id="name"
              {...register("name")}
              className="w-full border rounded px-3 py-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="price" className="block font-medium mb-1">
              Price (in cents)
            </label>
            <input
              type="number"
              id="price"
              {...register("price")}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., 1599 for $15.99"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              {...register("description")}
              className="w-full border rounded px-3 py-2"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="categoryId" className="block font-medium mb-1">
              Category
            </label>
            <select
              id="categoryId"
              {...register("categoryId")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.categoryId.message}
              </p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Availability</label>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="isAvailable"
                {...register("isAvailable")}
                defaultChecked
              />
              <label htmlFor="isAvailable">Available for ordering</label>
            </div>
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Menu Items List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Existing Menu Items</h2>
        {isLoading ? (
          <p>Loading items...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b bg-gray-100">
                <tr>
                  <th className="px-4 py-2 font-semibold">Name</th>
                  <th className="px-4 py-2 font-semibold">Category</th>
                  <th className="px-4 py-2 font-semibold">Price</th>
                  <th className="px-4 py-2 font-semibold">Available</th>
                  <th className="px-4 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{item.name}</td>
                    <td className="px-4 py-2">
                      {getCategoryName(item.categoryId)}
                    </td>
                    <td className="px-4 py-2">
                      ${(item.price / 100).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.isAvailable
                            ? "bg-green-200 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {item.isAvailable ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <span className="mx-2">|</span>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
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
