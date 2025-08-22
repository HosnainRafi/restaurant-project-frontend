import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { menuItemSchema } from '../../schemas/menuItemSchema';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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

      const createdRes = await promise;
      console.log('Created:', createdRes.data.data);
      reset();
      setImageFile(null);
      navigate('/admin/menu-management');
    } catch (error) {
      toast.error(error?.message || 'Failed to add item.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 md:py-12 space-y-12">
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
              {...register('name')}
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
              {...register('price', { valueAsNumber: true })}
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
              {...register('description')}
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
              {...register('categoryId')}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
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
              onChange={e => setImageFile(e.target.files?.[0] || null)}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition disabled:bg-gray-400"
          >
            {isSubmitting ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMenuItem;
