import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { canViewModule, ModuleName } from "@/lib/permissionUtils";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PermissionGuardProps {
  requiredModule: ModuleName;
  children: React.ReactNode;
}

/**
 * Component that checks if user has permission to view a module
 * Shows access denied message if user doesn't have permission
 */
export default function PermissionGuard({
  requiredModule,
  children,
}: PermissionGuardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hasAccess = canViewModule(user?.permissions, requiredModule);

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              You don't have permission to access this page. Please contact an
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
