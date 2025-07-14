import React, { useState } from "react";
import { StarRating, StarRatingWithHalf } from "@/components/ui/star-rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StarRatingDemo() {
  const [interactiveRating, setInteractiveRating] = useState(3);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Star Rating Component Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Star Ratings */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Star Ratings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>5 Stars:</span>
              <StarRating rating={5} />
            </div>
            <div className="flex items-center justify-between">
              <span>4 Stars:</span>
              <StarRating rating={4} />
            </div>
            <div className="flex items-center justify-between">
              <span>3 Stars:</span>
              <StarRating rating={3} />
            </div>
            <div className="flex items-center justify-between">
              <span>2 Stars:</span>
              <StarRating rating={2} />
            </div>
            <div className="flex items-center justify-between">
              <span>1 Star:</span>
              <StarRating rating={1} />
            </div>
            <div className="flex items-center justify-between">
              <span>0 Stars:</span>
              <StarRating rating={0} />
            </div>
          </CardContent>
        </Card>

        {/* Different Sizes */}
        <Card>
          <CardHeader>
            <CardTitle>Different Sizes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Small:</span>
              <StarRating rating={4} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span>Medium:</span>
              <StarRating rating={4} size="md" />
            </div>
            <div className="flex items-center justify-between">
              <span>Large:</span>
              <StarRating rating={4} size="lg" />
            </div>
          </CardContent>
        </Card>

        {/* With Numbers */}
        <Card>
          <CardHeader>
            <CardTitle>With Rating Numbers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>4.8 Rating:</span>
              <StarRating rating={4.8} showNumber />
            </div>
            <div className="flex items-center justify-between">
              <span>3.2 Rating:</span>
              <StarRating rating={3.2} showNumber />
            </div>
            <div className="flex items-center justify-between">
              <span>1.7 Rating:</span>
              <StarRating rating={1.7} showNumber />
            </div>
          </CardContent>
        </Card>

        {/* Interactive */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Rating</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Click to Rate:</span>
              <StarRating
                rating={interactiveRating}
                interactive
                onRatingChange={setInteractiveRating}
              />
            </div>
            <div className="text-sm text-gray-600">
              Current rating: {interactiveRating}
            </div>
          </CardContent>
        </Card>

        {/* Half Star Support */}
        <Card>
          <CardHeader>
            <CardTitle>Half Star Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>4.7 Stars:</span>
              <StarRatingWithHalf rating={4.7} showNumber />
            </div>
            <div className="flex items-center justify-between">
              <span>3.3 Stars:</span>
              <StarRatingWithHalf rating={3.3} showNumber />
            </div>
            <div className="flex items-center justify-between">
              <span>2.8 Stars:</span>
              <StarRatingWithHalf rating={2.8} showNumber />
            </div>
          </CardContent>
        </Card>

        {/* Real Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Real Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="font-medium">Product Review</div>
              <StarRating rating={4} />
              <p className="text-sm text-gray-600">
                "Beautiful flowers, exactly as shown!"
              </p>
            </div>
            <hr />
            <div className="space-y-2">
              <div className="font-medium">Service Rating</div>
              <StarRating rating={5} showNumber />
              <p className="text-sm text-gray-600">
                "Excellent delivery service, highly recommended!"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
