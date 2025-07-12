import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { checkSession } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          navigate("/login?error=auth_failed");
          return;
        }

        if (data.session && data.session.user) {
          const user = data.session.user;

          // Check if user exists in customers table, if not create them
          const { data: existingCustomer } = await supabase
            .from("customers")
            .select("*")
            .eq("email", user.email)
            .single();

          if (!existingCustomer) {
            // Create customer record for Google OAuth user
            const names = user.user_metadata.full_name?.split(" ") || [
              user.email?.split("@")[0] || "User",
            ];
            const firstName = names[0];
            const lastName = names.length > 1 ? names.slice(1).join(" ") : "";

            const { error: insertError } = await supabase
              .from("customers")
              .insert({
                first_name: firstName,
                last_name: lastName || firstName,
                name: user.user_metadata.full_name || firstName,
                email: user.email?.toLowerCase(),
                is_active: true,
                is_verified: true, // Google users are pre-verified
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                auth_provider: "google",
                provider_id: user.id,
              });

            if (insertError) {
              console.error("Error creating customer record:", insertError);
            }
          }

          // Update session
          await checkSession();

          // Redirect to intended page or home
          const redirectTo =
            sessionStorage.getItem("redirectAfterLogin") || "/";
          sessionStorage.removeItem("redirectAfterLogin");
          navigate(redirectTo);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/login?error=auth_failed");
      }
    };

    handleAuthCallback();
  }, [navigate, checkSession]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
