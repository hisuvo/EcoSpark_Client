"use client";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "sonner";

export default function PaymentForm({ ideaId = 12 }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // 1. create intent
    const res = await fetch(`/api/payment/${ideaId}`, {
      method: "POST",
    });

    const { data } = await res.json();

    // 2. confirm payment
    const result = await stripe?.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: elements!.getElement(CardElement)!,
      },
    });

    if (result?.error) {
      console.error(result.error.message);
      toast.error("Payment faile");
    } else {
      toast.success("Payment success");
      window.location.reload();
    }

    setLoading(false);
  };

  return (
    <div>
      <CardElement />
      <button onClick={handleSubmit} disabled={loading}>
        Pay Now
      </button>
    </div>
  );
}
