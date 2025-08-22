import { useForm } from 'react-hook-form';
import { FaPlusCircle, FaCamera } from 'react-icons/fa';

const AddFoodCategory = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = data => {
    console.log('Food Category Data:', data);
    reset();
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
              {...register('categoryName', { required: true })}
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
              {...register('description', { required: true })}
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
              onClick={() => document.getElementById('imageUpload').click()}
            >
              <FaCamera className="text-3xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 font-medium">
                Click to upload category image
              </p>
              <input
                type="file"
                {...register('image', { required: true })}
                className="hidden"
                id="imageUpload"
              />
            </div>
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">Image is required</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition"
          >
            <FaPlusCircle />
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFoodCategory;
