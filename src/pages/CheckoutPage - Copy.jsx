// import { useState, useEffect, useMemo } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { checkoutSchema } from "../schemas/checkoutSchema";
// import { useCart } from "../hooks/useCart";
// import api from "../lib/api";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import CheckoutForm from "../components/CheckoutForm"; // Import the new component

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
// const TAX_RATE = 0.08;

// const CheckoutPage = () => {
//   const { items, clearCart } = useCart();
//   const navigate = useNavigate();
//   const [clientSecret, setClientSecret] = useState("");

//   const {
//     register,
//     handleSubmit,
//     getValues,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(checkoutSchema),
//     defaultValues: { type: "pickup" },
//   });

//   const subtotal = useMemo(() => {
//     return items.reduce((total, item) => total + item.price * item.quantity, 0);
//   }, [items]);

//   const total = Math.round(subtotal * (1 + TAX_RATE)); // Total in cents

//   // Fetch the Payment Intent from your backend when the page loads
//   useEffect(() => {
//     if (total > 0) {
//       api
//         .post("/payment/create-payment-intent", { amount: total })
//         .then((res) => {
//           setClientSecret(res.data.data.clientSecret);
//         })
//         .catch((err) => {
//           toast.error("Could not initialize payment.");
//           console.error(err);
//         });
//     }
//   }, [total]);

//   // This function will be called AFTER a successful Stripe payment
//   const handlePlaceOrder = async () => {
//     const data = getValues(); // Get the latest form data
//     const orderData = {
//       customer: { name: data.name, phone: data.phone, email: data.email },
//       items: items.map((item) => ({
//         menuItemId: item._id,
//         quantity: item.quantity,
//       })),
//       type: data.type,
//       total, // You can also send the total for verification
//     };

//     const promise = api.post("/orders", orderData);

//     toast.promise(promise, {
//       loading: "Finalizing your order...",
//       success: "Order placed successfully! Thank you!",
//       error: "There was an issue saving your order.",
//     });

//     try {
//       await promise;
//       clearCart();
//       navigate("/");
//     } catch (error) {
//       console.error("Failed to place order:", error);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//         {/* Customer Details & Payment */}
//         <div className="bg-white p-8 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold mb-6">1. Your Details</h2>
//           <form id="customer-details-form">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label htmlFor="name" className="block font-medium mb-1">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   {...register("name")}
//                   className="w-full border rounded px-3 py-2"
//                 />
//                 {errors.name && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="phone" className="block font-medium mb-1">
//                   Phone Number
//                 </label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   {...register("phone")}
//                   className="w-full border rounded px-3 py-2"
//                 />
//                 {errors.phone && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.phone.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </form>

//           <h2 className="text-2xl font-semibold mt-10 mb-6">2. Payment</h2>
//           {clientSecret && (
//             <Elements options={{ clientSecret }} stripe={stripePromise}>
//               <CheckoutForm
//                 clientSecret={clientSecret}
//                 onSuccessfulCheckout={handleSubmit(handlePlaceOrder)}
//               />
//             </Elements>
//           )}
//         </div>

//         {/* Order Summary */}
//         <div className="bg-white p-8 rounded-lg shadow-md h-fit">
//           <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
//           {/* ... order summary JSX ... */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
import { useState, useEffect, useMemo } from "react";
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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
const TAX_RATE = 0.08;

const CheckoutPage = () => {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange", // validate on change
    defaultValues: { type: "pickup" },
  });

  // subtotal in $
  const subtotal = useMemo(
    () => items.reduce((t, i) => t + i.price * i.quantity, 0),
    [items]
  );
  const totalInCents = Math.round(subtotal * (1 + TAX_RATE) * 100);

  // fetch Stripe clientSecret
  useEffect(() => {
    if (totalInCents > 0) {
      api
        .post("/payment/create-payment-intent", {
          amount: totalInCents,
          currency: "usd",
        })
        .then((res) => setClientSecret(res.data.data.clientSecret))
        .catch(() => toast.error("Could not initialize payment."));
    }
  }, [totalInCents]);

  // place order after payment
  const handlePlaceOrder = async () => {
    const data = getValues();
    const orderData = {
      customer: { name: data.name, phone: data.phone, email: data.email },
      items: items.map((i) => ({ menuItemId: i._id, quantity: i.quantity })),
      type: data.type,
      total: totalInCents,
      currency: "usd",
    };

    const promise = api.post("/orders", orderData);

    toast.promise(promise, {
      loading: "Saving your order...",
      success: "Order placed successfully! 🎉",
      error: "Could not save order.",
    });

    try {
      await promise;
      clearCart();
      navigate("/");
    } catch {
      // Error is handled by toast.promise above
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left side - form + payment */}
        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">1. Your Details</h2>
          <form className="space-y-5">
            <div>
              <label className="block font-medium mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register("name")}
                onBlur={() => trigger("name")}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                onBlur={() => trigger("phone")}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                onBlur={() => trigger("email")}
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
          </form>

          <h2 className="text-2xl font-semibold mt-10 mb-6">2. Payment</h2>
          {clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, appearance: { theme: "stripe" } }}
            >
              <CheckoutForm
                clientSecret={clientSecret}
                onSuccessfulCheckout={handleSubmit(handlePlaceOrder)}
                isFormValid={isValid}
              />
            </Elements>
          ) : (
            <p className="text-gray-500">Loading payment form…</p>
          )}
        </div>

        {/* Right side - summary */}
        <div className="bg-white p-8 rounded-2xl shadow-lg h-fit">
          <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {items.map((i) => (
                <div key={i._id} className="flex justify-between border-b pb-2">
                  <span>
                    {i.name} × {i.quantity}
                  </span>
                  <span>${(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({TAX_RATE * 100}%)</span>
                <span>${(subtotal * TAX_RATE).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(subtotal * (1 + TAX_RATE)).toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
