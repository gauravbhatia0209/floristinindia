import React from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating = 0,
  maxRating = 5,
  size = "md",
  className = "",
  showNumber = false,
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  // Ensure rating is within bounds
  const clampedRating = Math.max(0, Math.min(maxRating, rating));

  // Size classes
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const starSize = sizeClasses[size];

  const handleStarClick = (starValue: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= clampedRating;

          return (
            <button
              key={index}
              onClick={() => handleStarClick(starValue)}
              disabled={!interactive}
              className={`
                ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
                ${interactive ? "focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded" : ""}
              `}
              type="button"
            >
              <Star
                className={`
                  ${starSize}
                  transition-colors duration-200
                  ${
                    isFilled
                      ? "fill-[#FFD700] text-[#FFD700]"
                      : "fill-[#E0E0E0] text-[#E0E0E0]"
                  }
                  ${interactive && !isFilled ? "hover:fill-[#FFD700] hover:text-[#FFD700]" : ""}
                `}
              />
            </button>
          );
        })}
      </div>

      {showNumber && (
        <span className="text-sm text-gray-600 ml-1">
          ({clampedRating.toFixed(1)})
        </span>
      )}
    </div>
  );
}

// Variant for half-star support (more advanced)
export function StarRatingWithHalf({
  rating = 0,
  maxRating = 5,
  size = "md",
  className = "",
  showNumber = false,
}: Omit<StarRatingProps, "interactive" | "onRatingChange">) {
  const clampedRating = Math.max(0, Math.min(maxRating, rating));

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const starSize = sizeClasses[size];

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {[...Array(maxRating)].map((_, index) => {
          const starValue = index + 1;
          const fillPercentage = Math.max(
            0,
            Math.min(1, clampedRating - index),
          );

          return (
            <div key={index} className="relative">
              {/* Background star (empty) */}
              <Star
                className={`${starSize} fill-[#E0E0E0] text-[#E0E0E0] absolute top-0 left-0`}
              />

              {/* Foreground star (filled) */}
              <div
                className="overflow-hidden relative"
                style={{ width: `${fillPercentage * 100}%` }}
              >
                <Star className={`${starSize} fill-[#FFD700] text-[#FFD700]`} />
              </div>
            </div>
          );
        })}
      </div>

      {showNumber && (
        <span className="text-sm text-gray-600 ml-1">
          ({clampedRating.toFixed(1)})
        </span>
      )}
    </div>
  );
}
