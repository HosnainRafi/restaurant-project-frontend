import { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

export default function CheckoutForm({ clientSecret, onSuccessfulCheckout }) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // This is where the user will be redirected after payment.
        // For this app, we'll handle success in the same page.
      },
      redirect: "if_required", // Prevents immediate redirection
    });

    if (error) {
      toast.error(error.message);
    } else {
      // Payment was successful!
      // Now, call the function to submit the order to your own backend.
      onSuccessfulCheckout();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={isProcessing || !stripe || !elements}
        className="mt-8 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
