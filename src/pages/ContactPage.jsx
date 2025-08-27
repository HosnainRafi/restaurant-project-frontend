import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // clear error when typing
  };

  const handleSubmit = e => {
    e.preventDefault();
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Form Data:', form);
    alert('Message sent successfully ✅');

    setForm({ name: '', email: '', message: '' }); // reset form
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-24 px-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold text-[#8B1E3F] mb-8"
      >
        Contact Us
      </motion.h1>

      {/* Contact Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl">
        {/* Contact Info (Left) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <div className="bg-white shadow-md rounded-2xl p-6 flex items-center space-x-4">
            <FaPhone className="text-[#8B1E3F] text-xl" />
            <div>
              <p className="font-medium">Phone</p>
              <p className="text-gray-600">+880 1710-101984</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 flex items-center space-x-4">
            <FaEnvelope className="text-[#8B1E3F] text-xl" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-gray-600">support@restaurant.com</p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 flex items-center space-x-4">
            <FaMapMarkerAlt className="text-[#8B1E3F] text-xl" />
            <div>
              <p className="font-medium">Address</p>
              <p className="text-gray-600">Dhaka, Bangladesh</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Form (Right) */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white shadow-md rounded-2xl p-6 space-y-2"
        >
          <div>
            <label className="mt-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className=" w-full rounded-md ring-1 ring-gray-300 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8B1E3F]"
              placeholder="Your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mt-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md ring-1 ring-gray-300 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8B1E3F]"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              rows={3}
              name="message"
              value={form.message}
              onChange={handleChange}
              className=" w-full rounded-md ring-1 ring-gray-300 px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#8B1E3F]"
              placeholder="Write your message..."
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#8B1E3F] text-white py-1.5 px-4 rounded-md font-semibold shadow hover:bg-[#701830] transition"
          >
            Send Message
          </button>
        </motion.form>
      </div>

      {/* Map at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-5xl h-64 mt-12 overflow-hidden rounded-2xl shadow-lg"
      >
        <iframe
          title="Dhaka University Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.896632588289!2d90.38901701543182!3d23.72773208460021!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b894fe3fbc13%3A0x8a99f08a1f82a098!2sUniversity%20of%20Dhaka!5e0!3m2!1sen!2sbd!4v1694000000000!5m2!1sen!2sbd"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </motion.div>
    </div>
  );
};

export default ContactPage;
