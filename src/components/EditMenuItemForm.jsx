import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { menuItemSchema } from "../schemas/menuItemSchema";

const EditMenuItemForm = ({ item, categories, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(menuItemSchema),
    // Pre-fill the form with the item's existing data
    defaultValues: {
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
      isAvailable: item.isAvailable,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label htmlFor="edit-name" className="block font-medium mb-1">
            Item Name
          </label>
          <input
            type="text"
            id="edit-name"
            {...register("name")}
            className="w-full border rounded px-3 py-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="edit-price" className="block font-medium mb-1">
            Price (in cents)
          </label>
          <input
            type="number"
            id="edit-price"
            {...register("price")}
            className="w-full border rounded px-3 py-2"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="edit-description" className="block font-medium mb-1">
            Description
          </label>
          <textarea
            id="edit-description"
            {...register("description")}
            className="w-full border rounded px-3 py-2"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="edit-categoryId" className="block font-medium mb-1">
            Category
          </label>
          <select
            id="edit-categoryId"
            {...register("categoryId")}
            className="w-full border rounded px-3 py-2"
          >
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

        {/* Availability */}
        <div className="flex items-center self-end">
          <input
            type="checkbox"
            id="edit-isAvailable"
            {...register("isAvailable")}
            className="mr-2"
          />
          <label htmlFor="edit-isAvailable">Available for ordering</label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default EditMenuItemForm;
