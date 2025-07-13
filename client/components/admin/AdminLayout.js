"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdminLayout;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var AuthContext_1 = require("@/contexts/AuthContext");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var sheet_1 = require("@/components/ui/sheet");
var react_visually_hidden_1 = require("@radix-ui/react-visually-hidden");
var badge_1 = require("@/components/ui/badge");
var navigation = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: lucide_react_1.LayoutDashboard,
    },
    {
        name: "Analytics",
        href: "/admin/analytics",
        icon: lucide_react_1.BarChart3,
    },
    {
        name: "Products",
        href: "/admin/products",
        icon: lucide_react_1.Package,
        badge: "24",
    },
    {
        name: "Categories",
        href: "/admin/categories",
        icon: lucide_react_1.Tags,
    },
    {
        name: "Orders",
        href: "/admin/orders",
        icon: lucide_react_1.ShoppingCart,
        badge: "3",
    },
    {
        name: "Customers",
        href: "/admin/customers",
        icon: lucide_react_1.Users,
    },
    {
        name: "Coupons",
        href: "/admin/coupons",
        icon: lucide_react_1.Ticket,
    },
    {
        name: "Shipping",
        href: "/admin/shipping",
        icon: lucide_react_1.Truck,
    },
    {
        name: "Pages",
        href: "/admin/pages",
        icon: lucide_react_1.FileText,
    },
    {
        name: "Footer Editor",
        href: "/admin/footer-editor",
        icon: lucide_react_1.Layers,
    },
    {
        name: "Homepage",
        href: "/admin/homepage",
        icon: lucide_react_1.Home,
    },
    {
        name: "Menu Bar",
        href: "/admin/menu-bar",
        icon: lucide_react_1.Menu,
    },
    {
        name: "Settings",
        href: "/admin/settings",
        icon: lucide_react_1.Settings,
    },
    {
        name: "Users",
        href: "/admin/users",
        icon: lucide_react_1.UserCog,
    },
    {
        name: "Contact Forms",
        href: "/admin/contact-submissions",
        icon: lucide_react_1.Mail,
    },
    {
        name: "Database Setup",
        href: "/admin/database-setup",
        icon: lucide_react_1.Settings,
    },
];
function AdminLayout() {
    var _this = this;
    var _a;
    var _b = (0, react_1.useState)(false), sidebarOpen = _b[0], setSidebarOpen = _b[1];
    var location = (0, react_router_dom_1.useLocation)();
    var navigate = (0, react_router_dom_1.useNavigate)();
    var logout = (0, AuthContext_1.useAuth)().logout;
    var handleLogout = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("Are you sure you want to logout?")) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, logout()];
                case 2:
                    _a.sent();
                    navigate("/admin/login");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Logout failed:", error_1);
                    // Force logout anyway
                    localStorage.removeItem("session_token");
                    localStorage.removeItem("user_type");
                    navigate("/admin/login");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <sheet_1.Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <sheet_1.SheetContent side="left" className="w-80 p-0">
          <react_visually_hidden_1.VisuallyHidden>
            <sheet_1.SheetTitle>Admin Navigation</sheet_1.SheetTitle>
          </react_visually_hidden_1.VisuallyHidden>
          <AdminSidebar />
        </sheet_1.SheetContent>
      </sheet_1.Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-80 lg:flex-col">
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button_1.Button variant="ghost" size="icon" className="lg:hidden" onClick={function () { return setSidebarOpen(true); }}>
            <lucide_react_1.Menu className="h-5 w-5"/>
          </button_1.Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {((_a = navigation.find(function (item) { return item.href === location.pathname; })) === null || _a === void 0 ? void 0 : _a.name) || "Admin Dashboard"}
              </h1>
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <react_router_dom_1.Link to="/" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                View Website
              </react_router_dom_1.Link>
              <button_1.Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <lucide_react_1.LogOut className="h-4 w-4"/>
              </button_1.Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <react_router_dom_1.Outlet />
          </div>
        </main>
      </div>
    </div>);
}
function AdminSidebar() {
    var location = (0, react_router_dom_1.useLocation)();
    return (<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
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
              {navigation.map(function (item) {
            var isActive = location.pathname === item.href;
            return (<li key={item.name}>
                    <react_router_dom_1.Link to={item.href} className={"\n                        group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 items-center\n                        ".concat(isActive
                    ? "bg-rose-50 text-rose-600"
                    : "text-gray-700 hover:text-rose-600 hover:bg-gray-50", "\n                      ")}>
                      <item.icon className="h-5 w-5 shrink-0"/>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (<badge_1.Badge variant={isActive ? "default" : "secondary"} className="ml-auto text-xs">
                          {item.badge}
                        </badge_1.Badge>)}
                    </react_router_dom_1.Link>
                  </li>);
        })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>);
}
