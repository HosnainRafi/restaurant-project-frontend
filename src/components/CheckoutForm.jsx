// import { useEffect, useState } from "react";
// import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
// import toast from "react-hot-toast";

// const CheckoutForm = ({ clientSecret, onSuccessfulCheckout }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState(null);

//   // Check payment status if redirected back (for 3DS, wallets, etc.)
//   useEffect(() => {
//     if (!stripe || !clientSecret) return;

//     let cancelled = false;

//     (async () => {
//       const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
//       if (cancelled || !paymentIntent) return;

//       switch (paymentIntent.status) {
//         case "succeeded":
//           setMessage("Payment already completed.");
//           break;
//         case "processing":
//           setMessage("Your payment is processing.");
//           break;
//         case "requires_payment_method":
//           setMessage(null); // New attempt needed
//           break;
//         default:
//           setMessage("Something went wrong.");
//           break;
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, [stripe, clientSecret]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!stripe || !elements) return;

//     setIsLoading(true);
//     setMessage(null);

//     const { error, paymentIntent } = await stripe.confirmPayment({
//       elements,
//       redirect: "if_required", // only redirect if required (3D Secure, etc.)
//     });

//     setIsLoading(false);

//     if (error) {
//       toast.error(error.message || "Payment failed.");
//       setMessage(error.message || "Payment failed.");
//       return;
//     }

//     if (paymentIntent) {
//       if (paymentIntent.status === "succeeded") {
//         toast.success("Payment successful 🎉");
//         await onSuccessfulCheckout(); // call your CheckoutPage handler (saves order, clears cart, etc.)
//       } else if (paymentIntent.status === "processing") {
//         toast("Payment processing…");
//         await onSuccessfulCheckout();
//       } else {
//         setMessage(`Payment status: ${paymentIntent.status}`);
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <PaymentElement id="payment-element" />
//       {message && <p className="text-sm text-red-600">{message}</p>}
//       <button
//         type="submit"
//         disabled={isLoading || !stripe || !elements}
//         className="w-full bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-60"
//       >
//         {isLoading ? "Processing…" : "Pay Now"}
//       </button>
//       <p className="text-xs text-gray-500">
//         Payments are securely processed by Stripe.
//       </p>
//     </form>
//   );
// };

// export default CheckoutForm;

import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

const CheckoutForm = ({ clientSecret, onSuccessfulCheckout, isFormValid }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please complete your details first.");
      return;
    }

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message || "Payment failed.");
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      toast.success("Payment successful 🎉");
      await onSuccessfulCheckout();
    } else if (paymentIntent?.status === "processing") {
      toast("Payment processing…");
      await onSuccessfulCheckout();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Card Input */}
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />

      <button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-green-600 hover:bg-green-700 transition text-white px-4 py-3 rounded-lg font-semibold disabled:opacity-60"
      >
        {isLoading ? "Processing…" : "Pay Securely"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        💳 Payments are processed securely by Stripe.
      </p>
    </form>
  );
};

export default CheckoutForm;
