import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo,
}: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  // Temporary admin bypass for demonstration
  const adminBypass = localStorage.getItem("user_type") === "admin";

  // Show loading spinner while checking authentication (with timeout)
  if (isLoading && !adminBypass) {
    // Force timeout after 3 seconds to prevent infinite loading
    setTimeout(() => {
      if (isLoading && adminBypass) {
        window.location.reload();
      }
    }, 3000);

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Verifying access...</p>
          <p className="mt-1 text-sm text-gray-500">
            If this takes too long, try refreshing
          </p>
        </div>
      </div>
    );
  }

  // Handle authentication requirements (with admin bypass)
  if (requireAuth && !isAuthenticated && !adminBypass) {
    return <Navigate to={redirectTo || "/login"} replace />;
  }

  // Handle admin requirements (with admin bypass)
  if (requireAdmin && !isAdmin && !adminBypass) {
    // Redirect non-admin users
    return <Navigate to="/admin/login" replace />;
  }

  // Handle admin access (admins trying to access customer areas)
  if (requireAuth && isAuthenticated && isAdmin && !requireAdmin) {
    // Allow admins to access customer areas
    return <>{children}</>;
  }

  // Render the protected component
  return <>{children}</>;
}

// Higher-order component for admin routes
export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute
      requireAuth={true}
      requireAdmin={true}
      redirectTo="/admin/login"
    >
      {children}
    </ProtectedRoute>
  );
}

// Higher-order component for customer routes
export function CustomerRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAuth={true} requireAdmin={false}>
      {children}
    </ProtectedRoute>
  );
}

// Component for routes that should redirect if already authenticated
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
  }

  return <>{children}</>;
}
