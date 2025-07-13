"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroCarousel = HeroCarousel;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
function HeroCarousel(_a) {
    var images = _a.images, _b = _a.autoplay, autoplay = _b === void 0 ? true : _b, _c = _a.autoplayDelay, autoplayDelay = _c === void 0 ? 5000 : _c, _d = _a.showNavigation, showNavigation = _d === void 0 ? true : _d, _e = _a.showDots, showDots = _e === void 0 ? true : _e, _f = _a.height, height = _f === void 0 ? 500 : _f;
    var _g = (0, react_1.useState)(0), currentIndex = _g[0], setCurrentIndex = _g[1];
    var _h = (0, react_1.useState)(false), isHovered = _h[0], setIsHovered = _h[1];
    var _j = (0, react_1.useState)(false), isMobile = _j[0], setIsMobile = _j[1];
    var _k = (0, react_1.useState)(0), touchStartX = _k[0], setTouchStartX = _k[1];
    var _l = (0, react_1.useState)(0), touchEndX = _l[0], setTouchEndX = _l[1];
    var carouselRef = (0, react_1.useRef)(null);
    // Detect mobile device
    (0, react_1.useEffect)(function () {
        var checkMobile = function () {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return function () { return window.removeEventListener("resize", checkMobile); };
    }, []);
    var nextSlide = (0, react_1.useCallback)(function () {
        setCurrentIndex(function (prevIndex) {
            return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
        });
    }, [images.length]);
    var prevSlide = (0, react_1.useCallback)(function () {
        setCurrentIndex(function (prevIndex) {
            return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
        });
    }, [images.length]);
    var goToSlide = (0, react_1.useCallback)(function (index) {
        setCurrentIndex(index);
    }, []);
    // Touch event handlers for mobile swipe
    var handleTouchStart = function (e) {
        setTouchStartX(e.targetTouches[0].clientX);
    };
    var handleTouchMove = function (e) {
        setTouchEndX(e.targetTouches[0].clientX);
    };
    var handleTouchEnd = function () {
        if (!touchStartX || !touchEndX)
            return;
        var distance = touchStartX - touchEndX;
        var minSwipeDistance = 50;
        if (distance > minSwipeDistance) {
            nextSlide();
        }
        else if (distance < -minSwipeDistance) {
            prevSlide();
        }
        setTouchStartX(0);
        setTouchEndX(0);
    };
    // Auto-play functionality
    (0, react_1.useEffect)(function () {
        if (!autoplay || isHovered || images.length <= 1)
            return;
        var interval = setInterval(nextSlide, autoplayDelay);
        return function () { return clearInterval(interval); };
    }, [autoplay, autoplayDelay, isHovered, nextSlide, images.length]);
    // Handle keyboard navigation
    (0, react_1.useEffect)(function () {
        var handleKeyDown = function (event) {
            if (event.key === "ArrowLeft") {
                prevSlide();
            }
            else if (event.key === "ArrowRight") {
                nextSlide();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return function () { return window.removeEventListener("keydown", handleKeyDown); };
    }, [nextSlide, prevSlide]);
    if (!images || images.length === 0) {
        return (<div className="w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center" style={{ height: "".concat(height, "px") }}>
        <div className="text-center text-muted-foreground">
          <div className="text-6xl mb-4">🌸</div>
          <p className="text-lg">No carousel images configured</p>
        </div>
      </div>);
    }
    return (<div ref={carouselRef} className="hero-carousel relative w-full overflow-hidden bg-gray-100" style={{
            height: isMobile ? "auto" : "".concat(height, "px"),
            minHeight: isMobile ? "250px" : "auto",
            maxHeight: isMobile ? "400px" : "none",
        }} onMouseEnter={function () { return !isMobile && setIsHovered(true); }} onMouseLeave={function () { return !isMobile && setIsHovered(false); }} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      {/* Image slides */}
      <div className="flex transition-transform duration-500 ease-in-out h-full" style={{ transform: "translateX(-".concat(currentIndex * 100, "%)") }}>
        {images.map(function (image, index) { return (<div key={index} className={"hero-carousel-slide w-full h-full flex-shrink-0 ".concat(isMobile ? "bg-cover bg-center" : "")} style={{
                backgroundImage: "url(".concat(image, ")"),
                backgroundSize: isMobile ? "cover" : "cover",
                backgroundPosition: isMobile ? "center center" : "center",
                backgroundRepeat: "no-repeat",
                aspectRatio: isMobile ? "16/9" : "auto",
            }} role="img" aria-label={"Slide ".concat(index + 1, " of ").concat(images.length)}/>); })}
      </div>

      {/* Navigation arrows */}
      {showNavigation && images.length > 1 && !isMobile && (<>
          <button_1.Button variant="outline" size="icon" className="hero-carousel-nav absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 border-white/20 shadow-lg z-10 transition-all duration-200" onClick={prevSlide} aria-label="Previous slide">
            <lucide_react_1.ChevronLeft className="h-4 w-4"/>
          </button_1.Button>
          <button_1.Button variant="outline" size="icon" className="hero-carousel-nav absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 border-white/20 shadow-lg z-10 transition-all duration-200" onClick={nextSlide} aria-label="Next slide">
            <lucide_react_1.ChevronRight className="h-4 w-4"/>
          </button_1.Button>
        </>)}

      {/* Mobile-friendly navigation arrows - smaller and positioned differently */}
      {showNavigation && images.length > 1 && isMobile && (<>
          <button_1.Button variant="outline" size="sm" className="hero-carousel-nav-mobile absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/85 border-white/20 shadow-md z-10 w-8 h-8 p-0 rounded-full" onClick={prevSlide} aria-label="Previous slide">
            <lucide_react_1.ChevronLeft className="h-3 w-3"/>
          </button_1.Button>
          <button_1.Button variant="outline" size="sm" className="hero-carousel-nav-mobile absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white/85 border-white/20 shadow-md z-10 w-8 h-8 p-0 rounded-full" onClick={nextSlide} aria-label="Next slide">
            <lucide_react_1.ChevronRight className="h-3 w-3"/>
          </button_1.Button>
        </>)}

      {/* Dots navigation */}
      {showDots && images.length > 1 && (<div className={"hero-carousel-dots absolute left-1/2 transform -translate-x-1/2 flex z-10 ".concat(isMobile ? "bottom-2 space-x-1" : "bottom-4 space-x-2")}>
          {images.map(function (_, index) { return (<button key={index} onClick={function () { return goToSlide(index); }} className={"hero-carousel-dot rounded-full transition-all duration-200 ".concat(isMobile ? "w-2 h-2 mx-1" : "w-3 h-3", " ").concat(index === currentIndex
                    ? "bg-white shadow-lg scale-110"
                    : "bg-white/50 hover:bg-white/75 active:bg-white/90")} style={{
                    minWidth: isMobile ? "16px" : "12px",
                    minHeight: isMobile ? "16px" : "12px",
                    touchAction: "manipulation",
                }} aria-label={"Go to slide ".concat(index + 1)}/>); })}
        </div>)}

      {/* Slide indicator for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {images.length}
      </div>
    </div>);
}
