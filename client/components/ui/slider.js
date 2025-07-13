"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slider = void 0;
var React = require("react");
var SliderPrimitive = require("@radix-ui/react-slider");
var utils_1 = require("@/lib/utils");
var Slider = React.forwardRef(function (_a, ref) {
    var className = _a.className, props = __rest(_a, ["className"]);
    // Determine if this is a range slider (multiple values)
    var isRange = Array.isArray(props.value) && props.value.length > 1;
    return (<SliderPrimitive.Root ref={ref} className={(0, utils_1.cn)("relative flex w-full touch-none select-none items-center", className)} {...props}>
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary/50">
        <SliderPrimitive.Range className="absolute h-full bg-primary rounded-full"/>
      </SliderPrimitive.Track>

      {/* Render thumbs based on whether it's a range slider */}
      {isRange ? (
        // Render multiple thumbs for range slider
        <>
          <SliderPrimitive.Thumb className="relative block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 shadow-sm before:absolute before:inset-[-8px] before:content-[''] before:rounded-full before:bg-transparent"/>
          <SliderPrimitive.Thumb className="relative block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 shadow-sm before:absolute before:inset-[-8px] before:content-[''] before:rounded-full before:bg-transparent"/>
        </>) : (
        // Render single thumb for regular slider
        <SliderPrimitive.Thumb className="relative block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 shadow-sm before:absolute before:inset-[-8px] before:content-[''] before:rounded-full before:bg-transparent"/>)}
    </SliderPrimitive.Root>);
});
exports.Slider = Slider;
Slider.displayName = SliderPrimitive.Root.displayName;
