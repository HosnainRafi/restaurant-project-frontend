import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema } from "../schemas/reservationSchema";
import api from "../lib/api";
import toast from "react-hot-toast";

const ReservationPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(reservationSchema),
  });

  const onSubmit = async (data) => {
    try {
      const promise = api.post("/reservations", data);

      toast.promise(promise, {
        loading: "Sending your request...",
        success: "Reservation request sent! We will contact you shortly.",
        error: "Failed to send request. Please try again.",
      });

      await promise;
      reset(); // Clear the form on successful submission
    } catch (error) {
      console.error("Reservation failed:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Book a Table</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 font-medium mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-gray-700 font-medium mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                {...register("phone")}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Party Size */}
            <div>
              <label
                htmlFor="partySize"
                className="block text-gray-700 font-medium mb-2"
              >
                Party Size
              </label>
              <input
                type="number"
                id="partySize"
                {...register("partySize")}
                min="1"
                max="20"
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.partySize && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.partySize.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label
                htmlFor="date"
                className="block text-gray-700 font-medium mb-2"
              >
                Date
              </label>
              <input
                type="date"
                id="date"
                {...register("date")}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Time */}
            <div className="md:col-span-2">
              <label
                htmlFor="time"
                className="block text-gray-700 font-medium mb-2"
              >
                Time
              </label>
              <input
                type="time"
                id="time"
                {...register("time")}
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.time.message}
                </p>
              )}
            </div>

            {/* Note */}
            <div className="md:col-span-2">
              <label
                htmlFor="note"
                className="block text-gray-700 font-medium mb-2"
              >
                Special Requests (Optional)
              </label>
              <textarea
                id="note"
                {...register("note")}
                rows="4"
                className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
              {errors.note && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.note.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? "Submitting..." : "Send Reservation Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationPage;
