import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  UserCog,
  Crown,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

interface AdminSetupProps {
  onAdminCreated?: () => void;
}

export default function AdminSetup({ onAdminCreated }: AdminSetupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "super_admin" as "admin" | "super_admin",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (formData.password.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters long",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage({ type: "error", text: "Please enter a valid email address" });
      return;
    }

    try {
      setIsLoading(true);

      // Check if admin already exists
      const { data: existingAdmin } = await supabase
        .from("admins")
        .select("id")
        .eq("email", formData.email.toLowerCase())
        .single();

      if (existingAdmin) {
        setMessage({
          type: "error",
          text: "An admin with this email already exists",
        });
        return;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(formData.password, 12);

      // Create admin user
      const { data: newAdmin, error: createError } = await supabase
        .from("admins")
        .insert({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password_hash: passwordHash,
          role: formData.role,
          is_active: true,
          is_verified: true,
        })
        .select()
        .single();

      if (createError || !newAdmin) {
        console.error("Admin creation failed:", createError);
        setMessage({
          type: "error",
          text: "Failed to create admin user. Please try again.",
        });
        return;
      }

      setMessage({
        type: "success",
        text: `${formData.role === "super_admin" ? "Super Admin" : "Admin"} created successfully! You can now login with these credentials.`,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "super_admin",
      });

      onAdminCreated?.();
    } catch (error) {
      console.error("Admin creation error:", error);
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (message) setMessage(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {showInstructions && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Admin Setup Instructions:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>
                • <strong>Super Admin:</strong> Full access to all features
                including user management
              </li>
              <li>
                • <strong>Admin:</strong> Access to most features except
                critical system settings
              </li>
              <li>• Create at least one Super Admin for initial setup</li>
              <li>
                • You can create additional admins later from the admin panel
              </li>
            </ul>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setShowInstructions(false)}
            >
              Got it
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Create Admin User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter admin full name"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter admin email"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter secure password (min 8 characters)"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                placeholder="Confirm password"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label>Admin Role</Label>
              <div className="flex gap-3 mt-2">
                <Button
                  type="button"
                  variant={
                    formData.role === "super_admin" ? "default" : "outline"
                  }
                  onClick={() => handleInputChange("role", "super_admin")}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Crown className="h-4 w-4" />
                  Super Admin
                </Button>
                <Button
                  type="button"
                  variant={formData.role === "admin" ? "default" : "outline"}
                  onClick={() => handleInputChange("role", "admin")}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Button>
              </div>
            </div>

            {message && (
              <Alert>
                {message.type === "success" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading
                ? "Creating Admin..."
                : `Create ${formData.role === "super_admin" ? "Super Admin" : "Admin"}`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
