import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SingleMenuItem from "./SingleMenuItem";

const FeaturedDishes = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchFeatured = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await api.get("/menu-items/special", {
        params: { flag: "isFeatured" },
      });
      const data = (res?.data?.data || []).map((it) => ({
        id: it._id,
        title: it.name,
        description: it.description,
        image:
          it.imageUrl || "https://via.placeholder.com/600x400?text=Featured",
        price: it.price,
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {items.map((item) => (
              <SingleMenuItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDishes;
