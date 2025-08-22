import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FeaturedSection = () => {
  const [items, setItems] = useState([]); // fetched featured items
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      setErr(null);
      // Uses your special endpoint and flag
      const res = await api.get("/menu-items/special", {
        params: { flag: "isFeatured" },
      });
      // Normalize to expected UI shape
      const data = (res?.data?.data || []).map((it) => ({
        id: it._id,
        title: it.name,
        description: it.description,
        image:
          it.imageUrl || "https://via.placeholder.com/600x400?text=Featured",
        price: it.price, // in cents
        category:
          typeof it.categoryId === "object" ? it.categoryId?.name : null,
      }));
      setItems(data);
    } catch (e) {
      setErr(e?.message || "Failed to load featured items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          Featured Dishes
        </h2>
        <p className="text-text-secondary text-center mt-3 mb-12 max-w-2xl mx-auto">
          Handpicked specialties from our kitchen to delight your taste buds.
        </p>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-xl bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && err && (
          <div className="text-center text-red-600">{err}</div>
        )}

        {/* Empty state */}
        {!loading && !err && items.length === 0 && (
          <div className="text-center text-gray-500">
            No featured items right now.
          </div>
        )}

        {/* Items */}
        {!loading && !err && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex flex-col justify-end p-4">
                  <h3 className="text-xl font-semibold text-background group-hover:text-primary transition">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-background/80 line-clamp-2">
                    {item.description}
                  </p>
                  <Link
                    to="/menu"
                    className="mt-3 flex bg-primary text-white px-4 py-1.5 justify-center rounded-md shadow-md hover:bg-primary-hover transition"
                  >
                    View More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSection;
