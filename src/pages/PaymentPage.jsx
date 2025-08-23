import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ImSpinner3 } from "react-icons/im";
import api from "@/lib/api";
import toast from "react-hot-toast";
import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await api.post("/payment/retry-payment-intent", {
          orderId,
        });
        setClientSecret(response.data.data.clientSecret);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Could not initialize payment."
        );
      } finally {
        setLoading(false);
      }
    };
    createPaymentIntent();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ImSpinner3 className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Payment Error</h2>
        <p className="text-gray-500">
          There was an issue preparing your payment.
        </p>
        <Link
          to="/dashboard/my-orders"
          className="mt-4 inline-block btn-primary"
        >
          Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-primary">
          Complete Your Payment
        </h2>
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <CheckoutForm
            clientSecret={clientSecret}
            onSuccessfulCheckout={() =>
              navigate("/customer/dashboard/my-orders")
            }
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;
