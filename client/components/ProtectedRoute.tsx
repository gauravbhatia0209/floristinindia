import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
  const { isAuthenticated, isAdmin, isLoading, checkSession } = useAuth();
  const location = useLocation();

  // Remove the useEffect that was causing infinite loops
  // Session is already checked in AuthProvider on mount

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Handle authentication requirements
  if (requireAuth && !isAuthenticated) {
    // Store the attempted location for redirect after login
    return (
      <Navigate
        to={redirectTo || "/login"}
        state={{ from: location }}
        replace
      />
    );
  }

  // Handle admin requirements
  if (requireAdmin && !isAdmin) {
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
