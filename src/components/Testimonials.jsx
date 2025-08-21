import { Star } from 'lucide-react';

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
];

const Testimonials = () => {
  return (
    <section className="bg-background py-14">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">
          What Our Guests Say
        </h2>
        <p className="text-text-secondary mt-2 mb-10 text-sm md:text-base">
          Real stories from happy customers who enjoyed our food and service.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div
              key={t.id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <div className="flex justify-center mb-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-14 h-14 rounded-full border border-primary object-cover"
                />
              </div>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                “{t.review}”
              </p>
              <div className="flex justify-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < t.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <h4 className="font-semibold text-base text-primary">{t.name}</h4>
              <p className="text-xs text-gray-500">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
