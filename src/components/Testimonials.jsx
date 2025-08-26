import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const hardcodedTestimonials = [
  {
    _id: "hardcoded-1",
    user: {
      name: "Sophia Martinez",
      photoURL: "https://i.pravatar.cc/100?img=1",
    },
    comment:
      "Absolutely loved the Grilled Salmon! The flavors were perfectly balanced, and the atmosphere was so cozy.",
    rating: 5,
  },
  {
    _id: "hardcoded-2",
    user: {
      name: "Liam Johnson",
      photoURL: "https://i.pravatar.cc/100?img=2",
    },
    comment:
      "The steak was juicy and cooked to perfection. Definitely one of the best dining experiences I’ve had in town.",
    rating: 5,
  },
  {
    _id: "hardcoded-3",
    user: {
      name: "Emily Davis",
      photoURL: "https://i.pravatar.cc/100?img=3",
    },
    comment:
      "A hidden gem! The pasta was so delicious and creamy, I can’t wait to come back with my friends.",
    rating: 5,
  },
];

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndCombineReviews = async () => {
      setLoading(true);
      try {
        const response = await api.get("/reviews/featured");
        const realReviews = response.data.data || [];

        // --- START: THE FIX ---
        // Create a set of IDs from the real reviews for efficient lookup.
        const realReviewIds = new Set(realReviews.map((r) => r._id));

        // Filter the hardcoded testimonials to only include those not already fetched from the API.
        const uniqueHardcoded = hardcodedTestimonials.filter(
          (h) => !realReviewIds.has(h._id)
        );

        // Combine the real reviews and the unique hardcoded reviews.
        const combinedReviews = [...realReviews, ...uniqueHardcoded];
        // --- END: THE FIX ---

        setReviews(combinedReviews);
      } catch (error) {
        console.error("Error fetching reviews, using fallback:", error);
        setReviews(hardcodedTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCombineReviews();
  }, []);

  if (!loading && reviews.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://res.cloudinary.com/du8e3wgew/video/upload/v1756134350/landingvideo_eoxkht.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative max-w-6xl mx-auto px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          What Our Guests Say
        </h2>
        <p className="mt-3 mb-10 text-sm md:text-base text-gray-200">
          Real stories from happy customers who enjoyed our food and service.
        </p>

        {loading ? (
          <p>Loading testimonials...</p>
        ) : (
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            spaceBetween={30}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review._id}>
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg flex flex-col items-center h-full min-h-[18rem]">
                  <img
                    src={review.user?.photoURL || "https://i.pravatar.cc/100"}
                    alt={review.user?.name || "Customer"}
                    className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-primary"
                  />
                  <p className="text-sm text-gray-100 text-center line-clamp-4 flex-grow">
                    "{review.comment}"
                  </p>
                  <div className="flex justify-center gap-1 mt-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5"
                        fill={i < review.rating ? "#FFC107" : "none"}
                        stroke={i < review.rating ? "#FFC107" : "#FFFFFF"}
                      />
                    ))}
                  </div>
                  <h4 className="mt-4 text-md font-semibold text-white">
                    {review.user?.name || "Valued Customer"}
                  </h4>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
