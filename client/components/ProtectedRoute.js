"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProtectedRoute;
exports.AdminRoute = AdminRoute;
exports.CustomerRoute = CustomerRoute;
exports.GuestRoute = GuestRoute;
var react_router_dom_1 = require("react-router-dom");
var AuthContext_1 = require("@/contexts/AuthContext");
function ProtectedRoute(_a) {
    var children = _a.children, _b = _a.requireAuth, requireAuth = _b === void 0 ? true : _b, _c = _a.requireAdmin, requireAdmin = _c === void 0 ? false : _c, redirectTo = _a.redirectTo;
    var _d = (0, AuthContext_1.useAuth)(), isAuthenticated = _d.isAuthenticated, isAdmin = _d.isAdmin, isLoading = _d.isLoading;
    // Temporary admin bypass for demonstration
    var adminBypass = localStorage.getItem("user_type") === "admin";
    // Show loading spinner while checking authentication (with timeout)
    if (isLoading && !adminBypass) {
        // Force timeout after 3 seconds to prevent infinite loading
        setTimeout(function () {
            if (isLoading && adminBypass) {
                window.location.reload();
            }
        }, 3000);
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Verifying access...</p>
          <p className="mt-1 text-sm text-gray-500">
            If this takes too long, try refreshing
          </p>
        </div>
      </div>);
    }
    // Handle authentication requirements (with admin bypass)
    if (requireAuth && !isAuthenticated && !adminBypass) {
        return <react_router_dom_1.Navigate to={redirectTo || "/login"} replace/>;
    }
    // Handle admin requirements (with admin bypass)
    if (requireAdmin && !isAdmin && !adminBypass) {
        // Redirect non-admin users
        return <react_router_dom_1.Navigate to="/admin/login" replace/>;
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
function AdminRoute(_a) {
    var children = _a.children;
    return (<ProtectedRoute requireAuth={true} requireAdmin={true} redirectTo="/admin/login">
      {children}
    </ProtectedRoute>);
}
// Higher-order component for customer routes
function CustomerRoute(_a) {
    var children = _a.children;
    return (<ProtectedRoute requireAuth={true} requireAdmin={false}>
      {children}
    </ProtectedRoute>);
}
// Component for routes that should redirect if already authenticated
function GuestRoute(_a) {
    var children = _a.children;
    var _b = (0, AuthContext_1.useAuth)(), isAuthenticated = _b.isAuthenticated, isAdmin = _b.isAdmin, isLoading = _b.isLoading;
    if (isLoading) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>);
    }
    // Redirect authenticated users
    if (isAuthenticated) {
        return <react_router_dom_1.Navigate to={isAdmin ? "/admin" : "/"} replace/>;
    }
    return <>{children}</>;
}
