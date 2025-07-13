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
exports.default = Signup;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var alert_1 = require("@/components/ui/alert");
var checkbox_1 = require("@/components/ui/checkbox");
var separator_1 = require("@/components/ui/separator");
var lucide_react_1 = require("lucide-react");
var AuthContext_1 = require("@/contexts/AuthContext");
function Signup() {
    var _this = this;
    var _a = (0, react_1.useState)({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    }), formData = _a[0], setFormData = _a[1];
    var _b = (0, react_1.useState)(false), showPassword = _b[0], setShowPassword = _b[1];
    var _c = (0, react_1.useState)(false), showConfirmPassword = _c[0], setShowConfirmPassword = _c[1];
    var _d = (0, react_1.useState)(false), acceptTerms = _d[0], setAcceptTerms = _d[1];
    var _e = (0, react_1.useState)(false), isLoading = _e[0], setIsLoading = _e[1];
    var _f = (0, react_1.useState)(""), error = _f[0], setError = _f[1];
    var _g = (0, react_1.useState)(false), success = _g[0], setSuccess = _g[1];
    var _h = (0, AuthContext_1.useAuth)(), signup = _h.signup, loginWithGoogle = _h.loginWithGoogle, isAuthenticated = _h.isAuthenticated, authLoading = _h.isLoading;
    var navigate = (0, react_router_dom_1.useNavigate)();
    (0, react_1.useEffect)(function () {
        if (isAuthenticated && !authLoading) {
            navigate("/");
        }
    }, [isAuthenticated, authLoading, navigate]);
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setError("");
                    // Validation
                    if (!formData.name ||
                        !formData.email ||
                        !formData.password ||
                        !formData.confirmPassword) {
                        setError("Please fill in all required fields");
                        return [2 /*return*/];
                    }
                    if (!isValidEmail(formData.email)) {
                        setError("Please enter a valid email address");
                        return [2 /*return*/];
                    }
                    if (!isValidName(formData.name)) {
                        setError("Please enter a valid name (2-50 characters)");
                        return [2 /*return*/];
                    }
                    if (formData.phone && !isValidPhone(formData.phone)) {
                        setError("Please enter a valid phone number");
                        return [2 /*return*/];
                    }
                    if (!isValidPassword(formData.password)) {
                        setError("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number");
                        return [2 /*return*/];
                    }
                    if (formData.password !== formData.confirmPassword) {
                        setError("Passwords do not match");
                        return [2 /*return*/];
                    }
                    if (!acceptTerms) {
                        setError("Please accept the Terms and Conditions to continue");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setIsLoading(true);
                    return [4 /*yield*/, signup({
                            name: formData.name.trim(),
                            email: formData.email.toLowerCase().trim(),
                            phone: formData.phone.trim() || undefined,
                            password: formData.password,
                            userType: "customer",
                        })];
                case 2:
                    result = _a.sent();
                    if (result.success) {
                        setSuccess(true);
                        // Reset form
                        setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            password: "",
                            confirmPassword: "",
                        });
                        setAcceptTerms(false);
                    }
                    else {
                        setError(result.error || "Account creation failed");
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    setError("An unexpected error occurred. Please try again.");
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var isValidEmail = function (email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    var isValidName = function (name) {
        return name.trim().length >= 2 && name.trim().length <= 50;
    };
    var isValidPhone = function (phone) {
        return /^[\+]?[0-9\s\-\(\)]{10,15}$/.test(phone);
    };
    var isValidPassword = function (password) {
        return (password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password));
    };
    var handleInputChange = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        if (error)
            setError("");
    };
    var handleGoogleSignup = function () { return __awaiter(_this, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setIsLoading(true);
                    setError("");
                    return [4 /*yield*/, loginWithGoogle()];
                case 1:
                    result = _a.sent();
                    if (!result.success) {
                        setError(result.error || "Google signup failed");
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_2 = _a.sent();
                    setError("Google signup failed. Please try again.");
                    return [3 /*break*/, 4];
                case 3:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var getPasswordStrength = function (password) {
        var strength = 0;
        if (password.length >= 8)
            strength++;
        if (/[A-Z]/.test(password))
            strength++;
        if (/[a-z]/.test(password))
            strength++;
        if (/[0-9]/.test(password))
            strength++;
        if (/[^A-Za-z0-9]/.test(password))
            strength++;
        return strength;
    };
    var getPasswordStrengthText = function (strength) {
        if (strength <= 1)
            return "Very weak";
        if (strength <= 2)
            return "Weak";
        if (strength <= 3)
            return "Fair";
        if (strength <= 4)
            return "Good";
        return "Strong";
    };
    var getPasswordStrengthColor = function (strength) {
        if (strength <= 1)
            return "text-red-600";
        if (strength <= 2)
            return "text-orange-600";
        if (strength <= 3)
            return "text-yellow-600";
        if (strength <= 4)
            return "text-blue-600";
        return "text-green-600";
    };
    if (authLoading) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>);
    }
    if (success) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <card_1.Card>
            <card_1.CardContent className="pt-6">
              <div className="text-center">
                <lucide_react_1.CheckCircle className="mx-auto h-12 w-12 text-green-600"/>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                  Account Created!
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Your account has been created successfully. You can now sign
                  in to start shopping.
                </p>
                <div className="mt-6 space-y-4">
                  <button_1.Button asChild className="w-full">
                    <react_router_dom_1.Link to="/login">Sign In Now</react_router_dom_1.Link>
                  </button_1.Button>
                  <button_1.Button asChild variant="outline" className="w-full">
                    <react_router_dom_1.Link to="/">Continue Shopping</react_router_dom_1.Link>
                  </button_1.Button>
                </div>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </div>);
    }
    return (<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <lucide_react_1.User className="mx-auto h-12 w-12 text-primary"/>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join us and enjoy a personalized shopping experience
          </p>
        </div>

        {/* Back to website link */}
        <div className="text-center">
          <react_router_dom_1.Link to="/" className="inline-flex items-center text-sm text-primary hover:text-primary/80">
            <lucide_react_1.ArrowLeft className="w-4 h-4 mr-1"/>
            Continue shopping
          </react_router_dom_1.Link>
        </div>

        {/* Signup Form */}
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle className="text-center">Sign Up</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            {error && (<alert_1.Alert className="mb-4 border-red-200 bg-red-50">
                <lucide_react_1.AlertTriangle className="h-4 w-4 text-red-600"/>
                <alert_1.AlertDescription className="text-red-800">
                  {error}
                </alert_1.AlertDescription>
              </alert_1.Alert>)}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div>
                <label_1.Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </label_1.Label>
                <div className="relative mt-1">
                  <lucide_react_1.User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <input_1.Input id="name" type="text" value={formData.name} onChange={function (e) { return handleInputChange("name", e.target.value); }} placeholder="John Doe" className="pl-10" required autoComplete="name"/>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label_1.Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </label_1.Label>
                <div className="relative mt-1">
                  <lucide_react_1.Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <input_1.Input id="email" type="email" value={formData.email} onChange={function (e) { return handleInputChange("email", e.target.value); }} placeholder="your@email.com" className="pl-10" required autoComplete="email"/>
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label_1.Label htmlFor="phone">Phone Number (Optional)</label_1.Label>
                <div className="relative mt-1">
                  <lucide_react_1.Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <input_1.Input id="phone" type="tel" value={formData.phone} onChange={function (e) { return handleInputChange("phone", e.target.value); }} placeholder="+91 98765 43210" className="pl-10" autoComplete="tel"/>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label_1.Label htmlFor="password">
                  Password <span className="text-red-500">*</span>
                </label_1.Label>
                <div className="relative mt-1">
                  <lucide_react_1.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <input_1.Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={function (e) {
            return handleInputChange("password", e.target.value);
        }} placeholder="Create a strong password" className="pl-10 pr-10" required autoComplete="new-password"/>
                  <button type="button" onClick={function () { return setShowPassword(!showPassword); }} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? (<lucide_react_1.EyeOff className="h-4 w-4"/>) : (<lucide_react_1.Eye className="h-4 w-4"/>)}
                  </button>
                </div>
                {formData.password && (<div className="mt-1">
                    <div className="flex justify-between text-xs">
                      <span className={getPasswordStrengthColor(getPasswordStrength(formData.password))}>
                        Password strength:{" "}
                        {getPasswordStrengthText(getPasswordStrength(formData.password))}
                      </span>
                    </div>
                    <div className="mt-1 h-1 bg-gray-200 rounded">
                      <div className={"h-1 rounded transition-all duration-300 ".concat(getPasswordStrength(formData.password) <= 1
                ? "w-1/5 bg-red-600"
                : getPasswordStrength(formData.password) <= 2
                    ? "w-2/5 bg-orange-600"
                    : getPasswordStrength(formData.password) <= 3
                        ? "w-3/5 bg-yellow-600"
                        : getPasswordStrength(formData.password) <= 4
                            ? "w-4/5 bg-blue-600"
                            : "w-full bg-green-600")}></div>
                    </div>
                  </div>)}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label_1.Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-red-500">*</span>
                </label_1.Label>
                <div className="relative mt-1">
                  <lucide_react_1.Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                  <input_1.Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={function (e) {
            return handleInputChange("confirmPassword", e.target.value);
        }} placeholder="Confirm your password" className="pl-10 pr-10" required autoComplete="new-password"/>
                  <button type="button" onClick={function () { return setShowConfirmPassword(!showConfirmPassword); }} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? (<lucide_react_1.EyeOff className="h-4 w-4"/>) : (<lucide_react_1.Eye className="h-4 w-4"/>)}
                  </button>
                </div>
                {formData.confirmPassword &&
            formData.password !== formData.confirmPassword && (<p className="mt-1 text-xs text-red-600">
                      Passwords do not match
                    </p>)}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <checkbox_1.Checkbox id="terms" checked={acceptTerms} onCheckedChange={function (checked) {
            return setAcceptTerms(checked === true);
        }}/>
                <label_1.Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <react_router_dom_1.Link to="/terms" className="text-primary hover:text-primary/80">
                    Terms and Conditions
                  </react_router_dom_1.Link>{" "}
                  and{" "}
                  <react_router_dom_1.Link to="/privacy-policy" className="text-primary hover:text-primary/80">
                    Privacy Policy
                  </react_router_dom_1.Link>
                </label_1.Label>
              </div>

              {/* Submit Button */}
              <button_1.Button type="submit" className="w-full" disabled={isLoading} size="lg">
                {isLoading ? (<div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>) : ("Create Account")}
              </button_1.Button>
            </form>

            {/* Google Signup */}
            <div className="mt-6">
              <div className="relative">
                <separator_1.Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-2 text-sm text-gray-500">
                    or
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <button_1.Button type="button" variant="outline" className="w-full" onClick={handleGoogleSignup} disabled={isLoading} size="lg">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Sign up with Google
                </button_1.Button>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <react_router_dom_1.Link to="/login" className="font-medium text-primary hover:text-primary/80">
              Sign in here
            </react_router_dom_1.Link>
          </p>
        </div>
      </div>
    </div>);
}
