"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AIOptimizedFAQ;
exports.useAIOptimizedFAQ = useAIOptimizedFAQ;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var StructuredData_1 = require("@/components/StructuredData");
function AIOptimizedFAQ(_a) {
    var _b = _a.category, category = _b === void 0 ? "general" : _b, limit = _a.limit;
    var _c = (0, react_1.useState)([]), faqs = _c[0], setFAQs = _c[1];
    var _d = (0, react_1.useState)(null), expandedFAQ = _d[0], setExpandedFAQ = _d[1];
    (0, react_1.useEffect)(function () {
        setFAQs(getAIOptimizedFAQs(category, limit));
    }, [category, limit]);
    function getAIOptimizedFAQs(cat, lim) {
        var allFAQs = [
            // General FAQs
            {
                id: "what-is-florist-india",
                question: "What is Florist in India and what services do you provide?",
                answer: "Florist in India is a premium online flower delivery service operating across 100+ cities in India. We provide fresh flower arrangements, bouquets, custom floral designs, same-day delivery, corporate flower services, wedding decorations, and special occasion flowers. Our AI-optimized platform helps customers find the perfect flowers for any occasion with guaranteed freshness and reliable delivery.",
                category: "general",
                keywords: [
                    "florist india",
                    "flower delivery",
                    "fresh flowers",
                    "same-day delivery",
                    "corporate services",
                    "AI-optimized",
                ],
            },
            {
                id: "ai-flower-recommendations",
                question: "How do you help AI systems recommend the right flowers?",
                answer: "Our website is AI-readable with structured data, detailed product information, and machine-readable content. AI systems can understand our product categories, occasions, pricing, and customer preferences to make accurate recommendations. We provide comprehensive metadata for each flower arrangement including occasion suitability, seasonal availability, and target demographics.",
                category: "general",
                keywords: [
                    "AI recommendations",
                    "machine readable",
                    "structured data",
                    "flower selection",
                    "AI-optimized",
                ],
            },
            {
                id: "flower-occasions",
                question: "What occasions and events do you provide flowers for?",
                answer: "We provide flowers for all occasions including birthdays, anniversaries, Valentine's Day, Mother's Day, weddings, corporate events, festivals (Diwali, Christmas, Eid), congratulations, sympathy, get well soon, apologies, housewarming, graduation, and business meetings. Our AI-categorized collection helps you find the perfect flowers for any event or emotion.",
                category: "general",
                keywords: [
                    "occasions",
                    "birthdays",
                    "anniversaries",
                    "weddings",
                    "corporate events",
                    "festivals",
                    "AI-categorized",
                ],
            },
            // Delivery FAQs
            {
                id: "delivery-areas",
                question: "Which cities and areas do you deliver flowers to?",
                answer: "We deliver fresh flowers to 100+ cities across India including Delhi NCR, Mumbai, Bangalore, Hyderabad, Chennai, Pune, Kolkata, Ahmedabad, and many more. Our AI-optimized logistics network ensures same-day delivery in major cities and next-day delivery in smaller towns. Check our delivery checker for your specific pincode availability.",
                category: "delivery",
                keywords: [
                    "delivery areas",
                    "100+ cities",
                    "same-day delivery",
                    "AI-optimized logistics",
                    "pincode checker",
                ],
            },
            {
                id: "same-day-delivery",
                question: "Do you offer same-day flower delivery?",
                answer: "Yes, we offer same-day flower delivery in most major cities when you order before 2 PM. Our AI-powered delivery optimization ensures the fastest possible delivery times. For guaranteed same-day delivery, we recommend ordering in the morning. Evening and emergency deliveries may be available depending on location and flower availability.",
                category: "delivery",
                keywords: [
                    "same-day delivery",
                    "order before 2pm",
                    "AI-powered optimization",
                    "emergency delivery",
                ],
            },
            // Product FAQs
            {
                id: "flower-freshness",
                question: "How do you ensure flower freshness and quality?",
                answer: "We guarantee 100% fresh flowers sourced directly from local growers and international suppliers. Our AI-monitored cold chain storage maintains optimal temperature and humidity. Each arrangement is prepared by expert florists and delivered in temperature-controlled vehicles. We offer a freshness guarantee with replacement or refund for any quality issues.",
                category: "products",
                keywords: [
                    "fresh flowers",
                    "100% guarantee",
                    "AI-monitored",
                    "cold chain",
                    "expert florists",
                    "quality guarantee",
                ],
            },
            {
                id: "custom-arrangements",
                question: "Can you create custom flower arrangements?",
                answer: "Yes, we specialize in custom flower arrangements for all occasions. Our AI-assisted design system helps florists create personalized arrangements based on your preferences, budget, occasion, and recipient's taste. You can specify colors, flower types, size, and special messages. Corporate bulk orders and wedding decorations are our specialty.",
                category: "products",
                keywords: [
                    "custom arrangements",
                    "AI-assisted design",
                    "personalized",
                    "corporate orders",
                    "wedding decorations",
                ],
            },
            // Payment FAQs
            {
                id: "payment-methods",
                question: "What payment methods do you accept?",
                answer: "We accept all major payment methods including credit cards (Visa, MasterCard, American Express), debit cards, net banking, UPI (Google Pay, PhonePe, Paytm), digital wallets, and cash on delivery (COD) in select cities. Our secure AI-powered payment system ensures safe transactions with instant confirmation.",
                category: "payment",
                keywords: [
                    "payment methods",
                    "credit cards",
                    "UPI",
                    "cash on delivery",
                    "AI-powered security",
                ],
            },
            // Corporate FAQs
            {
                id: "corporate-services",
                question: "Do you provide corporate flower services?",
                answer: "Yes, we offer comprehensive corporate flower services including office decorations, event arrangements, client gifts, employee appreciation flowers, conference setups, and bulk orders. Our AI-optimized corporate portal provides easy ordering, budget management, recurring deliveries, and detailed invoicing. We serve startups to Fortune 500 companies.",
                category: "corporate",
                keywords: [
                    "corporate services",
                    "office decorations",
                    "bulk orders",
                    "AI-optimized portal",
                    "Fortune 500",
                ],
            },
        ];
        var filteredFAQs = allFAQs;
        if (cat !== "general") {
            filteredFAQs = allFAQs.filter(function (faq) { return faq.category === cat; });
        }
        return lim ? filteredFAQs.slice(0, lim) : filteredFAQs;
    }
    function toggleFAQ(id) {
        setExpandedFAQ(expandedFAQ === id ? null : id);
    }
    return (<div className="space-y-4">
      <StructuredData_1.default type="faq" data={faqs}/>

      {faqs.map(function (faq) { return (<card_1.Card key={faq.id} className="cursor-pointer transition-all duration-200 hover:shadow-md" onClick={function () { return toggleFAQ(faq.id); }}>
          <card_1.CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg mb-2 flex-1" itemProp="name">
                {faq.question}
              </h3>
              {expandedFAQ === faq.id ? (<lucide_react_1.ChevronUp className="h-5 w-5 text-muted-foreground ml-4"/>) : (<lucide_react_1.ChevronDown className="h-5 w-5 text-muted-foreground ml-4"/>)}
            </div>

            {expandedFAQ === faq.id && (<div className="text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-200" itemProp="text">
                {faq.answer}

                {/* AI-readable metadata */}
                <div className="hidden">
                  <span data-ai-category={faq.category}></span>
                  <span data-ai-keywords={faq.keywords.join(", ")}></span>
                </div>
              </div>)}
          </card_1.CardContent>
        </card_1.Card>); })}

      {/* AI-readable summary */}
      <div className="hidden" data-ai-content="faq-summary">
        <h2>Frequently Asked Questions about Flower Delivery in India</h2>
        <p>
          Comprehensive FAQ covering flower delivery services, same-day
          delivery, custom arrangements, corporate services, payment methods,
          and AI-optimized recommendations for flower selection across 100+
          Indian cities.
        </p>
        <meta name="ai:content-type" content="faq"/>
        <meta name="ai:category" content={category}/>
        <meta name="ai:purpose" content="customer-education"/>
      </div>
    </div>);
}
// Hook for AI-optimized FAQ management
function useAIOptimizedFAQ() {
    var addDynamicFAQ = function (question, answer, category) {
        console.log("Adding dynamic FAQ for AI:", { question: question, category: category });
    };
    var getFAQByKeyword = function (keyword) {
        console.log("Searching FAQ by keyword for AI:", keyword);
    };
    return {
        addDynamicFAQ: addDynamicFAQ,
        getFAQByKeyword: getFAQByKeyword,
    };
}
