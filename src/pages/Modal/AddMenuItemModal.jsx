import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { menuItemSchema } from '../../schemas/menuItemSchema';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { FiTrash2, FiCamera, FiPlus } from 'react-icons/fi';

const AddMenuItemModal = ({ isOpen, onClose, onSuccess }) => {
  const [imageFile, setImageFile] = useState(null);
  const [categories, setCategories] = useState([]);

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
    if (isOpen) fetchData();
  }, [isOpen]);

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

      const payload = { ...data, ...(imageUrl ? { imageUrl } : {}) };
      const promise = api.post('/menu-items', payload);
      toast.promise(promise, {
        loading: 'Adding new item...',
        success: 'Menu item added successfully!',
        error: 'Failed to add item.',
      });

      await promise;
      reset();
      setImageFile(null);
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error?.message || 'Failed to add item.');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-50"
          leave="ease-in duration-200"
          leaveFrom="opacity-50"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-sm bg-black opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-xl w-full max-w-xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="bg-primary px-4 py-3 flex items-center justify-between">
                <p></p>
                <div className="flex items-center gap-2">
                  <Dialog.Title className="text-lg font-semibold text-white">
                    Add Menu Item
                  </Dialog.Title>
                </div>
                <button
                  onClick={onClose}
                  className="text-white text-lg hover:text-gray-200 transition"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3 p-4 sm:p-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      {...register('name')}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-transparent transition"
                      placeholder="Grilled Chicken"
                    />
                    {errors?.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name?.message}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Price (cents)
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      {...register('price', { valueAsNumber: true })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-transparent transition"
                      placeholder="1599"
                    />
                    {errors?.price && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.price?.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      {...register('categoryId')}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-transparent transition"
                    >
                      <option value="">Select category</option>
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

                  {/* Image */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Image
                    </label>
                    <label className="border-2 border-dashed border-gray-300 rounded-md p-3 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:shadow transition w-full">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e =>
                          setImageFile(e.target.files?.[0] || null)
                        }
                        className="hidden"
                      />
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <FiCamera /> Upload
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Max 5MB (JPG/PNG)
                      </p>
                    </label>

                    {imageFile && (
                      <div className="mt-2 relative rounded-md overflow-hidden border shadow-sm h-28">
                        <img
                          src={URL.createObjectURL(imageFile)}
                          alt="preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImageFile(null)}
                          className="absolute top-1 right-1 bg-white/90 p-1 rounded-full shadow hover:bg-white transition"
                        >
                          <FiTrash2 className="text-red-500 text-sm" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      {...register('description')}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-transparent transition"
                      placeholder="Short description..."
                    />
                    {errors?.description && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.description?.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Item'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddMenuItemModal;
