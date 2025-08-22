import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiCamera, FiTrash2, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const AddChef = () => {
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

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

        const form = new FormData();
        form.append('image', imageFile);

        const uploading = fetch(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMGBB_KEY
          }`,
          {
            method: 'POST',
            body: form,
          }
        ).then(res => res.json());

        toast.promise(uploading, {
          loading: 'Uploading image...',
          success: 'Image uploaded!',
          error: 'Image upload failed.',
        });

        const json = await uploading;
        imageUrl = json?.data?.url || json?.data?.display_url || null;
      }

      const payload = { ...data, ...(imageUrl ? { imageUrl } : {}) };
      const promise = api.post('/add-new-chefs', payload);

      toast.promise(promise, {
        loading: 'Adding chef...',
        success: 'Chef added successfully!',
        error: 'Failed to add chef.',
      });

      await promise;
      reset();
      setImageFile(null);
    } catch (error) {
      toast.error(error?.message || 'Failed to add chef.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg border border-gray-100">
        <div className="bg-primary px-6 py-4 text-center rounded-t-lg flex items-center justify-center gap-2">
          <FiPlus className="text-white text-lg" />
          <h2 className="text-xl font-semibold text-white">Add New Chef</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Chef's full name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="chef@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="+880 1XXXXXXXXX"
            />
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Specialty
            </label>
            <input
              type="text"
              {...register('specialty')}
              className="w-full border border-gray-200 rounded-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g., Italian Cuisine"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">Image</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition"
              onClick={() => document.getElementById('fileUpload').click()}
            >
              <input
                type="file"
                accept="image/*"
                id="fileUpload"
                onChange={e => setImageFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <FiCamera /> Click to upload image
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Max 5MB (JPG/PNG only)
              </p>
            </div>
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
              placeholder="Write a short bio or description"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-2.5 rounded-md font-medium hover:bg-primary/90 transition disabled:bg-gray-400"
            >
              {isSubmitting ? 'Adding...' : 'Add Chef'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChef;
