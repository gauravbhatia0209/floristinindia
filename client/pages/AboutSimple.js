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
exports.default = AboutSimple;
var react_1 = require("react");
var supabase_1 = require("@/lib/supabase");
function AboutSimple() {
    var _a = (0, react_1.useState)(null), pageData = _a[0], setPageData = _a[1];
    var _b = (0, react_1.useState)(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = (0, react_1.useState)(null), error = _c[0], setError = _c[1];
    (0, react_1.useEffect)(function () {
        fetchAboutPage();
    }, []);
    function fetchAboutPage() {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error_2, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("pages")
                                .select("*")
                                .eq("slug", "about")
                                .eq("is_active", true)
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error_2 = _a.error;
                        if (error_2) {
                            setError("Database error: ".concat(error_2.message));
                            console.error("Database error:", error_2);
                        }
                        else if (data) {
                            console.log("About page data loaded:", data);
                            setPageData(data);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _b.sent();
                        setError("Failed to fetch: ".concat(error_1.message));
                        console.error("Failed to fetch about page:", error_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    if (isLoading) {
        return (<div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        </div>
      </div>);
    }
    if (error) {
        return (<div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">About Us</h1>
          <div className="bg-red-50 border border-red-200 p-4 rounded mb-8">
            <p className="text-red-800">Database Error: {error}</p>
          </div>
          <p className="text-lg text-gray-600">
            Please set up the database tables using Admin → Database Setup
          </p>
        </div>
      </div>);
    }
    var renderContentBlocks = function (content) {
        if (!content || !content.blocks || !Array.isArray(content.blocks)) {
            return (<div className="max-w-3xl mx-auto p-4 text-center">
          <p className="text-base text-gray-700 mb-2">
            About Us content is being updated. Please check back soon.
          </p>
        </div>);
        }
        return content.blocks.map(function (block, index) {
            switch (block.type) {
                case "heading":
                    return (<h1 key={index} className="text-2xl font-bold mb-4">
              {block.content}
            </h1>);
                case "text":
                case "paragraph":
                    return (<p key={index} className="text-base text-gray-700 mb-2">
              {block.content}
            </p>);
                case "image":
                    return (<img key={index} src={block.url || block.content} alt={block.alt || ""} className="w-full max-w-md mx-auto rounded-lg mb-4"/>);
                case "button":
                    return (<a key={index} href={block.url || "#"} className="inline-block bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition-colors mb-4">
              {block.content || block.text}
            </a>);
                case "list":
                    return (<ul key={index} className="list-disc list-inside mb-4">
              {(block.items || []).map(function (item, itemIndex) { return (<li key={itemIndex} className="text-base text-gray-700 mb-1">
                  {item}
                </li>); })}
            </ul>);
                default:
                    return (<div key={index} className="text-base text-gray-700 mb-2">
              {block.content || ""}
            </div>);
            }
        });
    };
    return (<div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto p-4">
        {(pageData === null || pageData === void 0 ? void 0 : pageData.content) ? (renderContentBlocks(pageData.content)) : (<div>
            <h1 className="text-2xl font-bold mb-4">About Florist in India</h1>
            <p className="text-base text-gray-700 mb-2">
              We are your trusted destination for premium flower, cake, and gift
              delivery services across India. With a strong presence in over
              100+ cities including Delhi NCR, Mumbai, Bangalore, and Jalandhar,
              we ensure every celebration feels special—no matter the distance.
            </p>

            <h2 className="text-2xl font-bold mb-4">Why Choose Us</h2>
            <ul className="list-disc list-inside mb-4">
              <li className="text-base text-gray-700 mb-1">
                🌸 Same Day Flower Delivery
              </li>
              <li className="text-base text-gray-700 mb-1">
                📍 100+ Cities Covered
              </li>
              <li className="text-base text-gray-700 mb-1">
                💬 24/7 Customer Support
              </li>
              <li className="text-base text-gray-700 mb-1">
                💝 Custom Gift Combos
              </li>
              <li className="text-base text-gray-700 mb-1">
                💳 Secure Payments
              </li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-base text-gray-700 mb-2">
              We aim to connect emotions through fresh blooms. Whether it's a
              birthday, anniversary, wedding, or a simple "thinking of you"—we
              help you say it beautifully.
            </p>
          </div>)}
      </div>
    </div>);
}
