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
exports.default = DatabaseSetup;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var badge_1 = require("@/components/ui/badge");
var lucide_react_1 = require("lucide-react");
var supabase_1 = require("@/lib/supabase");
function DatabaseSetup() {
    var _this = this;
    var _a = (0, react_1.useState)(null), copied = _a[0], setCopied = _a[1];
    var _b = (0, react_1.useState)(false), isClearing = _b[0], setIsClearing = _b[1];
    var _c = (0, react_1.useState)(false), clearSuccess = _c[0], setClearSuccess = _c[1];
    var _d = (0, react_1.useState)(false), isCreatingFooter = _d[0], setIsCreatingFooter = _d[1];
    var rlsFixSQL = "-- Fix RLS policies for pages table (run this if you get RLS errors)\n-- This allows public read access and authenticated user full access\n\n-- Drop existing policies if they exist\nDROP POLICY IF EXISTS \"Allow public read access for active pages\" ON pages;\nDROP POLICY IF EXISTS \"Allow authenticated full access\" ON pages;\n\n-- Create new policies\nCREATE POLICY \"Allow public read access for active pages\" ON pages\n  FOR SELECT USING (is_active = true);\n\nCREATE POLICY \"Allow authenticated full access\" ON pages\n  FOR ALL USING (auth.role() = 'authenticated');\n\n-- Alternative: Temporarily disable RLS for setup (re-enable after)\n-- ALTER TABLE pages DISABLE ROW LEVEL SECURITY;";
    var clearOldPages = function () { return __awaiter(_this, void 0, void 0, function () {
        var error, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    setIsClearing(true);
                    setClearSuccess(false);
                    return [4 /*yield*/, supabase_1.supabase
                            .from("pages")
                            .delete()
                            .in("slug", [
                            "about",
                            "help-center",
                            "returns",
                            "return-refunds",
                            "privacy",
                            "privacy-policy",
                            "terms",
                            "terms-conditions",
                            "delivery-info",
                        ])];
                case 1:
                    error = (_a.sent()).error;
                    if (!error) return [3 /*break*/, 2];
                    console.error("Error clearing pages:", error);
                    alert("Error clearing pages: " + error.message);
                    return [3 /*break*/, 4];
                case 2:
                    setClearSuccess(true);
                    alert("Page records cleared! Now creating new structured content...");
                    // Automatically rebuild pages after clearing
                    return [4 /*yield*/, rebuildAllPages()];
                case 3:
                    // Automatically rebuild pages after clearing
                    _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error("Error:", error_1);
                    alert("Error clearing pages");
                    return [3 /*break*/, 7];
                case 6:
                    setIsClearing(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var rebuildAllPages = function () { return __awaiter(_this, void 0, void 0, function () {
        var rpcError_1, pages, successCount, errorCount, errors, _i, pages_1, page, error, err_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 11, , 12]);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, supabase_1.supabase.rpc("create_pages_policy", {})];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    rpcError_1 = _a.sent();
                    // RPC might not exist, continue with normal insert
                    console.log("RPC call failed, continuing with direct insert");
                    return [3 /*break*/, 4];
                case 4:
                    pages = [
                        {
                            title: "About Florist in India",
                            slug: "about",
                            content: {
                                blocks: [
                                    {
                                        type: "hero_title",
                                        content: "About Florist in India",
                                    },
                                    {
                                        type: "hero_description",
                                        content: "Your trusted destination for premium flowers, cakes, and gifts delivered across India with love and care.",
                                    },
                                    {
                                        type: "story_section",
                                        title: "Our Story",
                                        content: "Founded with a passion for bringing people closer through beautiful flowers, Florist in India has been serving customers across the nation with fresh, premium quality flowers and thoughtful gifts. We believe every occasion deserves to be celebrated with the perfect floral arrangement.",
                                    },
                                    {
                                        type: "mission_section",
                                        title: "Our Mission",
                                        content: "To make every celebration special by delivering fresh, beautiful flowers and gifts that express your emotions perfectly. We strive to connect hearts and spread joy through our carefully curated floral arrangements.",
                                    },
                                    {
                                        type: "values_section",
                                        title: "Our Values",
                                        content: "Quality, freshness, and customer satisfaction are at the heart of everything we do. We source our flowers from the finest gardens and ensure they reach you in perfect condition.",
                                    },
                                ],
                            },
                            meta_title: "About Florist in India – Premium Flower Delivery",
                            meta_description: "Learn about Florist in India, your trusted partner for fresh flower delivery across 100+ Indian cities.",
                            is_active: true,
                            show_in_footer: true,
                            sort_order: 1,
                        },
                        {
                            title: "Help Center",
                            slug: "help-center",
                            content: {
                                blocks: [
                                    {
                                        type: "hero_title",
                                        content: "Help Center",
                                    },
                                    {
                                        type: "hero_description",
                                        content: "Find answers to your questions and get the support you need",
                                    },
                                    {
                                        type: "faq_category",
                                        category: "Ordering & Payment",
                                        items: [
                                            {
                                                question: "How do I place an order?",
                                                answer: "Simply browse our collection, select your preferred flowers, add to cart, and proceed to checkout. Enter delivery details and make payment to confirm your order.",
                                            },
                                            {
                                                question: "What payment methods do you accept?",
                                                answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets including Google Pay, PhonePe, and Paytm.",
                                            },
                                            {
                                                question: "Is my payment information secure?",
                                                answer: "Yes, all payments are processed through secure payment gateways with SSL encryption to protect your financial information.",
                                            },
                                        ],
                                    },
                                    {
                                        type: "faq_category",
                                        category: "Delivery Information",
                                        items: [
                                            {
                                                question: "Do you offer same-day delivery?",
                                                answer: "Yes, we offer same-day delivery for orders placed before 12 PM, subject to availability in your area.",
                                            },
                                            {
                                                question: "Which areas do you deliver to?",
                                                answer: "We deliver to 100+ cities across India. Enter your pincode during checkout to check delivery availability.",
                                            },
                                            {
                                                question: "What are your delivery timings?",
                                                answer: "We deliver between 9:00 AM to 9:00 PM on all days. For specific time slots, please contact our customer support.",
                                            },
                                        ],
                                    },
                                    {
                                        type: "faq_category",
                                        category: "Products & Quality",
                                        items: [
                                            {
                                                question: "How do you ensure flower freshness?",
                                                answer: "Our flowers are sourced daily from trusted gardens and stored in temperature-controlled environments. We guarantee freshness for at least 3-5 days.",
                                            },
                                            {
                                                question: "Can I customize my flower arrangement?",
                                                answer: "Yes, we offer custom arrangements. Contact our support team with your requirements, and we'll create something special for you.",
                                            },
                                        ],
                                    },
                                ],
                            },
                            meta_title: "Help Center - Customer Support & FAQ",
                            meta_description: "Get help with flower delivery orders. FAQs about ordering, payment, delivery and more.",
                            is_active: true,
                            show_in_footer: true,
                            sort_order: 2,
                        },
                        {
                            title: "Return & Refunds Policy",
                            slug: "return-refunds",
                            content: {
                                blocks: [
                                    {
                                        type: "hero_title",
                                        content: "Return & Refunds Policy",
                                    },
                                    {
                                        type: "hero_description",
                                        content: "Your satisfaction is our priority. Learn about our fair and transparent refund policies.",
                                    },
                                    {
                                        type: "policy_section",
                                        section_id: "eligibility",
                                        title: "Refund Eligibility",
                                        intro: "We offer refunds under the following circumstances:",
                                        points: [
                                            "Flowers delivered are significantly different from the order",
                                            "Flowers are damaged or wilted upon delivery",
                                            "Order was not delivered on the specified date",
                                            "Wrong arrangement or incorrect delivery address (our error)",
                                            "Quality issues reported within 6 hours of delivery",
                                        ],
                                    },
                                    {
                                        type: "policy_section",
                                        section_id: "process",
                                        title: "Refund Process",
                                        intro: "Steps to request a refund:",
                                        points: [
                                            "Contact us within 24 hours of delivery",
                                            "Provide order details and photos of the issue",
                                            "Our team will review your request within 24 hours",
                                            "Approved refunds are processed within 5-7 business days",
                                            "Refund amount will be credited to original payment method",
                                        ],
                                    },
                                    {
                                        type: "policy_section",
                                        section_id: "replacement",
                                        title: "Replacement Policy",
                                        intro: "For quality issues, we offer free replacements:",
                                        points: [
                                            "Report issues within 6 hours of delivery",
                                            "Replacement flowers delivered within 24 hours",
                                            "No additional charges for replacement orders",
                                            "Replacement guaranteed to meet quality standards",
                                        ],
                                    },
                                ],
                            },
                            meta_title: "Return & Refunds Policy",
                            meta_description: "Fair refund and replacement policies for flower delivery orders.",
                            is_active: true,
                            show_in_footer: true,
                            sort_order: 3,
                        },
                        {
                            title: "Privacy Policy",
                            slug: "privacy-policy",
                            content: {
                                blocks: [
                                    {
                                        type: "hero_title",
                                        content: "Privacy Policy",
                                    },
                                    {
                                        type: "hero_description",
                                        content: "Your privacy matters to us. Learn how we collect, use, and protect your personal information.",
                                    },
                                    {
                                        type: "privacy_section",
                                        section_id: "collection",
                                        title: "Information We Collect",
                                        intro: "We collect information you provide directly to us when using our services:",
                                        points: [
                                            "Personal details: Name, email, phone number, address",
                                            "Payment information: Card details, billing address (securely processed)",
                                            "Order information: Delivery details, preferences, special instructions",
                                            "Communication records: Support conversations, feedback",
                                            "Usage data: Website interactions, device information, IP address",
                                        ],
                                    },
                                    {
                                        type: "privacy_section",
                                        section_id: "usage",
                                        title: "How We Use Your Information",
                                        intro: "Your information is used to:",
                                        points: [
                                            "Process and deliver your orders",
                                            "Communicate about your orders and account",
                                            "Provide customer support and assistance",
                                            "Improve our products and services",
                                            "Send promotional offers (with your consent)",
                                            "Comply with legal obligations",
                                        ],
                                    },
                                    {
                                        type: "privacy_section",
                                        section_id: "security",
                                        title: "Data Security",
                                        intro: "We implement appropriate security measures to protect your personal information:",
                                        points: [
                                            "SSL encryption for all data transmission",
                                            "Secure payment gateways for financial information",
                                            "Regular security audits and updates",
                                            "Limited access to personal data on a need-to-know basis",
                                            "Industry-standard security protocols",
                                        ],
                                    },
                                    {
                                        type: "privacy_section",
                                        section_id: "rights",
                                        title: "Your Rights",
                                        intro: "You have the following rights regarding your personal data:",
                                        points: [
                                            "Access your personal information",
                                            "Correct inaccurate information",
                                            "Delete your account and data",
                                            "Opt out of marketing communications",
                                            "Request data portability",
                                            "Withdraw consent at any time",
                                        ],
                                    },
                                ],
                            },
                            meta_title: "Privacy Policy - Data Protection",
                            meta_description: "How we collect, use, and protect your personal information.",
                            is_active: true,
                            show_in_footer: true,
                            sort_order: 4,
                        },
                        {
                            title: "Terms & Conditions",
                            slug: "terms-conditions",
                            content: {
                                blocks: [
                                    {
                                        type: "hero_title",
                                        content: "Terms & Conditions",
                                    },
                                    {
                                        type: "hero_description",
                                        content: "These terms govern your use of our services. Please read them carefully.",
                                    },
                                    {
                                        type: "section",
                                        section_id: "acceptance",
                                        title: "Acceptance of Terms",
                                        intro: "By accessing our website and placing orders, you accept and agree to be bound by these Terms & Conditions.",
                                        points: [
                                            "These terms apply to all users and customers",
                                            "By placing an order, you confirm acceptance of these terms",
                                            "If you disagree with any terms, please discontinue use",
                                            "We may update terms periodically with notice",
                                        ],
                                    },
                                    {
                                        type: "section",
                                        section_id: "services",
                                        title: "Our Services",
                                        intro: "Florist in India provides fresh flower delivery services across India. Our services include:",
                                        points: [
                                            "Fresh flower bouquets and arrangements",
                                            "Same-day and scheduled delivery",
                                            "Custom floral arrangements",
                                            "Gift combinations with flowers",
                                            "Flowers for occasions and events",
                                            "Customer support and assistance",
                                        ],
                                    },
                                    {
                                        type: "section",
                                        section_id: "ordering",
                                        title: "Ordering & Payment",
                                        intro: "Order placement and payment terms that govern your transactions:",
                                        points: [
                                            "Orders are confirmed upon payment completion",
                                            "Prices include applicable taxes unless specified",
                                            "Delivery charges are additional unless noted",
                                            "We reserve the right to modify prices without prior notice",
                                            "Payment must be made at the time of ordering",
                                            "All transactions are subject to verification",
                                        ],
                                    },
                                    {
                                        type: "section",
                                        section_id: "delivery",
                                        title: "Delivery Terms",
                                        intro: "Important delivery terms and conditions:",
                                        points: [
                                            "Delivery times are estimates and may vary due to external factors",
                                            "Same-day delivery requires orders placed before 12 PM",
                                            "Delivery address must be accurate and accessible",
                                            "Additional charges may apply for remote areas",
                                            "We are not responsible for delays due to recipient unavailability",
                                            "Weather conditions may affect delivery schedules",
                                        ],
                                    },
                                    {
                                        type: "section",
                                        section_id: "liability",
                                        title: "Limitation of Liability",
                                        intro: "Our liability limitations and disclaimers:",
                                        points: [
                                            "Our liability is limited to the value of the order",
                                            "We are not responsible for indirect or consequential damages",
                                            "Natural product variations are not grounds for liability",
                                            "Force majeure events are beyond our control",
                                            "Customer satisfaction is our priority within reasonable limits",
                                        ],
                                    },
                                ],
                            },
                            meta_title: "Terms & Conditions",
                            meta_description: "Service terms and conditions for flower delivery.",
                            is_active: true,
                            show_in_footer: true,
                            sort_order: 5,
                        },
                        {
                            title: "Delivery Information",
                            slug: "delivery-info",
                            content: {
                                blocks: [
                                    {
                                        type: "hero_title",
                                        content: "Delivery Information",
                                    },
                                    {
                                        type: "hero_description",
                                        content: "Everything you need to know about our delivery services across India",
                                    },
                                    {
                                        type: "delivery_section",
                                        section_id: "coverage",
                                        title: "Delivery Coverage",
                                        intro: "We deliver fresh flowers across India:",
                                        points: [
                                            "100+ cities covered nationwide",
                                            "Metro cities: Same-day delivery available",
                                            "Tier-2 cities: Next-day delivery guaranteed",
                                            "Remote areas: 2-3 days delivery time",
                                            "Check pincode availability at checkout",
                                        ],
                                    },
                                    {
                                        type: "delivery_section",
                                        section_id: "timings",
                                        title: "Delivery Timings",
                                        intro: "Our standard delivery schedule:",
                                        points: [
                                            "Standard delivery: 9:00 AM to 9:00 PM",
                                            "Morning slot: 9:00 AM to 1:00 PM",
                                            "Afternoon slot: 1:00 PM to 5:00 PM",
                                            "Evening slot: 5:00 PM to 9:00 PM",
                                            "Midnight delivery available in select cities",
                                        ],
                                    },
                                    {
                                        type: "delivery_section",
                                        section_id: "charges",
                                        title: "Delivery Charges",
                                        intro: "Transparent pricing for delivery:",
                                        points: [
                                            "Free delivery on orders above ₹999",
                                            "Standard delivery: ₹99 within city limits",
                                            "Express delivery: ₹199 (same-day)",
                                            "Remote area delivery: ₹149 additional",
                                            "Midnight delivery: ₹299 surcharge",
                                        ],
                                    },
                                    {
                                        type: "delivery_section",
                                        section_id: "tracking",
                                        title: "Order Tracking",
                                        intro: "Stay updated on your delivery:",
                                        points: [
                                            "SMS notifications at each delivery stage",
                                            "Real-time tracking link via email",
                                            "Delivery partner contact details shared",
                                            "Photo confirmation upon delivery",
                                            "24/7 customer support for queries",
                                        ],
                                    },
                                ],
                            },
                            meta_title: "Delivery Information - Coverage & Timings",
                            meta_description: "Complete delivery information including coverage areas, timings, charges and tracking.",
                            is_active: true,
                            show_in_footer: true,
                            sort_order: 6,
                        },
                    ];
                    successCount = 0;
                    errorCount = 0;
                    errors = [];
                    _i = 0, pages_1 = pages;
                    _a.label = 5;
                case 5:
                    if (!(_i < pages_1.length)) return [3 /*break*/, 10];
                    page = pages_1[_i];
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, supabase_1.supabase.from("pages").upsert(page, {
                            onConflict: "slug",
                            ignoreDuplicates: false,
                        })];
                case 7:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error("Error creating page ".concat(page.slug, ":"), error);
                        errors.push("".concat(page.slug, ": ").concat(error.message));
                        errorCount++;
                    }
                    else {
                        successCount++;
                    }
                    return [3 /*break*/, 9];
                case 8:
                    err_1 = _a.sent();
                    console.error("Exception creating page ".concat(page.slug, ":"), err_1);
                    errors.push("".concat(page.slug, ": ").concat(err_1.message));
                    errorCount++;
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 5];
                case 10:
                    if (errorCount === 0) {
                        alert("All ".concat(successCount, " pages rebuilt successfully with professional layouts!"));
                    }
                    else if (successCount > 0) {
                        alert("".concat(successCount, " pages created successfully, ").concat(errorCount, " failed. Check console for details."));
                        console.error("Page creation errors:", errors);
                    }
                    else {
                        alert("Failed to create pages. This might be an RLS issue. Try running the RLS fix SQL above first, then try again.");
                        console.error("All page creation failed:", errors);
                    }
                    return [3 /*break*/, 12];
                case 11:
                    error_2 = _a.sent();
                    console.error("Error rebuilding pages:", error_2);
                    alert("Error rebuilding pages");
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); };
    var createSampleFooterSections = function () { return __awaiter(_this, void 0, void 0, function () {
        var footerSections, error, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setIsCreatingFooter(true);
                    footerSections = [
                        {
                            title: "Quick Links",
                            content: {
                                type: "links",
                                links: [
                                    { text: "About Us", url: "/about" },
                                    { text: "Help Center", url: "/help" },
                                    { text: "Delivery Info", url: "/delivery-info" },
                                    { text: "Track Order", url: "/track-order" },
                                    { text: "Gift Cards", url: "/gift-cards" },
                                ],
                            },
                            column_position: 2,
                            is_active: true,
                            sort_order: 1,
                        },
                        {
                            title: "Popular Categories",
                            content: {
                                type: "category_links",
                                show_count: 6,
                            },
                            column_position: 3,
                            is_active: true,
                            sort_order: 1,
                        },
                        {
                            title: "Customer Support",
                            content: {
                                type: "contact",
                                phone: "+91 98765 43210",
                                email: "support@floristinindia.com",
                                address: "Available 24/7 for assistance",
                            },
                            column_position: 4,
                            is_active: true,
                            sort_order: 1,
                        },
                    ];
                    return [4 /*yield*/, supabase_1.supabase
                            .from("footer_sections")
                            .upsert(footerSections, { onConflict: "title" })];
                case 1:
                    error = (_a.sent()).error;
                    if (error) {
                        console.error("Error creating footer sections:", error);
                        alert("Error creating footer sections: " + error.message);
                    }
                    else {
                        alert("Sample footer sections created successfully!");
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_3 = _a.sent();
                    console.error("Error creating footer sections:", error_3);
                    alert("Error creating footer sections");
                    return [3 /*break*/, 4];
                case 3:
                    setIsCreatingFooter(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var contactSubmissionsSQL = "-- Create contact_submissions table\nCREATE TABLE IF NOT EXISTS contact_submissions (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  name TEXT NOT NULL,\n  email TEXT NOT NULL,\n  phone TEXT,\n  subject TEXT NOT NULL,\n  message TEXT NOT NULL,\n  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  is_read BOOLEAN DEFAULT FALSE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Add RLS (Row Level Security) policy\nALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;\n\n-- Allow authenticated users to read and insert\nCREATE POLICY \"Allow authenticated read access\" ON contact_submissions\n  FOR SELECT USING (auth.role() = 'authenticated');\n\nCREATE POLICY \"Allow public insert access\" ON contact_submissions\n  FOR INSERT WITH CHECK (true);\n\n-- Create index for performance\nCREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at\n  ON contact_submissions(submitted_at DESC);\n\nCREATE INDEX IF NOT EXISTS idx_contact_submissions_is_read\n  ON contact_submissions(is_read);";
    var pagesTableSQL = "-- Create pages table\nCREATE TABLE IF NOT EXISTS pages (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  title TEXT NOT NULL,\n  slug TEXT UNIQUE NOT NULL,\n  content TEXT,\n  meta_title TEXT,\n  meta_description TEXT,\n  is_active BOOLEAN DEFAULT TRUE,\n  show_in_footer BOOLEAN DEFAULT FALSE,\n  footer_column INTEGER,\n  sort_order INTEGER DEFAULT 0,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Add RLS policy\nALTER TABLE pages ENABLE ROW LEVEL SECURITY;\n\n-- Allow public read access for active pages\nCREATE POLICY \"Allow public read access for active pages\" ON pages\n  FOR SELECT USING (is_active = true);\n\n-- Allow authenticated users full access\nCREATE POLICY \"Allow authenticated full access\" ON pages\n  FOR ALL USING (auth.role() = 'authenticated');\n\n-- Create indexes\nCREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);\nCREATE INDEX IF NOT EXISTS idx_pages_active ON pages(is_active);\nCREATE INDEX IF NOT EXISTS idx_pages_footer ON pages(show_in_footer);\n\n-- Insert default About page\nINSERT INTO pages (title, slug, content, meta_title, meta_description, is_active, show_in_footer, sort_order) VALUES\n\n-- About Us Page\n(\n  'About Florist in India',\n  'about',\n  '{\"blocks\": [\n    {\"type\": \"heading\", \"content\": \"About Florist in India\"},\n    {\"type\": \"text\", \"content\": \"Your trusted destination for premium flowers, cakes, and gifts delivered across India with love and care.\"},\n    {\"type\": \"heading\", \"content\": \"Who We Are\"},\n    {\"type\": \"text\", \"content\": \"Florist in India is your premier destination for fresh flower delivery services across India. With over 5 years of experience in the floral industry, we have built a reputation for excellence, reliability, and customer satisfaction.\"},\n    {\"type\": \"heading\", \"content\": \"Our Mission\"},\n    {\"type\": \"text\", \"content\": \"We aim to connect hearts and emotions through the universal language of flowers. Whether celebrating love, expressing sympathy, or brightening someone''s day, we believe every moment deserves beautiful blooms.\"},\n    {\"type\": \"heading\", \"content\": \"Why Choose Us\"},\n    {\"type\": \"text\", \"content\": \"\uD83C\uDF38 Fresh flowers sourced daily\\n\uD83D\uDE9A Same-day delivery in 100+ cities\\n\uD83D\uDCAC 24/7 customer support\\n\uD83D\uDC9D Custom arrangements\\n\uD83D\uDCB3 Secure payments\\n\u2B50 4.8+ star rating from 20,000+ customers\"},\n    {\"type\": \"heading\", \"content\": \"Our Coverage\"},\n    {\"type\": \"text\", \"content\": \"We serve customers across India including Delhi NCR, Mumbai, Bangalore, Pune, Hyderabad, Chennai, Kolkata, Ahmedabad, Jalandhar, Chandigarh, and 100+ more locations.\"}\n  ]}',\n  'About Florist in India \u2013 Premium Flower Delivery Across India',\n  'Learn about Florist in India, your trusted partner for fresh flower delivery across 100+ Indian cities.',\n  TRUE,\n  TRUE,\n  1\n),\n\n-- Help Center Page\n(\n  'Help Center',\n  'help-center',\n  '{\"blocks\": [\n    {\"type\": \"heading\", \"content\": \"Help Center\"},\n    {\"type\": \"text\", \"content\": \"Find answers to frequently asked questions and get support for all your flower delivery needs.\"},\n    {\"type\": \"heading\", \"content\": \"Ordering & Payment\"},\n    {\"type\": \"text\", \"content\": \"How do I place an order?\\nBrowse our collection, select flowers, add to cart, and checkout with your delivery details.\\n\\nWhat payment methods do you accept?\\nWe accept all major cards, UPI, net banking, and digital wallets.\\n\\nIs payment secure?\\nYes, all payments use SSL encryption and secure gateways.\"},\n    {\"type\": \"heading\", \"content\": \"Delivery Information\"},\n    {\"type\": \"text\", \"content\": \"Do you offer same-day delivery?\\nYes, orders before 12 PM can be delivered same day.\\n\\nDelivery timings?\\n9:00 AM to 9:00 PM daily.\\n\\nDelivery areas?\\nWe deliver to 100+ cities across India.\"},\n    {\"type\": \"heading\", \"content\": \"Product & Quality\"},\n    {\"type\": \"text\", \"content\": \"How do you ensure freshness?\\nFlowers are sourced daily and stored in temperature-controlled environments.\\n\\nCan I customize arrangements?\\nYes, contact support for custom arrangements.\"},\n    {\"type\": \"heading\", \"content\": \"Contact Support\"},\n    {\"type\": \"text\", \"content\": \"Need help? Contact us at +91 98765 43210 or orders@floristinindia.com\"}\n  ]}',\n  'Help Center - Customer Support & FAQ',\n  'Get help with flower delivery orders. FAQs about ordering, payment, delivery and more.',\n  TRUE,\n  TRUE,\n  2\n),\n\n-- Return & Refunds Page\n(\n  'Return & Refunds',\n  'return-refunds',\n  '{\"blocks\": [\n    {\"type\": \"heading\", \"content\": \"Return & Refunds Policy\"},\n    {\"type\": \"text\", \"content\": \"Customer satisfaction is our priority. We stand behind our products and services.\"},\n    {\"type\": \"heading\", \"content\": \"Refund Eligibility\"},\n    {\"type\": \"text\", \"content\": \"\u2022 Flowers significantly different from order\\n\u2022 Delivery not completed on time\\n\u2022 Poor condition due to handling\\n\u2022 Wrong product delivered\\n\u2022 Order cancelled before preparation\"},\n    {\"type\": \"heading\", \"content\": \"Refund Process\"},\n    {\"type\": \"text\", \"content\": \"1. Contact support within 24 hours with order details\\n2. Our team reviews your request\\n3. Approved refunds processed in 5-7 business days\"},\n    {\"type\": \"heading\", \"content\": \"Replacement Policy\"},\n    {\"type\": \"text\", \"content\": \"Free replacements offered for quality issues. Request within 6 hours of delivery.\"},\n    {\"type\": \"heading\", \"content\": \"How to Request\"},\n    {\"type\": \"text\", \"content\": \"Contact +91 98765 43210 or refunds@floristinindia.com with your order number.\"}\n  ]}',\n  'Return & Refunds Policy',\n  'Fair refund and replacement policies for flower delivery orders.',\n  TRUE,\n  TRUE,\n  3\n),\n\n-- Privacy Policy Page\n(\n  'Privacy Policy',\n  'privacy-policy',\n  '{\"blocks\": [\n    {\"type\": \"heading\", \"content\": \"Privacy Policy\"},\n    {\"type\": \"text\", \"content\": \"We are committed to protecting your privacy and personal information.\"},\n    {\"type\": \"heading\", \"content\": \"Information We Collect\"},\n    {\"type\": \"text\", \"content\": \"\u2022 Personal details: Name, email, phone, address\\n\u2022 Payment info: Securely processed card details\\n\u2022 Order details: Delivery preferences\\n\u2022 Usage data: Website interactions\"},\n    {\"type\": \"heading\", \"content\": \"How We Use Information\"},\n    {\"type\": \"text\", \"content\": \"\u2022 Process and deliver orders\\n\u2022 Provide customer support\\n\u2022 Improve our services\\n\u2022 Send promotional offers (with consent)\\n\u2022 Legal compliance\"},\n    {\"type\": \"heading\", \"content\": \"Information Sharing\"},\n    {\"type\": \"text\", \"content\": \"We do not sell your data. Limited sharing only with:\\n\u2022 Delivery partners for order fulfillment\\n\u2022 Payment processors for security\\n\u2022 When required by law\"},\n    {\"type\": \"heading\", \"content\": \"Data Security\"},\n    {\"type\": \"text\", \"content\": \"We use encryption and secure systems to protect your information.\"},\n    {\"type\": \"heading\", \"content\": \"Your Rights\"},\n    {\"type\": \"text\", \"content\": \"\u2022 Access your data\\n\u2022 Correct information\\n\u2022 Delete account\\n\u2022 Opt out of marketing\"},\n    {\"type\": \"heading\", \"content\": \"Contact\"},\n    {\"type\": \"text\", \"content\": \"Privacy questions: privacy@floristinindia.com\"}\n  ]}',\n  'Privacy Policy - Data Protection',\n  'How we collect, use, and protect your personal information.',\n  TRUE,\n  TRUE,\n  4\n),\n\n-- Terms & Conditions Page\n(\n  'Terms & Conditions',\n  'terms-conditions',\n  '{\"blocks\": [\n    {\"type\": \"heading\", \"content\": \"Terms & Conditions\"},\n    {\"type\": \"text\", \"content\": \"These terms govern your use of our services. By ordering, you agree to these terms.\"},\n    {\"type\": \"heading\", \"content\": \"Our Services\"},\n    {\"type\": \"text\", \"content\": \"\u2022 Fresh flower delivery across India\\n\u2022 Same-day and scheduled delivery\\n\u2022 Custom arrangements\\n\u2022 Gift combinations\"},\n    {\"type\": \"heading\", \"content\": \"Orders & Payment\"},\n    {\"type\": \"text\", \"content\": \"Orders confirmed upon payment. Prices include taxes but exclude delivery charges unless specified.\"},\n    {\"type\": \"heading\", \"content\": \"Delivery Terms\"},\n    {\"type\": \"text\", \"content\": \"\u2022 Delivery times are estimates\\n\u2022 Same-day delivery needs orders before 12 PM\\n\u2022 Address must be accurate\\n\u2022 Additional charges for remote areas\"},\n    {\"type\": \"heading\", \"content\": \"Product Disclaimer\"},\n    {\"type\": \"text\", \"content\": \"Flowers are natural products and may vary from photos. We may substitute with equal or greater value.\"},\n    {\"type\": \"heading\", \"content\": \"Liability\"},\n    {\"type\": \"text\", \"content\": \"Our liability is limited to order value. Not responsible for indirect damages.\"},\n    {\"type\": \"heading\", \"content\": \"User Conduct\"},\n    {\"type\": \"text\", \"content\": \"Do not provide false info, use for illegal purposes, or abuse support.\"},\n    {\"type\": \"heading\", \"content\": \"Contact\"},\n    {\"type\": \"text\", \"content\": \"Questions: legal@floristinindia.com or +91 98765 43210\"}\n  ]}',\n  'Terms & Conditions',\n  'Service terms and conditions for flower delivery.',\n  TRUE,\n  TRUE,\n  5\n)\nON CONFLICT (slug) DO UPDATE SET\n  meta_title = EXCLUDED.meta_title,\n  meta_description = EXCLUDED.meta_description,\n  updated_at = NOW();";
    var siteSettingsSQL = "-- Create site_settings table\nCREATE TABLE IF NOT EXISTS site_settings (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  key TEXT UNIQUE NOT NULL,\n  value TEXT NOT NULL,\n  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'json', 'boolean', 'number', 'image')),\n  description TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Add RLS policy\nALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;\n\n-- Allow public read access\nCREATE POLICY \"Allow public read access\" ON site_settings\n  FOR SELECT USING (true);\n\n-- Allow authenticated users full access\nCREATE POLICY \"Allow authenticated full access\" ON site_settings\n  FOR ALL USING (auth.role() = 'authenticated');\n\n-- Create index\nCREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(key);\n\n-- Insert default site settings\nINSERT INTO site_settings (key, value, type, description) VALUES\n  ('business_name', 'Florist in India', 'text', 'Business name'),\n  ('contact_phone', '', 'text', 'Primary contact phone'),\n  ('contact_phone_2', '', 'text', 'Secondary contact phone'),\n  ('whatsapp_number', '', 'text', 'WhatsApp number for floating chat widget'),\n  ('contact_email', '', 'text', 'Contact email address'),\n  ('contact_address', '', 'text', 'Business address'),\n  ('business_hours', 'Monday - Sunday: 9:00 AM - 9:00 PM', 'text', 'Business operating hours'),\n  ('google_maps_embed', '', 'text', 'Google Maps embed code')\nON CONFLICT (key) DO NOTHING;";
    var analyticsTablesSQL = "-- Create Analytics Tables for Statistics Dashboard\n-- Run this to enable visitor and behavior tracking\n\n-- Analytics Sessions Table\nCREATE TABLE IF NOT EXISTS analytics_sessions (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  session_id TEXT UNIQUE NOT NULL,\n  user_id UUID REFERENCES customers(id) ON DELETE SET NULL,\n  start_time TIMESTAMP WITH TIME ZONE NOT NULL,\n  end_time TIMESTAMP WITH TIME ZONE,\n  page_count INTEGER DEFAULT 0,\n  device_type TEXT NOT NULL,\n  browser TEXT NOT NULL,\n  referrer TEXT,\n  ip_address INET,\n  location TEXT,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Analytics Page Views Table\nCREATE TABLE IF NOT EXISTS analytics_page_views (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  session_id TEXT NOT NULL,\n  user_id UUID REFERENCES customers(id) ON DELETE SET NULL,\n  page_url TEXT NOT NULL,\n  page_title TEXT NOT NULL,\n  referrer TEXT,\n  user_agent TEXT,\n  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Analytics Product Views Table\nCREATE TABLE IF NOT EXISTS analytics_product_views (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  session_id TEXT NOT NULL,\n  user_id UUID REFERENCES customers(id) ON DELETE SET NULL,\n  product_id UUID REFERENCES products(id) ON DELETE CASCADE,\n  product_name TEXT NOT NULL,\n  category_id UUID REFERENCES product_categories(id) ON DELETE SET NULL,\n  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Analytics Cart Events Table\nCREATE TABLE IF NOT EXISTS analytics_cart_events (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  session_id TEXT NOT NULL,\n  user_id UUID REFERENCES customers(id) ON DELETE SET NULL,\n  product_id UUID REFERENCES products(id) ON DELETE CASCADE,\n  product_name TEXT NOT NULL,\n  action TEXT NOT NULL CHECK (action IN ('add', 'remove', 'update')),\n  quantity INTEGER NOT NULL,\n  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Create indexes for better performance\nCREATE INDEX IF NOT EXISTS idx_analytics_sessions_start_time ON analytics_sessions(start_time);\nCREATE INDEX IF NOT EXISTS idx_analytics_sessions_user_id ON analytics_sessions(user_id);\nCREATE INDEX IF NOT EXISTS idx_analytics_page_views_timestamp ON analytics_page_views(timestamp);\nCREATE INDEX IF NOT EXISTS idx_analytics_page_views_page_url ON analytics_page_views(page_url);\nCREATE INDEX IF NOT EXISTS idx_analytics_product_views_timestamp ON analytics_product_views(timestamp);\nCREATE INDEX IF NOT EXISTS idx_analytics_product_views_product_id ON analytics_product_views(product_id);\nCREATE INDEX IF NOT EXISTS idx_analytics_cart_events_timestamp ON analytics_cart_events(timestamp);\nCREATE INDEX IF NOT EXISTS idx_analytics_cart_events_product_id ON analytics_cart_events(product_id);\n\n-- Enable RLS (Row Level Security)\nALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;\nALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;\nALTER TABLE analytics_product_views ENABLE ROW LEVEL SECURITY;\nALTER TABLE analytics_cart_events ENABLE ROW LEVEL SECURITY;\n\n-- Create policies for analytics tables (admin access only for sensitive data)\nCREATE POLICY \"Admin access to analytics_sessions\" ON analytics_sessions\n  FOR ALL USING (auth.role() = 'authenticated');\n\nCREATE POLICY \"Admin access to analytics_page_views\" ON analytics_page_views\n  FOR ALL USING (auth.role() = 'authenticated');\n\nCREATE POLICY \"Admin access to analytics_product_views\" ON analytics_product_views\n  FOR ALL USING (auth.role() = 'authenticated');\n\nCREATE POLICY \"Admin access to analytics_cart_events\" ON analytics_cart_events\n  FOR ALL USING (auth.role() = 'authenticated');";
    function copyToClipboard(text, type) {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(function () { return setCopied(null); }, 2000);
    }
    return (<div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Database Setup</h1>
        <p className="text-muted-foreground">
          Run these SQL commands in your Supabase SQL Editor to create required
          tables
        </p>
      </div>

      <div className="grid gap-6">
        {/* Contact Submissions Table */}
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle className="flex items-center gap-2">
              <lucide_react_1.Database className="h-5 w-5"/>
              Contact Submissions Table
              <badge_1.Badge variant="outline">Required for Contact Form</badge_1.Badge>
            </card_1.CardTitle>
            <p className="text-sm text-muted-foreground">
              This table stores contact form submissions from the website
            </p>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <lucide_react_1.AlertTriangle className="h-4 w-4 text-orange-500"/>
                <span className="text-sm">
                  Run this SQL in Supabase ��� SQL Editor → New Query
                </span>
              </div>
              <div className="relative">
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{contactSubmissionsSQL}</code>
                </pre>
                <button_1.Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={function () {
            return copyToClipboard(contactSubmissionsSQL, "contact");
        }}>
                  <lucide_react_1.Copy className="h-4 w-4 mr-1"/>
                  {copied === "contact" ? "Copied!" : "Copy"}
                </button_1.Button>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Pages Table */}
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle className="flex items-center gap-2">
              <lucide_react_1.Database className="h-5 w-5"/>
              Pages Table
              <badge_1.Badge variant="outline">Required for CMS Pages</badge_1.Badge>
            </card_1.CardTitle>
            <p className="text-sm text-muted-foreground">
              This table stores dynamic pages (About Us, Privacy Policy, etc.)
            </p>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="relative">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{pagesTableSQL}</code>
              </pre>
              <button_1.Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={function () { return copyToClipboard(pagesTableSQL, "pages"); }}>
                <lucide_react_1.Copy className="h-4 w-4 mr-1"/>
                {copied === "pages" ? "Copied!" : "Copy"}
              </button_1.Button>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Site Settings Table */}
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle className="flex items-center gap-2">
              <lucide_react_1.Database className="h-5 w-5"/>
              Site Settings Table
              <badge_1.Badge variant="outline">Required for Global Settings</badge_1.Badge>
            </card_1.CardTitle>
            <p className="text-sm text-muted-foreground">
              This table stores global site configuration and contact
              information
            </p>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="relative">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{siteSettingsSQL}</code>
              </pre>
              <button_1.Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={function () { return copyToClipboard(siteSettingsSQL, "settings"); }}>
                <lucide_react_1.Copy className="h-4 w-4 mr-1"/>
                {copied === "settings" ? "Copied!" : "Copy"}
              </button_1.Button>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Analytics Tables */}
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle className="flex items-center gap-2">
              <lucide_react_1.Database className="h-5 w-5"/>
              Analytics Tables
              <badge_1.Badge variant="outline">For Statistics Dashboard</badge_1.Badge>
            </card_1.CardTitle>
            <p className="text-sm text-muted-foreground">
              Creates tables to track visitor behavior, page views, product
              interactions, and cart events for the Analytics dashboard
            </p>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <lucide_react_1.AlertTriangle className="h-4 w-4 text-blue-500"/>
                <span className="text-sm">
                  Run this SQL to enable comprehensive analytics tracking
                </span>
              </div>
              <div className="relative">
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-96">
                  <code>{analyticsTablesSQL}</code>
                </pre>
                <button_1.Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={function () {
            return copyToClipboard(analyticsTablesSQL, "analytics");
        }}>
                  <lucide_react_1.Copy className="h-4 w-4 mr-1"/>
                  {copied === "analytics" ? "Copied!" : "Copy"}
                </button_1.Button>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>📊 What this creates:</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>
                    • <strong>Sessions table</strong> - Track user sessions,
                    devices, browsers
                  </li>
                  <li>
                    • <strong>Page views table</strong> - Track which pages
                    users visit
                  </li>
                  <li>
                    • <strong>Product views table</strong> - Track product page
                    visits
                  </li>
                  <li>
                    • <strong>Cart events table</strong> - Track add/remove cart
                    actions
                  </li>
                  <li>
                    • <strong>Performance indexes</strong> - Fast data retrieval
                  </li>
                  <li>
                    • <strong>Security policies</strong> - Admin-only access to
                    analytics data
                  </li>
                </ul>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* WhatsApp Widget Setup */}
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle className="flex items-center gap-2">
              <lucide_react_1.Database className="h-5 w-5"/>
              WhatsApp Float Widget Setup
              <badge_1.Badge variant="outline">Add WhatsApp Chat</badge_1.Badge>
            </card_1.CardTitle>
            <p className="text-sm text-muted-foreground">
              Add this setting to enable the floating WhatsApp chat widget on
              your website
            </p>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <lucide_react_1.AlertTriangle className="h-4 w-4 text-green-500"/>
                <span className="text-sm">
                  Run this SQL to add WhatsApp number setting (if not already
                  present)
                </span>
              </div>
              <div className="relative">
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{"-- Add WhatsApp number setting for floating chat widget\nINSERT INTO site_settings (key, value, type, description)\nVALUES ('whatsapp_number', '', 'text', 'WhatsApp number for floating chat widget')\nON CONFLICT (key) DO NOTHING;"}</code>
                </pre>
                <button_1.Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={function () {
            return copyToClipboard("-- Add WhatsApp number setting for floating chat widget\nINSERT INTO site_settings (key, value, type, description)\nVALUES ('whatsapp_number', '', 'text', 'WhatsApp number for floating chat widget')\nON CONFLICT (key) DO NOTHING;", "whatsapp");
        }}>
                  <lucide_react_1.Copy className="h-4 w-4 mr-1"/>
                  {copied === "whatsapp" ? "Copied!" : "Copy"}
                </button_1.Button>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>📱 How to use:</strong>
                </p>
                <ol className="text-sm text-green-700 mt-1 space-y-1">
                  <li>1. Run the SQL above in Supabase SQL Editor</li>
                  <li>
                    2. Go to <strong>Admin → Settings → Contact Tab</strong>
                  </li>
                  <li>
                    3. Enter your WhatsApp number with country code (e.g.,
                    +919876543210)
                  </li>
                  <li>
                    4. Save settings - the floating chat icon will appear on all
                    pages
                  </li>
                  <li>
                    5. Users can click the icon to start a WhatsApp chat with
                    you
                  </li>
                </ol>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {/* Authentication Tables */}
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle className="flex items-center gap-2">
              <lucide_react_1.Database className="h-5 w-5"/>
              Authentication System Setup
              <badge_1.Badge variant="outline">Login/Signup System</badge_1.Badge>
            </card_1.CardTitle>
            <p className="text-sm text-muted-foreground">
              Complete authentication system with admin and customer login,
              secure password hashing, and session management
            </p>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <lucide_react_1.AlertTriangle className="h-4 w-4 text-blue-500"/>
                <span className="text-sm">
                  Run this SQL to create all authentication tables and security
                  features
                </span>
              </div>
              <div className="relative">
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-96">
                  <code>{"-- Authentication Tables Setup\n-- Complete authentication system with admin and customer login\n\n-- Admins table for admin users\nCREATE TABLE IF NOT EXISTS admins (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL,\n  password_hash TEXT NOT NULL,\n  name TEXT NOT NULL,\n  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),\n  is_active BOOLEAN DEFAULT true,\n  is_verified BOOLEAN DEFAULT false,\n  last_login TIMESTAMP WITH TIME ZONE,\n  failed_login_attempts INTEGER DEFAULT 0,\n  locked_until TIMESTAMP WITH TIME ZONE,\n  password_reset_token TEXT,\n  password_reset_expires TIMESTAMP WITH TIME ZONE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Enhanced customers table\nCREATE TABLE IF NOT EXISTS customers (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL,\n  password_hash TEXT NOT NULL,\n  name TEXT NOT NULL,\n  phone TEXT,\n  is_active BOOLEAN DEFAULT true,\n  is_verified BOOLEAN DEFAULT false,\n  last_login TIMESTAMP WITH TIME ZONE,\n  failed_login_attempts INTEGER DEFAULT 0,\n  locked_until TIMESTAMP WITH TIME ZONE,\n  password_reset_token TEXT,\n  password_reset_expires TIMESTAMP WITH TIME ZONE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Sessions table for secure session management\nCREATE TABLE IF NOT EXISTS user_sessions (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID NOT NULL,\n  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'customer')),\n  session_token TEXT UNIQUE NOT NULL,\n  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,\n  ip_address INET,\n  user_agent TEXT,\n  is_active BOOLEAN DEFAULT true,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Login attempts table for security tracking\nCREATE TABLE IF NOT EXISTS login_attempts (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  email TEXT NOT NULL,\n  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'customer')),\n  ip_address INET,\n  success BOOLEAN NOT NULL,\n  failure_reason TEXT,\n  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Create indexes for performance\nCREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);\nCREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);\nCREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);\nCREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);\n\n-- Insert default super admin (CHANGE PASSWORD IMMEDIATELY)\nINSERT INTO admins (email, password_hash, name, role, is_active, is_verified)\nVALUES (\n  'admin@floristinindia.com',\n  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewrBILSE7l8e5qYK',\n  'System Administrator',\n  'super_admin',\n  true,\n  true\n) ON CONFLICT (email) DO NOTHING;"}</code>
                </pre>
                <button_1.Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={function () {
            return copyToClipboard("-- Authentication Tables Setup\n-- Complete authentication system with admin and customer login\n\n-- Admins table for admin users\nCREATE TABLE IF NOT EXISTS admins (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL,\n  password_hash TEXT NOT NULL,\n  name TEXT NOT NULL,\n  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),\n  is_active BOOLEAN DEFAULT true,\n  is_verified BOOLEAN DEFAULT false,\n  last_login TIMESTAMP WITH TIME ZONE,\n  failed_login_attempts INTEGER DEFAULT 0,\n  locked_until TIMESTAMP WITH TIME ZONE,\n  password_reset_token TEXT,\n  password_reset_expires TIMESTAMP WITH TIME ZONE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Enhanced customers table\nCREATE TABLE IF NOT EXISTS customers (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  email TEXT UNIQUE NOT NULL,\n  password_hash TEXT NOT NULL,\n  name TEXT NOT NULL,\n  phone TEXT,\n  is_active BOOLEAN DEFAULT true,\n  is_verified BOOLEAN DEFAULT false,\n  last_login TIMESTAMP WITH TIME ZONE,\n  failed_login_attempts INTEGER DEFAULT 0,\n  locked_until TIMESTAMP WITH TIME ZONE,\n  password_reset_token TEXT,\n  password_reset_expires TIMESTAMP WITH TIME ZONE,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Sessions table for secure session management\nCREATE TABLE IF NOT EXISTS user_sessions (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  user_id UUID NOT NULL,\n  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'customer')),\n  session_token TEXT UNIQUE NOT NULL,\n  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,\n  ip_address INET,\n  user_agent TEXT,\n  is_active BOOLEAN DEFAULT true,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Login attempts table for security tracking\nCREATE TABLE IF NOT EXISTS login_attempts (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  email TEXT NOT NULL,\n  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'customer')),\n  ip_address INET,\n  success BOOLEAN NOT NULL,\n  failure_reason TEXT,\n  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);\n\n-- Create indexes for performance\nCREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);\nCREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);\nCREATE INDEX IF NOT EXISTS idx_user_sessions_session_token ON user_sessions(session_token);\nCREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);\n\n-- Insert default super admin (CHANGE PASSWORD IMMEDIATELY)\nINSERT INTO admins (email, password_hash, name, role, is_active, is_verified)\nVALUES (\n  'admin@floristinindia.com',\n  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewrBILSE7l8e5qYK',\n  'System Administrator',\n  'super_admin',\n  true,\n  true\n) ON CONFLICT (email) DO NOTHING;", "auth");
        }}>
                  <lucide_react_1.Copy className="h-4 w-4 mr-1"/>
                  {copied === "auth" ? "Copied!" : "Copy"}
                </button_1.Button>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>🔐 Security Features:</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>
                    • <strong>Password encryption</strong> - Secure bcrypt
                    hashing
                  </li>
                  <li>
                    • <strong>Session management</strong> - Database-stored
                    secure sessions
                  </li>
                  <li>
                    • <strong>Brute force protection</strong> - Account locking
                    after failed attempts
                  </li>
                  <li>
                    • <strong>Login tracking</strong> - Monitor all login
                    attempts
                  </li>
                  <li>
                    • <strong>Password reset</strong> - Secure token-based
                    password recovery
                  </li>
                  <li>
                    • <strong>Role-based access</strong> - Admin vs customer
                    permissions
                  </li>
                  <li>
                    • <strong>Default admin</strong> - Email:
                    admin@floristinindia.com, Password: admin123
                  </li>
                </ul>
                <div className="mt-2 p-2 bg-red-100 rounded text-red-800 text-xs">
                  <strong>⚠️ IMPORTANT:</strong> Change the default admin
                  password immediately after setup!
                </div>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* RLS Fix Section */}
      <card_1.Card className="border-red-200 bg-red-50">
        <card_1.CardHeader>
          <card_1.CardTitle className="flex items-center gap-2 text-red-800">
            <lucide_react_1.AlertTriangle className="h-5 w-5"/>
            Fix RLS Policy Error
            <badge_1.Badge variant="outline" className="bg-red-100">
              If Getting RLS Errors
            </badge_1.Badge>
          </card_1.CardTitle>
          <p className="text-sm text-red-700">
            If you get "row-level security policy" errors when rebuilding pages,
            run this SQL first
          </p>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="relative">
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-48">
              <code>{rlsFixSQL}</code>
            </pre>
            <button_1.Button variant="outline" size="sm" className="absolute top-2 right-2" onClick={function () { return copyToClipboard(rlsFixSQL, "rls"); }}>
              <lucide_react_1.Copy className="h-4 w-4 mr-1"/>
              {copied === "rls" ? "Copied!" : "Copy"}
            </button_1.Button>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      {/* Clear Old Pages */}
      <card_1.Card className="border-orange-200 bg-orange-50">
        <card_1.CardHeader>
          <card_1.CardTitle className="flex items-center gap-2 text-orange-800">
            <lucide_react_1.Trash2 className="h-5 w-5"/>
            Clear Old Page Data
            <badge_1.Badge variant="outline" className="bg-orange-100">
              Maintenance Tool
            </badge_1.Badge>
          </card_1.CardTitle>
          <p className="text-sm text-orange-700">
            If pages are showing old content format, clear existing records to
            trigger creation of new structured content
          </p>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex items-center gap-4">
            <button_1.Button onClick={clearOldPages} disabled={isClearing} variant="destructive" size="sm">
              <lucide_react_1.Trash2 className="h-4 w-4 mr-2"/>
              {isClearing ? "Rebuilding..." : "Rebuild All 6 Pages"}
            </button_1.Button>
            {clearSuccess && (<badge_1.Badge variant="outline" className="bg-green-100 text-green-800">
                ✓ Cleared! Visit pages to create new content
              </badge_1.Badge>)}
          </div>
          <p className="text-xs text-orange-600 mt-2">
            ⚠️ This will delete all existing page content. New structured
            content will be created when you visit each page.
          </p>
        </card_1.CardContent>
      </card_1.Card>

      {/* Sample Footer Sections */}
      <card_1.Card className="border-blue-200 bg-blue-50">
        <card_1.CardHeader>
          <card_1.CardTitle className="flex items-center gap-2 text-blue-800">
            <lucide_react_1.Database className="h-5 w-5"/>
            Create Sample Footer Sections
            <badge_1.Badge variant="outline" className="bg-blue-100">
              Optional
            </badge_1.Badge>
          </card_1.CardTitle>
          <p className="text-sm text-blue-700">
            Create sample footer sections to get started with the Footer Editor
          </p>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex items-center gap-4">
            <button_1.Button onClick={createSampleFooterSections} disabled={isCreatingFooter} variant="default" size="sm">
              <lucide_react_1.Database className="h-4 w-4 mr-2"/>
              {isCreatingFooter
            ? "Creating..."
            : "Create Sample Footer Sections"}
            </button_1.Button>
          </div>
          <p className="text-xs text-blue-600 mt-2">
            📋 Creates: Quick Links, Popular Categories, Customer Support
            sections
          </p>
        </card_1.CardContent>
      </card_1.Card>

      <card_1.Card className="border-green-200 bg-green-50">
        <card_1.CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <lucide_react_1.Database className="h-5 w-5 text-green-600 mt-0.5"/>
            <div>
              <h3 className="font-medium text-green-800">
                Setup Instructions:
              </h3>
              <ol className="mt-2 text-sm text-green-700 space-y-1">
                <li>1. Go to your Supabase Dashboard</li>
                <li>2. Navigate to SQL Editor</li>
                <li>3. Click "New Query"</li>
                <li>4. Copy and paste each SQL block above</li>
                <li>5. Run each query individually</li>
                <li>6. Go to Admin → Pages to edit About page content</li>
                <li>7. Test the Contact Form and About page</li>
              </ol>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      <card_1.Card className="border-blue-200 bg-blue-50">
        <card_1.CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <lucide_react_1.AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5"/>
            <div>
              <h3 className="font-medium text-blue-800">Complete Page Set:</h3>
              <p className="mt-2 text-sm text-blue-700">
                After running the Pages table SQL, comprehensive pages will be
                created:
                <strong>
                  About Us, Help Center, Return & Refunds, Privacy Policy, and
                  Terms & Conditions
                </strong>
                . All content is fully editable through{" "}
                <strong>Admin → Pages</strong> using the content block editor.
              </p>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
