/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { createPaymentIntent } from "@/services/payment.service";

export default function PaymentForm({
  ideaId,
  onSuccess,
}: {
  ideaId: string;
  onSuccess?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    try {
      setLoading(true);

      // STEP 1: use service function
      const data = await createPaymentIntent(ideaId);
      const clientSecret = data?.data?.client_secret;

      if (!clientSecret) {
        throw new Error("Missing client secret");
      }

      if (!stripe || !elements) {
        throw new Error("Stripe not ready");
      }

      const card = elements.getElement(CardElement);

      if (!card) {
        throw new Error("Card not found");
      }

      // STEP 2: confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
        },
      });

      if (result.error) {
        console.error(result.error.message);
        toast.error("Payment failed");
      } else {
        toast.success("Payment successful");
        onSuccess?.();
      }
    } catch (err: any) {
      console.error(err.message);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 border p-4 rounded-xl bg-muted/30">
      <CardElement className="p-3 border rounded-md bg-white" />

      <Button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-amber-600 hover:bg-amber-700"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <DollarSign className="mr-2 h-4 w-4" />
            Pay Now
          </>
        )}
      </Button>
    </div>
  );
}
