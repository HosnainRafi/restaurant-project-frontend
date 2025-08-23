import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema } from "../schemas/reservationSchema"; // Ensure this schema matches the backend
import api from "../lib/api";
import toast from "react-hot-toast";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { ImSpinner3 } from "react-icons/im";
import "react-datepicker/dist/react-datepicker.css";

const ReservationPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(reservationSchema),
  });

  const [selectedDate, setSelectedDate] = useState(null);

  const onSubmit = async (data) => {
    try {
      const promise = api.post("/reservations", data);

      toast.promise(promise, {
        loading: "Sending your request...",
        success: "Reservation request sent! We will contact you shortly.",
        error: "Failed to send request. Please try again.",
      });

      await promise;
      reset();
      setSelectedDate(null);
    } catch (error) {
      console.error("Reservation failed:", error);
    }
  };

  return (
    <div className="pt-28 pb-12 bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-3">
          Book a Table
        </h1>
        <p className="text-gray-600 text-center mb-6 text-base">
          Reserve your spot today and enjoy our chef’s special dishes.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                // --- THE FIX: Register as a nested field ---
                {...register("customer.name")}
                placeholder="John Doe"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {/* --- THE FIX: Access nested error message --- */}
              {errors.customer?.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customer.name.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                // --- THE FIX: Register as a nested field ---
                {...register("customer.phone")}
                placeholder="+1 234 567 890"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {/* --- THE FIX: Access nested error message --- */}
              {errors.customer?.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.customer.phone.message}
                </p>
              )}
            </div>

            {/* Party Size */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Party Size
              </label>
              <input
                type="number"
                {...register("partySize")}
                min="1"
                max="20"
                placeholder="2"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.partySize && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.partySize.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  setValue("date", date?.toISOString().split("T")[0], {
                    shouldValidate: true,
                  });
                }}
                minDate={new Date()}
                placeholderText="Select a date"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Time */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Time
              </label>
              <input
                type="time"
                {...register("time")}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.time.message}
                </p>
              )}
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Special Requests (Optional)
            </label>
            <textarea
              {...register("note")}
              rows="3"
              placeholder="Any dietary restrictions or special occasions?"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-3 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <ImSpinner3 className="animate-spin text-white h-5 w-5" />
            ) : (
              "Send Reservation Request"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReservationPage;
