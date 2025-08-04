import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface AdminSecurityWrapperProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean; // For super admin only features
}

/**
 * Additional security layer for admin pages
 * Verifies admin access and can restrict certain features to super admins only
 */
export default function AdminSecurityWrapper({ 
  children, 
  requireSuperAdmin = false 
}: AdminSecurityWrapperProps) {
  const { user, hasAdminAccess, isSuperAdmin, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't check while loading
    if (isLoading) return;

    // Check if user has admin access
    if (!hasAdminAccess || !user) {
      console.warn("🚫 Security: Unauthorized access attempt to admin panel");
      logout();
      navigate("/admin/login", { replace: true });
      return;
    }

    // Check super admin requirement
    if (requireSuperAdmin && !isSuperAdmin) {
      console.warn(`🚫 Security: User ${user.email} attempted to access super admin feature without privileges`);
      navigate("/admin", { replace: true });
      return;
    }

    // Log successful admin access
    console.log(`✅ Security: Admin access verified for ${user.email} (role: ${user.role})`);
  }, [user, hasAdminAccess, isSuperAdmin, isLoading, requireSuperAdmin, logout, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Show access denied for super admin features
  if (requireSuperAdmin && !isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">👑</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Super Admin Required</h1>
          <p className="text-gray-600 mb-6">
            This feature requires super administrator privileges.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Contact your system administrator to request super admin access.
          </p>
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Back to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Render children if all security checks pass
  return <>{children}</>;
}
