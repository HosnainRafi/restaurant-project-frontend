import api from '@/lib/api';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';
import { EffectCoverflow, Autoplay } from 'swiper/modules';

const OurChefs = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/chefs');
      setChefs(res.data.data || []);
    } catch (error) {
      toast.error(error?.message || 'Failed to fetch chefs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          Meet Our Chefs
        </h2>
        <p className="text-text-secondary text-center mt-3 mb-12 max-w-2xl mx-auto">
          Our talented chefs bring passion and creativity to every dish, making
          your dining experience unforgettable.
        </p>

        {/* Empty state */}
        {!loading && chefs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-gray-300 bg-gray-50 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Chefs Available
            </h3>
            <p className="text-gray-500 max-w-md text-center mb-6">
              Currently, we don’t have any chefs available. Check back later for
              updates!
            </p>
          </div>
        )}

        {/* Carousel */}
        {!loading && chefs.length > 0 && (
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 200,
              modifier: 3,
              slideShadows: false,
            }}
            modules={[EffectCoverflow, Autoplay]}
            className="featured-swiper"
          >
            {chefs.map(chef => (
              <SwiperSlide key={chef._id} className="max-w-sm">
                <div className="relative rounded-3xl overflow-hidden shadow-lg">
                  {/* Chef Image */}
                  <img
                    src={
                      chef.imageUrl || 'https://i.postimg.cc/vZhx8prw/chefs.jpg'
                    }
                    alt={chef.name}
                    className="w-full h-[350px] object-cover transform transition duration-500 hover:scale-110"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition duration-500 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-semibold text-white">
                      {chef.name}
                    </h3>
                    <p className="text-gray-200">
                      {chef.specialty || chef.role}
                    </p>
                  </div>

                  {/* Bottom always visible content */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md p-4 text-center">
                    <h3 className="text-lg font-medium text-gray-800">
                      {chef.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {chef.specialty || chef.role}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default OurChefs;
