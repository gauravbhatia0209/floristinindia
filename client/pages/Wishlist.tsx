import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function Wishlist() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Heart className="h-5 w-5 text-rose" />
              My Wishlist
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6 py-8">
            <Heart className="h-16 w-16 mx-auto text-gray-300" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Sign in to your Wishlist</h2>
              <p className="text-gray-600 mb-6">
                Log in to save and view your favorite products
              </p>
            </div>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            My Wishlist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-gray-600 mb-4">
              Save items you love for later.
            </p>
            <Button asChild>
              <a href="/">Browse Products</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
