import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { ImSpinner3 } from "react-icons/im";

const CheckoutForm = ({ clientSecret, onSuccessfulCheckout }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required", // This is crucial to prevent unnecessary redirects
    });

    setIsLoading(false);

    if (error) {
      toast.error(error.message || "An unexpected error occurred.");
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      toast.success("Payment successful! 🎉");
      await onSuccessfulCheckout(); // This will clear cart and navigate
    } else {
      toast.error("Payment was not successful. Please try another card.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-primary text-white py-3 px-5 rounded-lg shadow-md hover:bg-primary-hover transition flex justify-center items-center mt-6"
      >
        {isLoading ? (
          <ImSpinner3 className="animate-spin" size={24} />
        ) : (
          `Pay Now`
        )}
      </button>
    </form>
  );
};

export default CheckoutForm;
