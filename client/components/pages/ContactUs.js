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
exports.default = ContactUs;
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var textarea_1 = require("@/components/ui/textarea");
var card_1 = require("@/components/ui/card");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("@/lib/supabase");
function ContactUs(_a) {
    var pageContent = _a.pageContent;
    var _b = (0, react_1.useState)({}), siteSettings = _b[0], setSiteSettings = _b[1];
    var _c = (0, react_1.useState)(true), isLoading = _c[0], setIsLoading = _c[1];
    var _d = (0, react_1.useState)({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    }), formData = _d[0], setFormData = _d[1];
    var _e = (0, react_1.useState)(false), isSubmitting = _e[0], setIsSubmitting = _e[1];
    var _f = (0, react_1.useState)(""), submitMessage = _f[0], setSubmitMessage = _f[1];
    (0, react_1.useEffect)(function () {
        fetchSiteSettings();
    }, []);
    function fetchSiteSettings() {
        return __awaiter(this, void 0, void 0, function () {
            var data, settings, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("site_settings")
                                .select("key, value")
                                .in("key", [
                                "business_name",
                                "contact_phone",
                                "contact_phone_2",
                                "contact_email",
                                "contact_address",
                                "business_hours",
                                "google_maps_embed",
                            ])];
                    case 1:
                        data = (_a.sent()).data;
                        if (data) {
                            settings = data.reduce(function (acc, setting) {
                                acc[setting.key] = setting.value;
                                return acc;
                            }, {});
                            setSiteSettings(settings);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Failed to fetch site settings:", error_1);
                        return [3 /*break*/, 4];
                    case 3:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function validateForm() {
        if (!formData.name.trim()) {
            return "Name is required";
        }
        if (formData.name.trim().length < 2) {
            return "Name must be at least 2 characters long";
        }
        if (!formData.email.trim()) {
            return "Email is required";
        }
        // Better email validation
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
            return "Please enter a valid email address";
        }
        if (!formData.message.trim()) {
            return "Message is required";
        }
        if (formData.message.trim().length < 10) {
            return "Message must be at least 10 characters long";
        }
        return null;
    }
    function handleSubmit(e) {
        return __awaiter(this, void 0, void 0, function () {
            var validationError, _a, data, error, error_2, errorMessage;
            var _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        e.preventDefault();
                        validationError = validateForm();
                        if (validationError) {
                            setSubmitMessage(validationError);
                            return [2 /*return*/];
                        }
                        setIsSubmitting(true);
                        setSubmitMessage("");
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, supabase_1.supabase
                                .from("contact_submissions")
                                .insert([
                                {
                                    name: formData.name.trim(),
                                    email: formData.email.trim(),
                                    phone: formData.phone.trim() || null,
                                    subject: formData.subject.trim() || "Contact Form Submission",
                                    message: formData.message.trim(),
                                    is_read: false,
                                },
                            ])
                                .select()];
                    case 2:
                        _a = _d.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error("Supabase error details:", error);
                            // Handle specific Supabase errors
                            if (error.code === "42P01" ||
                                ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes("relation")) ||
                                ((_c = error.message) === null || _c === void 0 ? void 0 : _c.includes("does not exist"))) {
                                throw new Error("Contact form is not set up yet. Please contact the administrator to enable the contact form functionality.");
                            }
                            else if (error.code === "23505") {
                                throw new Error("Duplicate submission detected. Please try again.");
                            }
                            else if (error.code === "42501") {
                                throw new Error("Permission denied. Please contact administrator.");
                            }
                            else if (error.message) {
                                throw new Error("Database error: ".concat(error.message));
                            }
                            else {
                                throw new Error("Failed to save your message. Please try again.");
                            }
                        }
                        if (!data || data.length === 0) {
                            throw new Error("No data returned from database. Please try again.");
                        }
                        setSubmitMessage("✅ Thank you! Your message has been received. We'll get back to you soon.");
                        // Clear form after successful submission
                        setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            subject: "",
                            message: "",
                        });
                        return [3 /*break*/, 5];
                    case 3:
                        error_2 = _d.sent();
                        console.error("Form submission error:", error_2);
                        errorMessage = "Sorry, something went wrong. Please try again.";
                        if (error_2.message) {
                            errorMessage = error_2.message;
                        }
                        else if (error_2.code) {
                            errorMessage = "Error ".concat(error_2.code, ": Please contact support.");
                        }
                        setSubmitMessage("\u274C ".concat(errorMessage));
                        return [3 /*break*/, 5];
                    case 4:
                        setIsSubmitting(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    if (isLoading) {
        return (<div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>);
    }
    // Format business hours properly
    function formatBusinessHours(hours) {
        try {
            // Try to parse if it's JSON
            var parsed = JSON.parse(hours);
            if (typeof parsed === "object") {
                return Object.entries(parsed)
                    .map(function (_a) {
                    var day = _a[0], time = _a[1];
                    // Capitalize the first letter of the day name
                    var capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
                    return "".concat(capitalizedDay, ": ").concat(time);
                })
                    .join("\n");
            }
        }
        catch (_a) {
            // If not JSON, return as is
        }
        return hours;
    }
    // Render structured content blocks
    var renderContentBlocks = function (content) {
        if (!content) {
            return null;
        }
        // Handle string content (legacy HTML)
        if (typeof content === "string") {
            return (<div className="prose prose-lg max-w-none text-center" dangerouslySetInnerHTML={{ __html: content }}/>);
        }
        // Handle structured content with blocks
        if (content.blocks && Array.isArray(content.blocks)) {
            return content.blocks.map(function (block, index) {
                var _a, _b;
                // Safety check - ensure block exists and has proper structure
                if (!block || typeof block !== "object") {
                    return null;
                }
                switch (block.type) {
                    case "heading":
                        var headingContent = typeof block.content === "string"
                            ? block.content
                            : typeof block.content === "object" && block.content
                                ? block.content.text ||
                                    block.content.title ||
                                    JSON.stringify(block.content)
                                : "";
                        return (<h2 key={index} className="text-2xl font-bold text-center mb-6">
                {headingContent}
              </h2>);
                    case "text":
                    case "paragraph":
                        var textContent = typeof block.content === "string"
                            ? block.content
                            : typeof block.content === "object" && block.content
                                ? JSON.stringify(block.content)
                                : "";
                        return (<p key={index} className="text-lg text-gray-600 text-center mb-4">
                {textContent}
              </p>);
                    case "image":
                        return (<img key={index} src={block.url || block.content} alt={block.alt || ""} className="w-full max-w-2xl mx-auto rounded-lg mb-6"/>);
                    case "form":
                        // For form blocks, we'll use our existing contact form
                        // but could be extended to render custom forms from block.form_config
                        var formTitle = typeof block.title === "string"
                            ? block.title
                            : typeof block.content === "object" && ((_a = block.content) === null || _a === void 0 ? void 0 : _a.title)
                                ? block.content.title
                                : "Contact Form";
                        var formDescription = typeof block.description === "string"
                            ? block.description
                            : typeof block.content === "object" &&
                                ((_b = block.content) === null || _b === void 0 ? void 0 : _b.description)
                                ? block.content.description
                                : "Use the contact form below to get in touch with us.";
                        return (<div key={index} className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">{formTitle}</h3>
                <p className="text-gray-600">{formDescription}</p>
              </div>);
                    case "contact_info":
                        // Handle contact info block with object data
                        if (typeof block.content === "object" && block.content) {
                            return (<div key={index} className="text-center mb-6">
                  {block.content.email && (<p className="mb-2">
                      <strong>Email:</strong> {block.content.email}
                    </p>)}
                  {block.content.phone && (<p className="mb-2">
                      <strong>Phone:</strong> {block.content.phone}
                    </p>)}
                  {block.content.address && (<p className="mb-2">
                      <strong>Address:</strong> {block.content.address}
                    </p>)}
                  {block.content.hours && (<p className="mb-2">
                      <strong>Hours:</strong> {block.content.hours}
                    </p>)}
                </div>);
                        }
                        return null;
                    default:
                        return (<div key={index} className="text-center mb-4">
                {typeof block.content === "string" ? block.content : ""}
              </div>);
                }
            });
        }
        // Fallback for other object types
        return (<div className="text-center text-gray-600">
        <p>Contact information will be updated soon.</p>
      </div>);
    };
    return (<div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We'd love to hear from you! Get in touch and we'll respond as soon
              as possible.
            </p>
          </div>

          {/* Page Content from CMS */}
          {pageContent && (<div className="mb-12 max-w-4xl mx-auto">
              <p />
            </div>)}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Section - Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              {/* Business Hours */}
              {siteSettings.business_hours && (<card_1.Card>
                  <card_1.CardHeader>
                    <card_1.CardTitle className="flex items-center gap-2">
                      <lucide_react_1.Clock className="h-5 w-5 text-primary"/>
                      Business Hours
                    </card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <div className="whitespace-pre-line text-gray-700">
                      {formatBusinessHours(siteSettings.business_hours)}
                    </div>
                  </card_1.CardContent>
                </card_1.Card>)}

              {/* Store Address */}
              {siteSettings.contact_address && (<card_1.Card>
                  <card_1.CardHeader>
                    <card_1.CardTitle className="flex items-center gap-2">
                      <lucide_react_1.MapPin className="h-5 w-5 text-primary"/>
                      Store Address
                    </card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {siteSettings.contact_address}
                    </p>
                  </card_1.CardContent>
                </card_1.Card>)}

              {/* Contact Numbers */}
              {(siteSettings.contact_phone || siteSettings.contact_phone_2) && (<card_1.Card>
                  <card_1.CardHeader>
                    <card_1.CardTitle className="flex items-center gap-2">
                      <lucide_react_1.Phone className="h-5 w-5 text-primary"/>
                      Contact Numbers
                    </card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent className="space-y-2">
                    {siteSettings.contact_phone && (<div>
                        <a href={"tel:".concat(siteSettings.contact_phone)} className="text-lg font-medium text-primary hover:underline">
                          {siteSettings.contact_phone}
                        </a>
                        <p className="text-sm text-gray-500">Primary</p>
                      </div>)}
                    {siteSettings.contact_phone_2 && (<div>
                        <a href={"tel:".concat(siteSettings.contact_phone_2)} className="text-lg font-medium text-primary hover:underline">
                          {siteSettings.contact_phone_2}
                        </a>
                        <p className="text-sm text-gray-500">Secondary</p>
                      </div>)}
                  </card_1.CardContent>
                </card_1.Card>)}

              {/* Email */}
              {siteSettings.contact_email && (<card_1.Card>
                  <card_1.CardHeader>
                    <card_1.CardTitle className="flex items-center gap-2">
                      <lucide_react_1.Mail className="h-5 w-5 text-primary"/>
                      Email ID
                    </card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent>
                    <a href={"mailto:".concat(siteSettings.contact_email)} className="text-lg font-medium text-primary hover:underline">
                      {siteSettings.contact_email}
                    </a>
                  </card_1.CardContent>
                </card_1.Card>)}

              {/* Google Maps */}
              {siteSettings.google_maps_embed && (<card_1.Card>
                  <card_1.CardHeader>
                    <card_1.CardTitle>Find Us</card_1.CardTitle>
                  </card_1.CardHeader>
                  <card_1.CardContent className="p-0">
                    <div className="w-full h-64 rounded-b-lg overflow-hidden" dangerouslySetInnerHTML={{
                __html: siteSettings.google_maps_embed,
            }}/>
                  </card_1.CardContent>
                </card_1.Card>)}
            </div>

            {/* Right Section - Contact Form */}
            <div className="lg:col-span-2">
              <card_1.Card>
                <card_1.CardHeader>
                  <card_1.CardTitle className="text-2xl">Send us a Message</card_1.CardTitle>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you within 24
                    hours.
                  </p>
                </card_1.CardHeader>
                <card_1.CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input_1.Input placeholder="Enter your full name" value={formData.name} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { name: e.target.value }));
        }} className="h-12" required/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input_1.Input type="email" placeholder="Enter your email address" value={formData.email} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { email: e.target.value }));
        }} className="h-12" required/>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input_1.Input type="tel" placeholder="Enter your phone number" value={formData.phone} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { phone: e.target.value }));
        }} className="h-12"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <input_1.Input placeholder="Enter message subject" value={formData.subject} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { subject: e.target.value }));
        }} className="h-12"/>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea_1.Textarea placeholder="Enter your message here..." rows={6} value={formData.message} onChange={function (e) {
            return setFormData(__assign(__assign({}, formData), { message: e.target.value }));
        }} required/>
                    </div>

                    <button_1.Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                      {isSubmitting ? "Sending Message..." : "Send Message"}
                    </button_1.Button>

                    {submitMessage && (<div className={"p-4 rounded-lg font-medium ".concat(submitMessage.includes("✅")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200")}>
                        {submitMessage}
                      </div>)}
                  </form>
                </card_1.CardContent>
              </card_1.Card>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
