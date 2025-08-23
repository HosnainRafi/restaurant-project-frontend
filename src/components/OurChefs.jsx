import api from '@/lib/api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const OurChefs = () => {
  const [chefs, setChefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChefs = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/chefs');
      setChefs(res.data.data || []);
    } catch (error) {
      toast.error(error?.message || 'Failed to fetch chefs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-primary text-center">
          Meet Our Chefs
        </h2>
        <p className="text-text-secondary text-center mt-2 mb-10 text-sm md:text-base max-w-2xl mx-auto">
          Our talented chefs bring passion and creativity to every dish, making
          your dining experience unforgettable.
        </p>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading chefs...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {chefs.map(chef => (
              <div
                key={chef._id}
                className="relative group overflow-hidden rounded-2xl shadow-lg"
              >
                {/* Chef Image */}
                <img
                  src={
                    chef.imageUrl || 'https://i.postimg.cc/vZhx8prw/chefs.jpg'
                  }
                  alt={chef.name}
                  className="w-full h-[300px] object-cover transform group-hover:scale-110 transition duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-semibold text-white">
                    {chef.name}
                  </h3>
                  <p className="text-gray-200">{chef.specialty || chef.role}</p>
                </div>

                {/* Bottom Content (Always Visible) */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 text-center">
                  <h3 className="text-lg font-medium text-gray-800">
                    {chef.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {chef.specialty || chef.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OurChefs;
