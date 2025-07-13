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
exports.default = AuthCallback;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var supabase_1 = require("@/lib/supabase");
var AuthContext_1 = require("@/contexts/AuthContext");
function AuthCallback() {
    var _this = this;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var checkSession = (0, AuthContext_1.useAuth)().checkSession;
    (0, react_1.useEffect)(function () {
        var handleAuthCallback = function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, data, error, user, existingCustomer, names, firstName, lastName, insertError, redirectTo, error_1;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, supabase_1.supabase.auth.getSession()];
                    case 1:
                        _a = _e.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error("Auth callback error:", error);
                            navigate("/login?error=auth_failed");
                            return [2 /*return*/];
                        }
                        if (!(data.session && data.session.user)) return [3 /*break*/, 6];
                        user = data.session.user;
                        return [4 /*yield*/, supabase_1.supabase
                                .from("customers")
                                .select("*")
                                .eq("email", user.email)
                                .single()];
                    case 2:
                        existingCustomer = (_e.sent()).data;
                        if (!!existingCustomer) return [3 /*break*/, 4];
                        names = ((_b = user.user_metadata.full_name) === null || _b === void 0 ? void 0 : _b.split(" ")) || [
                            ((_c = user.email) === null || _c === void 0 ? void 0 : _c.split("@")[0]) || "User",
                        ];
                        firstName = names[0];
                        lastName = names.length > 1 ? names.slice(1).join(" ") : "";
                        return [4 /*yield*/, supabase_1.supabase
                                .from("customers")
                                .insert({
                                first_name: firstName,
                                last_name: lastName || firstName,
                                name: user.user_metadata.full_name || firstName,
                                email: (_d = user.email) === null || _d === void 0 ? void 0 : _d.toLowerCase(),
                                is_active: true,
                                is_verified: true, // Google users are pre-verified
                                created_at: new Date().toISOString(),
                                updated_at: new Date().toISOString(),
                                auth_provider: "google",
                                provider_id: user.id,
                            })];
                    case 3:
                        insertError = (_e.sent()).error;
                        if (insertError) {
                            console.error("Error creating customer record:", insertError);
                        }
                        _e.label = 4;
                    case 4: 
                    // Update session
                    return [4 /*yield*/, checkSession()];
                    case 5:
                        // Update session
                        _e.sent();
                        redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
                        sessionStorage.removeItem("redirectAfterLogin");
                        navigate(redirectTo);
                        return [3 /*break*/, 7];
                    case 6:
                        navigate("/login");
                        _e.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_1 = _e.sent();
                        console.error("Auth callback error:", error_1);
                        navigate("/login?error=auth_failed");
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        handleAuthCallback();
    }, [navigate, checkSession]);
    return (<div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>);
}
