import { useEffect, useState } from "react";
import api from "../../lib/api";
import toast from "react-hot-toast";

const ReservationsDashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // This function will be used to refetch data after an update
  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/reservations");
      setReservations(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch reservations.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // ✅ This is the updated function
  const handleUpdateStatus = async (id, status) => {
    const promise = api.patch(`/reservations/${id}`, { status });

    toast.promise(promise, {
      loading: "Updating status...",
      success: (res) => {
        // Update the state with the new data from the server response
        setReservations((prev) =>
          prev.map((r) => (r._id === id ? res.data.data : r))
        );
        return `Reservation has been ${status}.`;
      },
      error: "Failed to update status.",
    });

    try {
      await promise;
    } catch (error) {
      console.error("Failed to update reservation status:", error);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading reservations...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage Reservations</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            {/* Table headers remain the same */}
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
              <th className="px-5 py-3 border-b-2 border-gray-300 text-left">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-300 text-left">
                Contact
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-300 text-left">
                Details
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-300 text-center">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-300 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr
                key={res._id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="px-5 py-4">{res.name}</td>
                <td className="px-5 py-4">{res.phone}</td>
                <td className="px-5 py-4">
                  <p>Party of {res.partySize}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(res.date).toLocaleDateString()} at {res.time}
                  </p>
                </td>
                <td className="px-5 py-4 text-center">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                      res.status === "approved"
                        ? "bg-green-200 text-green-800"
                        : res.status === "declined" ||
                          res.status === "cancelled"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {res.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  {/* ✅ Buttons now call the updated handler */}
                  {res.status === "pending" && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(res._id, "approved")}
                        className="text-green-600 hover:text-green-900 font-semibold"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(res._id, "declined")}
                        className="text-red-600 hover:text-red-900 font-semibold"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationsDashboard;
