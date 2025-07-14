import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function PaymentGatewayConfigSimple() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Gateway Configuration
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure payment gateways to accept payments from customers
        </p>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>
            Payment gateway configuration is being set up. Please run the
            database migration first:
            <br />
            <br />
            <code className="bg-gray-100 p-2 rounded block mt-2">
              -- Run database-payment-schema.sql in your Supabase SQL editor
            </code>
            <br />
            <strong>Available Payment Gateways:</strong>
            <ul className="list-disc ml-6 mt-2">
              <li>PhonePe - UPI, Cards, Wallets & NetBanking</li>
              <li>Razorpay - Cards, UPI, Wallets & NetBanking</li>
              <li>Cashfree - All payment methods</li>
              <li>PayPal - International payments</li>
            </ul>
            <br />
            After running the migration, this interface will provide full
            gateway configuration options.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
