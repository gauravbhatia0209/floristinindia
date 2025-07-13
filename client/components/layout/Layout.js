"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Layout;
var react_router_dom_1 = require("react-router-dom");
var Header_1 = require("./Header");
var Footer_1 = require("./Footer");
var toaster_1 = require("@/components/ui/toaster");
var WhatsAppFloat_1 = require("@/components/WhatsAppFloat");
function Layout() {
    return (<div className="min-h-screen flex flex-col">
      <Header_1.Header />
      <main className="flex-1">
        <react_router_dom_1.Outlet />
      </main>
      <Footer_1.Footer />
      <toaster_1.Toaster />
      <WhatsAppFloat_1.default />
    </div>);
}
