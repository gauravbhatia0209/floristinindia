import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PaymentGateway, PaymentIntent } from "@shared/payment.types";

interface PaymentProcessorProps {
  paymentIntentId: string;
  onSuccess: (paymentIntent: PaymentIntent) => void;
  onFailure: (error: string) => void;
  onCancel?: () => void;
}

interface PaymentStatus {
  success: boolean;
  payment_intent: PaymentIntent;
  gateway_status?: any;
  gateway_error?: string;
}

const GATEWAY_NAMES: Record<PaymentGateway, string> = {
  phonepe: "PhonePe",
  razorpay: "Razorpay",
  cashfree: "Cashfree",
  paypal: "PayPal",
};

const STATUS_CONFIGS = {
  pending: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: <Clock className="w-4 h-4" />,
    message: "Payment is being processed...",
  },
  processing: {
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: <Loader2 className="w-4 h-4 animate-spin" />,
    message: "Processing your payment...",
  },
  completed: {
    color: "bg-green-100 text-green-800 border-green-300",
    icon: <CheckCircle className="w-4 h-4" />,
    message: "Payment completed successfully!",
  },
  failed: {
    color: "bg-red-100 text-red-800 border-red-300",
    icon: <XCircle className="w-4 h-4" />,
    message: "Payment failed. Please try again.",
  },
  cancelled: {
    color: "bg-gray-100 text-gray-800 border-gray-300",
    icon: <XCircle className="w-4 h-4" />,
    message: "Payment was cancelled.",
  },
  refunded: {
    color: "bg-purple-100 text-purple-800 border-purple-300",
    icon: <CheckCircle className="w-4 h-4" />,
    message: "Payment has been refunded.",
  },
  partial_refund: {
    color: "bg-orange-100 text-orange-800 border-orange-300",
    icon: <CheckCircle className="w-4 h-4" />,
    message: "Payment has been partially refunded.",
  },
};

export default function PaymentProcessor({
  paymentIntentId,
  onSuccess,
  onFailure,
  onCancel,
}: PaymentProcessorProps) {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showQrCode, setShowQrCode] = useState(false);

  useEffect(() => {
    if (paymentIntentId) {
      checkPaymentStatus();

      // Set up polling for payment status updates
      const interval = setInterval(checkPaymentStatus, 3000);

      // Clear interval after 5 minutes to prevent infinite polling
      const timeout = setTimeout(() => {
        clearInterval(interval);
        if (paymentStatus?.payment_intent.status === "pending") {
          setError(
            "Payment verification timeout. Please check your payment status.",
          );
        }
      }, 300000); // 5 minutes

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [paymentIntentId, retryCount]);

  useEffect(() => {
    if (paymentStatus?.payment_intent) {
      const status = paymentStatus.payment_intent.status;

      if (status === "completed") {
        onSuccess(paymentStatus.payment_intent);
      } else if (status === "failed" || status === "cancelled") {
        onFailure(
          paymentStatus.payment_intent.error_message ||
            STATUS_CONFIGS[status].message,
        );
      }
    }
  }, [paymentStatus]);

  async function checkPaymentStatus() {
    try {
      setLoading(true);
      const response = await fetch(`/api/payments/status/${paymentIntentId}`);
      const data = await response.json();

      if (data.success) {
        setPaymentStatus(data);
        setError(null);
      } else {
        setError(data.error || "Failed to check payment status");
      }
    } catch (err) {
      setError("Failed to check payment status");
    } finally {
      setLoading(false);
    }
  }

  function handleRetry() {
    setError(null);
    setRetryCount((prev) => prev + 1);
  }

  function formatAmount(amountInPaise: number): string {
    return `₹${(amountInPaise / 100).toLocaleString()}`;
  }

  function getTimeDifference(timestamp: string): string {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    }
    return `${seconds}s ago`;
  }

  if (!paymentStatus && loading) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Retrieving payment information...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !paymentStatus) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="text-red-600">Payment Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Button onClick={handleRetry} variant="outline" className="flex-1">
              Retry
            </Button>
            {onCancel && (
              <Button onClick={onCancel} variant="outline" className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!paymentStatus) return null;

  const { payment_intent } = paymentStatus;
  const statusConfig = STATUS_CONFIGS[payment_intent.status];
  const gatewayName = GATEWAY_NAMES[payment_intent.gateway];

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment Status</span>
          <Badge className={statusConfig.color}>
            {statusConfig.icon}
            <span className="ml-1">{payment_intent.status.toUpperCase()}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount:</span>
            <span className="font-semibold">
              {formatAmount(payment_intent.amount)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Payment Method:
            </span>
            <span className="font-medium">{gatewayName}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Currency:</span>
            <span>{payment_intent.currency}</span>
          </div>

          {payment_intent.gateway_payment_id && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Transaction ID:
              </span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {payment_intent.gateway_payment_id}
              </code>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Created:</span>
            <span className="text-sm">
              {getTimeDifference(payment_intent.created_at)}
            </span>
          </div>
        </div>

        {/* Status Message */}
        <Alert className={statusConfig.color}>
          <AlertDescription className="flex items-center gap-2">
            {statusConfig.icon}
            {statusConfig.message}
          </AlertDescription>
        </Alert>

        {/* Error Message */}
        {payment_intent.error_message && (
          <Alert variant="destructive">
            <AlertDescription>
              <strong>Error:</strong> {payment_intent.error_message}
            </AlertDescription>
          </Alert>
        )}

        {/* Gateway Status Details */}
        {paymentStatus.gateway_status && (
          <div className="bg-gray-50 p-3 rounded border">
            <h4 className="text-sm font-medium mb-2">Gateway Details</h4>
            <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
              {JSON.stringify(paymentStatus.gateway_status, null, 2)}
            </pre>
          </div>
        )}

        {/* QR Code for UPI (if available) */}
        {payment_intent.metadata?.qr_code && showQrCode && (
          <div className="text-center">
            <img
              src={payment_intent.metadata.qr_code}
              alt="QR Code for payment"
              className="mx-auto max-w-48 border"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Scan this QR code with any UPI app to pay
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {payment_intent.status === "pending" && (
            <>
              <Button
                onClick={checkPaymentStatus}
                variant="outline"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Checking...
                  </>
                ) : (
                  "Check Status"
                )}
              </Button>

              {payment_intent.metadata?.qr_code && (
                <Button
                  onClick={() => setShowQrCode(!showQrCode)}
                  variant="outline"
                  className="w-full"
                >
                  {showQrCode ? "Hide" : "Show"} QR Code
                </Button>
              )}
            </>
          )}

          {payment_intent.status === "failed" && (
            <div className="flex gap-2">
              <Button onClick={handleRetry} className="flex-1">
                Try Again
              </Button>
              {onCancel && (
                <Button onClick={onCancel} variant="outline" className="flex-1">
                  Cancel
                </Button>
              )}
            </div>
          )}

          {payment_intent.status === "completed" && (
            <Button
              onClick={() => onSuccess(payment_intent)}
              className="w-full"
            >
              Continue
            </Button>
          )}

          {(payment_intent.status === "pending" ||
            payment_intent.status === "processing") &&
            onCancel && (
              <Button onClick={onCancel} variant="ghost" className="w-full">
                Cancel Payment
              </Button>
            )}
        </div>

        {/* Payment Gateway Link */}
        {payment_intent.metadata?.payment_url &&
          payment_intent.status === "pending" && (
            <div className="text-center">
              <Button
                asChild
                variant="link"
                className="text-blue-600 hover:text-blue-800"
              >
                <a
                  href={payment_intent.metadata.payment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open {gatewayName} Payment Page
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
          )}

        {/* Help Text */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          {payment_intent.status === "pending" && (
            <p>
              🔄 We're automatically checking your payment status every few
              seconds
            </p>
          )}
          <p>
            💡 If you face any issues, please contact our support team with
            transaction ID
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
