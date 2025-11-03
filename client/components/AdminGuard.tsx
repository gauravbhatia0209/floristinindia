import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Component that restricts access to admin-only pages
 * Users must have role "admin" or "super_admin"
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Admin Access Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              This page is only accessible to administrators. Please contact an
              administrator if you believe this is an error.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/admin")}
              className="text-red-700 border-red-200 hover:bg-red-50"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
