import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { menuItemSchema } from '../../schemas/menuItemSchema';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiCamera, FiPlus } from 'react-icons/fi';

const AddMenuItem = () => {
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
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
      const [categoriesRes] = await Promise.all([api.get('/menu-categories')]);
      setCategories(categoriesRes.data.data || []);
    } catch (error) {
      toast.error(error?.message || 'Failed to fetch menu data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const uploadToImgbb = async file => {
    if (!file) return null;
    const API_KEY = import.meta.env.VITE_IMGBB_KEY;
    if (!API_KEY) throw new Error('Missing VITE_IMGBB_KEY');

    const form = new FormData();
    form.append('image', file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) throw new Error('Image upload failed');

    const json = await res.json();
    return json?.data?.url || json?.data?.display_url || null;
  };

  const onSubmit = async data => {
    try {
      let imageUrl = null;
      if (imageFile) {
        if (imageFile.size > 5 * 1024 * 1024) {
          toast.error('Max 5MB image size');
          return;
        }
        if (!/^image\//.test(imageFile.type)) {
          toast.error('Invalid file type');
          return;
        }
        const uploading = uploadToImgbb(imageFile);
        toast.promise(uploading, {
          loading: 'Uploading image...',
          success: 'Image uploaded!',
          error: 'Image upload failed.',
        });
        imageUrl = await uploading;
      }

      const payload = {
        ...data,
        ...(imageUrl ? { imageUrl } : {}),
      };

      const promise = api.post('/menu-items', payload);
      toast.promise(promise, {
        loading: 'Adding new item...',
        success: 'Menu item added successfully!',
        error: 'Failed to add item.',
      });

      await promise;
      reset();
      setImageFile(null);
      navigate('/admin/menu-management');
    } catch (error) {
      toast.error(error?.message || 'Failed to add item.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-md shadow border border-gray-100">
        {/* Header */}
        <div className="bg-primary px-6 py-4 text-center rounded-t-md flex items-center justify-center gap-2">
          <FiPlus className="text-white text-lg" />
          <h2 className="text-xl font-semibold text-white">
            Add New Menu Item
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          {/* Item Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Item Name
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g., Grilled Chicken Salad"
            />
            {errors?.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name?.message}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Price (in cents)
            </label>
            <input
              type="number"
              min="1"
              step="1"
              {...register('price', { valueAsNumber: true })}
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g., 1599 for $15.99"
            />
            {errors?.price && (
              <p className="text-red-500 text-xs mt-1">
                {errors.price?.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Category</label>
            <select
              {...register('categoryId')}
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors?.categoryId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.categoryId?.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Image</label>
            <label className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition w-full">
              <input
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                <FiCamera /> Upload Image
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Max 5MB (JPG/PNG only)
              </p>
            </label>

            {imageFile && (
              <div className="mt-3 relative">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  className="h-36 w-full object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="absolute top-2 right-2 bg-white/80 p-1 rounded-full shadow hover:bg-white transition"
                >
                  <FiTrash2 className="text-red-500" />
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Write a short description..."
            />
            {errors?.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description?.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-2.5 rounded-md font-medium hover:bg-primary/90 transition disabled:bg-gray-400"
            >
              {isSubmitting ? 'Adding...' : 'Add Menu Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;
