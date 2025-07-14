import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const CheckoutSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentIntent = searchParams.get("payment_intent");
  const orderNumber = searchParams.get("order_number");

  useEffect(() => {
    // If we have an order number, redirect to proper confirmation page
    if (orderNumber) {
      navigate(`/order-confirmation/${orderNumber}`, { replace: true });
    }
  }, [orderNumber, navigate]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="text-center shadow-lg">
        <CardContent className="pt-12 pb-8">
          <div className="text-green-500 text-6xl mb-6">
            <CheckCircle className="w-16 h-16 mx-auto" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>

          <p className="text-gray-600 mb-8">
            Thank you for your order. Your payment has been processed
            successfully.
          </p>

          {paymentIntent && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Payment Reference</p>
              <p className="font-mono text-sm font-semibold break-all">
                {paymentIntent}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/orders")}
              className="w-full bg-pink-600 hover:bg-pink-700"
            >
              View Your Orders
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutSuccess;
