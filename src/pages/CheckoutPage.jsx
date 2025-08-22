import { useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "../schemas/checkoutSchema";
import { useCart } from "../hooks/useCart";
import api from "../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm";
import { ImSpinner3 } from "react-icons/im";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const TAX_RATE = 0.08;

const CheckoutPage = () => {
  const { items, clearCart } = useCart();
  const { dbUser } = useAuth(); // Get the logged-in user's profile
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [order, setOrder] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { type: "pickup", paymentMethod: "card" },
  });

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;

  const paymentMethod = watch("paymentMethod");
  const orderType = watch("type");

  const handleCreateOrder = async (formData) => {
    const orderData = {
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: orderType === "delivery" ? formData.address : undefined,
        // --- NEW: Add the customer's UID if they are logged in ---
        uid: dbUser?.uid,
      },
      items: items.map((item) => ({
        // --- THIS IS THE FIX ---
        // Map the item's `_id` from the cart to the `menuItemId` expected by the backend.
        menuItemId: item._id,
        quantity: item.quantity,
      })),
      type: formData.type,
    };

    const promise = api.post("/orders", orderData);
    toast.promise(promise, {
      loading: "Placing your order...",
      success: "Order placed! Finalizing...",
      error: (err) => err.response?.data?.message || "Failed to place order.",
    });

    try {
      const res = await promise;
      const newOrder = res.data.data;
      setOrder(newOrder);

      if (formData.paymentMethod === "card") {
        initializePayment(newOrder);
      } else {
        toast.success("Your order is confirmed! We'll see you soon.");
        clearCart();
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to create order:", error.response?.data || error);
    }
  };

  const initializePayment = async (createdOrder) => {
    try {
      const res = await api.post("/payment/create-payment-intent", {
        amount: createdOrder.total,
        orderId: createdOrder._id,
      });
      setClientSecret(res.data.data.clientSecret);
    } catch (err) {
      toast.error("Could not initialize payment module.");
      console.error(err);
    }
  };

  const handleSuccessfulCheckout = async () => {
    clearCart();
    navigate("/");
  };

  if (!items.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Your cart is empty.</h2>
        <button
          onClick={() => navigate("/menu")}
          className="mt-4 bg-primary text-white py-2 px-5 rounded-lg"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  if (clientSecret && order) {
    return (
      <div className="max-w-xl mx-auto p-8 my-10 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-2 text-center">
          Complete Your Payment
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Order #{order.orderNumber}
        </p>
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            onSuccessfulCheckout={handleSuccessfulCheckout}
          />
        </Elements>
      </div>
    );
  }

  return (
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-6">Your Details</h2>
        <form onSubmit={handleSubmit(handleCreateOrder)} className="space-y-5">
          <input
            {...register("name")}
            placeholder="Full Name"
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
          <input
            {...register("phone")}
            placeholder="Phone Number"
            className="w-full border rounded-lg px-3 py-2"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}

          <select
            {...register("type")}
            className="w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="pickup">Pickup</option>
            <option value="delivery">Delivery</option>
          </select>

          {orderType === "delivery" && (
            <div>
              <input
                {...register("address")}
                placeholder="Full Delivery Address"
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                <input
                  type="radio"
                  value="card"
                  {...register("paymentMethod")}
                  className="mr-3"
                />
                Pay with Card
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary">
                <input
                  type="radio"
                  value="pickup"
                  {...register("paymentMethod")}
                  className="mr-3"
                />
                Pay at Pickup
              </label>
            </div>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-2">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-3 px-5 rounded-lg shadow-md hover:bg-primary-hover transition flex justify-center items-center"
          >
            {isSubmitting ? (
              <ImSpinner3 className="animate-spin" size={24} />
            ) : paymentMethod === "card" ? (
              "Continue to Payment"
            ) : (
              "Confirm Order"
            )}
          </button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg h-fit">
        <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <span className="font-medium">
                {item.name} &times; {item.quantity}
              </span>
              <span className="text-gray-700">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t space-y-2 font-semibold">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${(tax / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-primary">
            <span>Total</span>
            <span>${(total / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
