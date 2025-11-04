import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminSecurityWrapper from "@/components/AdminSecurityWrapper";
import { canAccessNav, isAdminOnlyPage } from "@/lib/permissionUtils";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Ticket,
  Truck,
  FileText,
  Home,
  Settings,
  UserCog,
  Mail,
  LogOut,
  Menu,
  X,
  Layers,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Badge } from "@/components/ui/badge";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Coupons",
    href: "/admin/coupons",
    icon: Ticket,
  },
  {
    name: "Shipping",
    href: "/admin/shipping",
    icon: Truck,
  },
  {
    name: "Pages",
    href: "/admin/pages",
    icon: FileText,
  },
  {
    name: "Footer Editor",
    href: "/admin/footer-editor",
    icon: Layers,
  },
  {
    name: "Homepage",
    href: "/admin/homepage",
    icon: Home,
  },
  {
    name: "Menu Bar",
    href: "/admin/menu-bar",
    icon: Menu,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: UserCog,
  },
  {
    name: "Contact Forms",
    href: "/admin/contact-submissions",
    icon: Mail,
  },
  {
    name: "Email Templates",
    href: "/admin/email-templates",
    icon: Mail,
  },
  {
    name: "Database Setup",
    href: "/admin/database-setup",
    icon: Settings,
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        await logout();
        navigate("/admin/login");
      } catch (error) {
        console.error("Logout failed:", error);
        // Force logout anyway
        localStorage.removeItem("session_token");
        localStorage.removeItem("user_type");
        navigate("/admin/login");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <VisuallyHidden>
            <SheetTitle>Admin Navigation</SheetTitle>
          </VisuallyHidden>
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {navigation.find((item) => item.href === location.pathname)
                  ?.name || "Admin Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* User Role Badge */}
              <div className="hidden sm:flex items-center gap-x-2">
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user?.role === "super_admin"
                      ? "bg-purple-100 text-purple-800 border border-purple-200"
                      : "bg-blue-100 text-blue-800 border border-blue-200"
                  }`}
                >
                  {user?.role === "super_admin" ? "👑 Super Admin" : "⚡ Admin"}
                </div>
                <span className="text-sm text-gray-500">{user?.name}</span>
              </div>

              <Link
                to="/"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                View Website
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <AdminSecurityWrapper>
              <Outlet />
            </AdminSecurityWrapper>
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminSidebar() {
  const location = useLocation();
  const { user } = useAuth();

  // Filter navigation items based on user permissions and role
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const filteredNavigation = navigation.filter((item) => {
    // Admin-only pages require admin role
    if (isAdminOnlyPage(item.href) && !isAdmin) {
      return false;
    }
    // Check module-based permissions
    return canAccessNav(item.href, user?.permissions);
  });

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
      <div className="flex h-16 shrink-0 items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-rose rounded-full flex items-center justify-center">
            <span className="text-white font-bold">🌹</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient-rose">
              Florist Admin
            </h1>
            <p className="text-xs text-muted-foreground -mt-1">
              Content Management
            </p>
          </div>
        </div>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`
                        group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 items-center
                        ${
                          isActive
                            ? "bg-rose-50 text-rose-600"
                            : "text-gray-700 hover:text-rose-600 hover:bg-gray-50"
                        }
                      `}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "default" : "secondary"}
                          className="ml-auto text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}
