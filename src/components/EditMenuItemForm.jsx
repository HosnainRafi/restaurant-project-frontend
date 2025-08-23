import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { menuItemSchema } from '../schemas/menuItemSchema';
import { Switch } from '@headlessui/react';

const EditMenuItemForm = ({ item, categories, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: item.name,
      description: item.description,
      price: item.price,
      categoryId: item.categoryId,
      isAvailable: item.isAvailable,
    },
  });

  const isAvailable = watch('isAvailable');

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" mx-auto rounded-md p-3 space-y-3"
    >
      {/* Name */}
      <div className="flex flex-col">
        <label className="font-medium text-sm mb-1">Item Name</label>
        <input
          {...register('name')}
          className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-primary focus:outline-none"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Price */}
      <div className="flex flex-col">
        <label className="font-medium text-sm mb-1">Price (cents)</label>
        <input
          type="number"
        min={1}
          {...register('price')}
          className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-primary focus:outline-none"
        />
        {errors.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="font-medium text-sm mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-primary focus:outline-none resize-none"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="flex flex-col">
        <label className="font-medium text-sm mb-1">Category</label>
        <select
          {...register('categoryId')}
          className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-primary focus:outline-none"
        >
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="text-red-500 text-xs mt-1">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      {/* Availability */}
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">Available</span>
        <Switch
          checked={isAvailable}
          onChange={val => setValue('isAvailable', val)}
          className={`${
            isAvailable ? 'bg-primary' : 'bg-gray-300'
          } relative inline-flex h-5 w-10 items-center rounded-full transition-colors`}
        >
          <span
            className={`${
              isAvailable ? 'translate-x-5' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2 mt-2">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-800 py-1.5 px-6 rounded hover:bg-gray-300 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-white py-1.5 px-6 rounded hover:bg-primary-hover disabled:bg-gray-400 text-sm"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default EditMenuItemForm;
