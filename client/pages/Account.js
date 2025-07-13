"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.default = Account;
var react_1 = require("react");
var AuthContext_1 = require("@/contexts/AuthContext");
var react_router_dom_1 = require("react-router-dom");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var tabs_1 = require("@/components/ui/tabs");
var alert_1 = require("@/components/ui/alert");
var lucide_react_1 = require("lucide-react");
function Account() {
    var _this = this;
    var _a = (0, AuthContext_1.useAuth)(), user = _a.user, isAuthenticated = _a.isAuthenticated, isAdmin = _a.isAdmin, logout = _a.logout, updateProfile = _a.updateProfile;
    var _b = (0, react_router_dom_1.useSearchParams)(), searchParams = _b[0], setSearchParams = _b[1];
    var _c = (0, react_1.useState)(false), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)(""), message = _d[0], setMessage = _d[1];
    var _e = (0, react_1.useState)({
        name: "",
        email: "",
        phone: "",
    }), profileData = _e[0], setProfileData = _e[1];
    var activeTab = searchParams.get("tab") || "profile";
    (0, react_1.useEffect)(function () {
        if (user) {
            setProfileData({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
            });
        }
    }, [user]);
    // Redirect non-authenticated users to login
    if (!isAuthenticated) {
        return <react_router_dom_1.Navigate to="/login" replace/>;
    }
    // Redirect admins to admin panel
    if (isAdmin) {
        return <react_router_dom_1.Navigate to="/admin" replace/>;
    }
    var handleProfileUpdate = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setIsLoading(true);
                    setMessage("");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, updateProfile({
                            name: profileData.name,
                            phone: profileData.phone,
                        })];
                case 2:
                    result = _a.sent();
                    if (result.success) {
                        setMessage("Profile updated successfully!");
                    }
                    else {
                        setMessage("Failed to update profile: " + (result.error || "Unknown error"));
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    setMessage("An error occurred while updating profile");
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleLogout = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, logout()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return (<div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <tabs_1.Tabs value={activeTab} onValueChange={function (value) { return setSearchParams({ tab: value }); }} className="space-y-6">
        <tabs_1.TabsList className="grid w-full grid-cols-5">
          <tabs_1.TabsTrigger value="profile" className="flex items-center gap-2">
            <lucide_react_1.User className="h-4 w-4"/>
            Profile
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="orders" className="flex items-center gap-2">
            <lucide_react_1.Package className="h-4 w-4"/>
            Orders
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="wishlist" className="flex items-center gap-2">
            <lucide_react_1.Heart className="h-4 w-4"/>
            Wishlist
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="addresses" className="flex items-center gap-2">
            <lucide_react_1.MapPin className="h-4 w-4"/>
            Addresses
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="settings" className="flex items-center gap-2">
            <lucide_react_1.Shield className="h-4 w-4"/>
            Settings
          </tabs_1.TabsTrigger>
        </tabs_1.TabsList>

        <tabs_1.TabsContent value="profile">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center gap-2">
                <lucide_react_1.User className="h-5 w-5"/>
                Profile Information
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              {message && (<alert_1.Alert className="mb-4">
                  <alert_1.AlertDescription>{message}</alert_1.AlertDescription>
                </alert_1.Alert>)}

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label_1.Label htmlFor="name">Full Name</label_1.Label>
                    <input_1.Input id="name" type="text" value={profileData.name} onChange={function (e) {
            return setProfileData(__assign(__assign({}, profileData), { name: e.target.value }));
        }} required/>
                  </div>

                  <div>
                    <label_1.Label htmlFor="email">Email Address</label_1.Label>
                    <input_1.Input id="email" type="email" value={profileData.email} disabled className="bg-gray-50"/>
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label_1.Label htmlFor="phone">Phone Number</label_1.Label>
                    <input_1.Input id="phone" type="tel" value={profileData.phone} onChange={function (e) {
            return setProfileData(__assign(__assign({}, profileData), { phone: e.target.value }));
        }} placeholder="+91 XXXXX XXXXX"/>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button_1.Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Profile"}
                  </button_1.Button>
                  <button_1.Button type="button" variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                    <lucide_react_1.LogOut className="h-4 w-4"/>
                    Logout
                  </button_1.Button>
                </div>
              </form>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="orders">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center gap-2">
                <lucide_react_1.Package className="h-5 w-5"/>
                Order History
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-center py-8">
                <lucide_react_1.Package className="h-12 w-12 mx-auto text-gray-400 mb-4"/>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-600 mb-4">
                  You haven't placed any orders yet.
                </p>
                <button_1.Button asChild>
                  <a href="/products">Start Shopping</a>
                </button_1.Button>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="wishlist">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center gap-2">
                <lucide_react_1.Heart className="h-5 w-5"/>
                My Wishlist
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-center py-8">
                <lucide_react_1.Heart className="h-12 w-12 mx-auto text-gray-400 mb-4"/>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-600 mb-4">
                  Save items you love for later.
                </p>
                <button_1.Button asChild>
                  <a href="/products">Browse Products</a>
                </button_1.Button>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="addresses">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center gap-2">
                <lucide_react_1.MapPin className="h-5 w-5"/>
                Saved Addresses
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="text-center py-8">
                <lucide_react_1.MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4"/>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No saved addresses
                </h3>
                <p className="text-gray-600 mb-4">
                  Add addresses for faster checkout.
                </p>
                <button_1.Button>Add Address</button_1.Button>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>

        <tabs_1.TabsContent value="settings">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="flex items-center gap-2">
                <lucide_react_1.Shield className="h-5 w-5"/>
                Account Settings
              </card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-600">
                    Receive updates about your orders
                  </p>
                </div>
                <button_1.Button variant="outline" size="sm">
                  Manage
                </button_1.Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Privacy Settings</h3>
                  <p className="text-sm text-gray-600">
                    Control your data and privacy
                  </p>
                </div>
                <button_1.Button variant="outline" size="sm">
                  Manage
                </button_1.Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-gray-600">
                    Update your account password
                  </p>
                </div>
                <button_1.Button variant="outline" size="sm">
                  Change
                </button_1.Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
                <div>
                  <h3 className="font-medium text-red-600">Delete Account</h3>
                  <p className="text-sm text-gray-600">
                    Permanently remove your account
                  </p>
                </div>
                <button_1.Button variant="destructive" size="sm">
                  Delete
                </button_1.Button>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
}
