import { auth } from '../lib/firebase';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ImSpinner3 } from 'react-icons/im';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import api from '@/lib/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        toast.error(
          'Please verify your email before logging in. Check your inbox.'
        );
        await auth.signOut();
        return;
      }

      toast.success('Logged in successfully!');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Error logging in:', error);
      if (
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        toast.error('Incorrect email or password. Please try again.');
      } else {
        toast.error(error.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // For Google login, we can assume email is verified automatically
      await syncUserWithBackend(user);
      toast.success('Google login successful! Syncing profile...');
    } catch (error) {
      console.error('Google login failed:', error);
      toast.error('Google login failed. Please try again.');
    }
  };

  const syncUserWithBackend = async (firebaseUser, registrationData = null) => {
    if (!firebaseUser) return;
    try {
      const token = await firebaseUser.getIdToken(true);

      const payload = {
        name: registrationData?.name || firebaseUser.displayName,
        email: firebaseUser.email,
        address: registrationData?.address
          ? {
              label: 'Primary',
              details: registrationData.address,
            }
          : undefined,
      };

      await api.post('/auth/sync', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Profile synced successfully!');
    } catch (error) {
      console.error('Backend sync failed:', error);
      toast.error('Could not sync your profile. Please try again.');
    } finally {
      navigate('/');
    }
  };

  return (
    <div className="pt-28 mb-12 flex items-center justify-center px-4 bg-gradient-to-br from-[#F9F9F6] to-[#FFF7F2] min-h-[calc(100vh - 395px)]">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>

        <h2 className="text-3xl font-bold text-primary text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-text-secondary text-sm mb-8">
          Login to access your dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition shadow-sm"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition shadow-sm pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-1 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={18} />
              ) : (
                <AiOutlineEye size={18} />
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white py-2.5 rounded-md font-semibold text-sm shadow-lg transition ${
              loading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:from-primary/90 hover:to-secondary/90'
            }`}
          >
            {loading && <ImSpinner3 className="animate-spin text-white" />}
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* OR separator */}
          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-md py-1.5 shadow-sm hover:bg-gray-50 transition"
          >
            <FcGoogle size={20} />
            <span className="text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>

          <div className="text-center mt-3">
            <a
              href="#"
              className="text-sm text-primary hover:underline transition"
            >
              Forgot Password?
            </a>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don’t have an account?{' '}
              <Link
                to="/register"
                className="text-primary font-medium hover:underline"
              >
                Create one here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
