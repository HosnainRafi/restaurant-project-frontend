import { useForm, useFieldArray } from 'react-hook-form';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { ImSpinner3 } from 'react-icons/im';
import { PlusCircle, Trash2, Eye, EyeOff } from 'lucide-react';
import { auth } from '@/lib/firebase';
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

const CustomerProfile = () => {
  const { dbUser, loading: authLoading, refetchDbUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEmailPasswordUser = auth.currentUser?.providerData.some(
    provider => provider.providerId === 'password'
  );

  const { register, handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      name: '',
      email: '',
      photoURL: '',
      addresses: [],
      currentPassword: '',
      newPassword: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'addresses',
  });
  const photoURL = watch('photoURL');

  useEffect(() => {
    if (dbUser) {
      reset({
        name: dbUser.name || '',
        email: dbUser.email || '',
        photoURL: dbUser.photoURL || '',
        addresses: dbUser.addresses?.length
          ? dbUser.addresses
          : [{ label: 'Primary', details: '' }],
        currentPassword: '',
        newPassword: '',
      });
    }
  }, [dbUser, reset]);

  const handleImageUpload = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    try {
      const res = await fetch(url, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) {
        setValue('photoURL', data.secure_url, { shouldDirty: true });
        toast.success('Image uploaded!');
      } else {
        throw new Error(data.error?.message || 'Cloudinary upload failed');
      }
    } catch (error) {
      toast.error(error.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async data => {
    setIsUpdating(true);
    try {
      await api.patch('/auth/me', {
        name: data.name,
        photoURL: data.photoURL,
        addresses: data.addresses,
      });
      toast.success('Profile details updated!');
      refetchDbUser();

      if (isEmailPasswordUser && data.newPassword) {
        if (!data.currentPassword) {
          toast.error('Please enter your current password to set a new one.');
          setIsUpdating(false);
          return;
        }

        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(
          user.email,
          data.currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, data.newPassword);
        toast.success('Password changed successfully!');
        reset({ ...data, currentPassword: '', newPassword: '' });
      }
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        toast.error('Incorrect current password.');
      } else if (error.code) {
        toast.error(error.message || 'Failed to change password. Please try again.');
      } else {
        console.error('An error occurred during profile update:', error);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading)
    return <div className="text-center p-20">Loading profile...</div>;

  return (
    <div className="pt-24 pb-12 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={
                  photoURL ||
                  'https://res.cloudinary.com/du8e3wgew/image/upload/v1756087795/dx47mzwd8xxtxacrbd3h.png'
                }
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border border-gray-300"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                  <ImSpinner3 className="animate-spin text-white text-lg" />
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="photo-upload"
                className="cursor-pointer bg-primary text-white px-3 py-1.5 rounded-md text-sm hover:bg-primary-hover transition"
              >
                Upload Picture
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, GIF up to 10MB.
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Basic Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  {...register('name')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <input
                  {...register('email')}
                  disabled
                  className="w-full border border-gray-200 bg-gray-100 rounded-md px-3 py-2 text-sm text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Security */}
          {isEmailPasswordUser && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    {...register('currentPassword')}
                    placeholder="Enter current password"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    New Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('newPassword')}
                    placeholder="Leave blank to keep current"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Addresses */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Addresses
            </h3>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-md bg-white"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      {...register(`addresses.${index}.label`)}
                      placeholder="Label (e.g., Home)"
                      className="col-span-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    />
                    <input
                      {...register(`addresses.${index}.details`)}
                      placeholder="Full Address"
                      className="col-span-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => append({ label: '', details: '' })}
                className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
              >
                <PlusCircle size={16} /> Add New Address
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 text-right">
            <button
              type="submit"
              disabled={isUpdating || isUploading}
              className="w-full md:w-auto flex justify-center items-center gap-2 bg-primary text-white py-2.5 px-6 rounded-md shadow hover:bg-primary-hover transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUpdating ||
                (isUploading && <ImSpinner3 className="animate-spin" />)}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerProfile;
