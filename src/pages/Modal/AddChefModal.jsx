import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FiCamera, FiTrash2, FiPlus } from 'react-icons/fi';
import api from '../../lib/api';

const AddChefModal = ({ isOpen, onClose, onSuccess, chef }) => {
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm();

  useEffect(() => {
    if (chef) {
      setValue('name', chef.name || '');
      setValue('email', chef.email || '');
      setValue('phone', chef.phone || '');
      setValue('specialty', chef.specialty || '');
      setValue('description', chef.description || '');
      if (chef.imageUrl) {
        setImageFile({ url: chef.imageUrl });
      }
    } else {
      reset();
      setImageFile(null);
    }
  }, [chef, setValue, reset]);

  const onSubmit = async data => {
    try {
      let imageUrl = chef?.imageUrl || null;

      if (imageFile && imageFile.name) {
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
          { method: 'POST', body: form }
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

      const promise = chef
        ? api.patch(`/chefs/${chef._id}`, payload)
        : api.post('/chefs', payload);

      toast.promise(promise, {
        loading: chef ? 'Updating chef...' : 'Adding chef...',
        success: chef
          ? 'Chef updated successfully!'
          : 'Chef added successfully!',
        error: chef ? 'Failed to update chef.' : 'Failed to add chef.',
      });

      await promise;
      reset();
      setImageFile(null);
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(
        error?.message ||
          (chef ? 'Failed to update chef.' : 'Failed to add chef.')
      );
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
          <div className="fixed inset-0 bg-black opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
              <div className="bg-primary px-5 py-3 flex items-center justify-between rounded-t-2xl">
                <div className="flex items-center gap-2 text-white">
                  <FiPlus className="text-lg" />
                  <Dialog.Title className="font-semibold text-sm md:text-base">
                    {chef ? 'Edit Chef' : 'Add New Chef'}
                  </Dialog.Title>
                </div>
                <button
                  onClick={onClose}
                  className="text-white text-lg font-bold hover:text-gray-200 transition"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="John Doe"
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-primary text-sm"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    {...register('email', { required: 'Email is required' })}
                    placeholder="chef@example.com"
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-primary text-sm"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    {...register('phone')}
                    placeholder="+1234567890"
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">
                    Specialty
                  </label>
                  <input
                    type="text"
                    {...register('specialty')}
                    placeholder="Italian Cuisine"
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs text-gray-600 mb-1">
                    Profile Image
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-md p-3 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition text-sm"
                    onClick={() =>
                      document.getElementById('fileUpload').click()
                    }
                  >
                    <input
                      type="file"
                      id="fileUpload"
                      accept="image/*"
                      onChange={e => setImageFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                      <FiCamera /> Upload Image
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Max 5MB (JPG/PNG)
                    </p>
                  </div>

                  {imageFile && (
                    <div className="mt-2 relative rounded-md overflow-hidden">
                      <img
                        src={imageFile.url || URL.createObjectURL(imageFile)}
                        alt="preview"
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => setImageFile(null)}
                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full shadow hover:bg-white"
                      >
                        <FiTrash2 className="text-red-500 text-sm" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 flex flex-col">
                  <label className="text-xs text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={2}
                    placeholder="Brief description"
                    className="w-full border border-gray-300 rounded-md px-2 py-1.5 focus:ring-1 focus:ring-primary text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white py-2 rounded-md font-medium hover:bg-primary/90 transition disabled:bg-gray-400 text-sm"
                  >
                    {isSubmitting
                      ? chef
                        ? 'Updating...'
                        : 'Adding...'
                      : chef
                      ? 'Update Chef'
                      : 'Add Chef'}
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

export default AddChefModal;
