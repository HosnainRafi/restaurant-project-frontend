import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { FaCamera, FaPlusCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const AddFoodCategoryModal = ({ isOpen, onClose, onSuccess, category }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    reset({
      categoryName: category?.name || '',
      description: category?.description || '',
    });
    setPreviewUrl(category?.imageUrl || null);
    setSelectedFile(null);
  }, [category, reset]);

  const uploadToImgbb = async file => {
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
      const name = data.categoryName.trim();
      const description = data.description.trim();
      let imageUrl = category?.imageUrl || null;

      if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024)
          return toast.error('Max 5MB image size');
        if (!/^image\//.test(selectedFile.type))
          return toast.error('Invalid file type');

        const uploading = uploadToImgbb(selectedFile);
        toast.promise(uploading, {
          loading: 'Uploading image...',
          success: 'Image uploaded!',
          error: 'Upload failed',
        });
        imageUrl = await uploading;
      }

      const payload = { name, description, ...(imageUrl ? { imageUrl } : {}) };
      const request = category
        ? api.patch(`/menu-categories/${category._id}`, payload)
        : api.post('/menu-categories', payload);

      toast.promise(request, {
        loading: category ? 'Updating...' : 'Creating...',
        success: category ? 'Updated!' : 'Created!',
        error: 'Operation failed',
      });

      await request;
      reset();
      setPreviewUrl(null);
      setSelectedFile(null);
      onSuccess?.();
      onClose();
    } catch (e) {
      toast.error(e?.message || 'Failed to save category.');
    }
  };

  const openFilePicker = () => document.getElementById('imageUpload')?.click();
  const onImageChange = e => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setPreviewUrl(
      file ? URL.createObjectURL(file) : category?.imageUrl || null
    );
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
          <div className="fixed inset-0 bg-black opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-2">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-xl w-full max-w-md shadow-lg overflow-hidden">
              <div className="bg-primary px-4 py-2 flex items-center justify-between rounded-t-xl">
                <Dialog.Title className="text-white font-semibold text-base">
                  {category ? 'Edit Category' : 'Add Category'}
                </Dialog.Title>
                <button
                  onClick={onClose}
                  className="text-white font-bold hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-3">
                <div>
                  <input
                    type="text"
                    {...register('categoryName', { required: true })}
                    placeholder="Category Name"
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-primary"
                  />
                  {errors.categoryName && (
                    <p className="text-red-500 text-xs mt-1">Required</p>
                  )}
                </div>

                <div>
                  <textarea
                    {...register('description', { required: true })}
                    rows="2"
                    placeholder="Description"
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-primary"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">Required</p>
                  )}
                </div>

                <div>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-md h-24 flex items-center justify-center cursor-pointer hover:border-primary transition"
                    onClick={openFilePicker}
                  >
                    <FaCamera className="text-2xl text-gray-400" />
                  </div>
                  <input
                    type="file"
                    {...register('image')}
                    id="imageUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={onImageChange}
                  />
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="h-20 w-20 object-cover rounded-md mt-2"
                    />
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:bg-gray-400 text-sm"
                >
                  <FaPlusCircle />{' '}
                  {isSubmitting ? 'Saving...' : category ? 'Update' : 'Add'}
                </button>
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddFoodCategoryModal;
