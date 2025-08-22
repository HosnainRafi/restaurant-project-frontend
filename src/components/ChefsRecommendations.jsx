import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import SingleMenuItem from "./SingleMenuItem";

const ChefsRecommendations = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await api.get("/menu-items/special", {
        params: { flag: "isChefsRecommendation" },
      });

      // Normalize shape if SingleMenuItem expects certain keys
      const data = (res?.data?.data || []).map((it) => ({
        _id: it._id,
        name: it.name,
        description: it.description,
        price: it.price, // cents (format inside SingleMenuItem)
        imageUrl: it.imageUrl, // or fallback placeholder if needed
        isAvailable: it.isAvailable,
        categoryName:
          typeof it.categoryId === "object" ? it.categoryId?.name : null,
      }));

      setMenuItems(data);
    } catch (e) {
      const msg = e?.message || "Failed to load recommendations.";
      setErr(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <section className="py-20 bg-gradient-to-br from-background to-muted/40">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-primary text-center">
          Chef’s Recommendations
        </h2>
        <p className="text-text-secondary text-center mt-4 mb-12 max-w-2xl mx-auto">
          Specially curated dishes by our head chef to give a signature
          experience.
        </p>

        {loading && (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-lg bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && err && (
          <div className="text-center text-red-600">{err}</div>
        )}

        {!loading && !err && menuItems.length === 0 && (
          <div className="text-center text-gray-500">
            No recommendations right now.
          </div>
        )}

        {!loading && !err && menuItems.length > 0 && (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-2">
            {menuItems.map((item) => (
              <SingleMenuItem key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ChefsRecommendations;
