import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    badge: "24",
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
    badge: "3",
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
    name: "Homepage",
    href: "/admin/homepage",
    icon: Home,
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
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0">
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
              <Link
                to="/"
                className="text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                View Website
              </Link>
              <Button variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function AdminSidebar() {
  const location = useLocation();

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
              {navigation.map((item) => {
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
