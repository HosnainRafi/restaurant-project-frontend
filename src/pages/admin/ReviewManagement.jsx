import { useEffect, useState } from "react";
import { FaStar, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "@/lib/api";
import ConfirmDeleteModal from "../Modal/ConfirmDeleteModal"; // Assuming you have this component

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const fetchAllReviews = async () => {
    try {
      setIsLoading(true);
      // Use the admin route to get all reviews with populated user data
      const response = await api.get("/reviews");
      setReviews(response.data.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch reviews.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const toggleFeaturedStatus = async (reviewId, currentStatus) => {
    const newStatus = !currentStatus;

    // This promise calls the PATCH /reviews/:reviewId endpoint.
    // The backend controller will see the 'admin' role and call the correct service.
    const promise = api.patch(`/reviews/${reviewId}`, {
      isFeatured: newStatus,
    });

    toast.promise(promise, {
      loading: "Updating status...",
      success: `Review ${newStatus ? "featured" : "unfeatured"}!`,
      error: "Failed to update status.",
    });

    try {
      const response = await promise;
      // Update the local state to immediately reflect the change
      setReviews((prev) =>
        prev.map((review) =>
          review._id === reviewId ? response.data.data : review
        )
      );
    } catch (err) {
      console.error("Failed to toggle feature status", err);
    }
  };

  const handleDeleteClick = (review) => {
    setReviewToDelete(review);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;

    // This promise calls the DELETE /reviews/:reviewId endpoint.
    // The backend route requires an 'admin' role.
    const promise = api.delete(`/reviews/${reviewToDelete._id}`);

    toast.promise(promise, {
      loading: "Deleting review...",
      success: "Review deleted successfully!",
      error: "Failed to delete review.",
    });

    try {
      await promise;
      // Remove the deleted review from the local state
      setReviews((prev) => prev.filter((r) => r._id !== reviewToDelete._id));
      setIsDeleteModalOpen(false);
      setReviewToDelete(null);
    } catch (err) {
      console.error("Failed to delete review", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-primary mb-6">
          Review Management
        </h2>

        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading reviews...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-primary/10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary uppercase">
                    Comment
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary uppercase">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary uppercase">
                    Featured
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-primary uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr
                    key={review._id}
                    className="hover:bg-primary/5 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            review.userId?.photoURL ||
                            "https://i.pravatar.cc/100"
                          }
                          alt={review.userId?.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {review.userId?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {review.userId?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm italic max-w-sm">
                      <p className="line-clamp-3">"{review.comment}"</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-bold text-lg text-primary">
                          {review.rating}
                        </span>
                        <FaStar className="text-yellow-500" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <label className="flex items-center justify-center gap-1 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-primary cursor-pointer"
                          checked={!!review.isFeatured}
                          onChange={() =>
                            toggleFeaturedStatus(review._id, review.isFeatured)
                          }
                        />
                      </label>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteClick(review)}
                        className="flex items-center justify-center gap-1 mx-auto px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={`the review from ${
          reviewToDelete?.userId?.name || "this user"
        }`}
      />
    </div>
  );
};

export default ReviewManagement;
