import { Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

const testimonials = [
  {
    id: 1,
    name: 'Sophia Martinez',
    role: 'Food Blogger',
    image: 'https://i.pravatar.cc/100?img=1',
    review:
      'Absolutely loved the Grilled Salmon! The flavors were perfectly balanced, and the atmosphere was so cozy.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Liam Johnson',
    role: 'Local Guide',
    image: 'https://i.pravatar.cc/100?img=2',
    review:
      'The steak was juicy and cooked to perfection. Definitely one of the best dining experiences I’ve had in town.',
    rating: 4,
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Traveler',
    image: 'https://i.pravatar.cc/100?img=3',
    review:
      'A hidden gem! The pasta was so delicious and creamy, I can’t wait to come back with my friends.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Daniel Carter',
    role: 'Photographer',
    image: 'https://i.pravatar.cc/100?img=4',
    review:
      'The desserts were heavenly! Perfect spot to relax after a long day.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Olivia Brown',
    role: 'Entrepreneur',
    image: 'https://i.pravatar.cc/100?img=5',
    review:
      'Amazing staff and wonderful food presentation. Truly exceeded expectations!',
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-20">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://res.cloudinary.com/du8e3wgew/video/upload/v1756134350/landingvideo_eoxkht.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative max-w-6xl mx-auto px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          What Our Guests Say
        </h2>
        <p className="mt-3 mb-10 text-sm md:text-base text-gray-200">
          Real stories from happy customers who enjoyed our food and service.
        </p>

        {/* Swiper */}
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {testimonials.map(t => (
            <SwiperSlide key={t.id}>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-md flex flex-col items-center h-64">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover mb-3"
                />
                {/* Review */}
                <p className="text-sm text-gray-100 text-center line-clamp-3 flex-grow">
                  "{t.review}"
                </p>
                {/* Stars */}
                <div className="flex justify-center gap-1 mt-2">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill="#8B1E3F"
                      stroke="#8B1E3F"
                    />
                  ))}
                </div>
                {/* Name */}
                <h4 className="mt-2 text-sm font-semibold text-[#8B1E3F]">
                  {t.name}
                </h4>
                <p className="text-xs text-gray-300">{t.role}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
