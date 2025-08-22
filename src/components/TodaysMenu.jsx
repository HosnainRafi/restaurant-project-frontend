import { useEffect, useState } from "react";
import SingleMenuItem from "./SingleMenuItem";
import api from "@/lib/api";
import toast from "react-hot-toast";

const TodaysMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchTodaysSpecials = async () => {
    try {
      setLoading(true);
      setErr(null);
      // Use your backend special route
      const res = await api.get("/menu-items/special", {
        params: { flag: "isTodaysSpecial" },
      });

      // Normalize to UI-friendly shape if needed
      const data = (res?.data?.data || []).map((it) => ({
        _id: it._id,
        name: it.name,
        description: it.description,
        price: it.price, // cents
        imageUrl: it.imageUrl,
        isAvailable: it.isAvailable,
        // support populated or id category
        categoryName:
          typeof it.categoryId === "object" ? it.categoryId?.name : null,
      }));

      setMenuItems(data);
    } catch (e) {
      setErr(e?.message || "Failed to load today’s specials.");
      toast.error("Failed to load today’s specials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysSpecials();
  }, []);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          Today’s Specials
        </h2>
        <p className="text-text-secondary text-center mt-3 mb-12 max-w-2xl mx-auto">
          Handpicked dishes for today to delight your taste buds.
        </p>

        {loading && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
            No specials for today.
          </div>
        )}

        {!loading && !err && menuItems.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {menuItems.map((item) => (
              <SingleMenuItem key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TodaysMenu;
