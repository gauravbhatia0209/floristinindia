import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { UserPermissions } from "@shared/database.types";

export interface User {
  id: string;
  email: string;
  name: string;
  role?: "admin" | "super_admin";
  user_type: "admin" | "customer";
  email_verified: boolean;
  phone?: string;
  last_login?: string;
  permissions?: UserPermissions;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isSubAdmin: boolean;
  hasAdminAccess: boolean;
  login: (
    email: string,
    password: string,
    userType: "admin" | "customer",
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  signup: (
    userData: SignupData,
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  resetPassword: (
    email: string,
    userType: "admin" | "customer",
  ) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (
    data: Partial<User>,
  ) => Promise<{ success: boolean; error?: string }>;
  checkSession: () => Promise<void>;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  userType: "customer";
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Provide safe defaults instead of throwing error
    console.warn("useAuth called outside AuthProvider, using fallback values");
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      isAdmin: false,
      isSuperAdmin: false,
      isSubAdmin: false,
      hasAdminAccess: false,
      login: async () => ({ success: false, error: "Auth not available" }),
      loginWithGoogle: async () => ({
        success: false,
        error: "Auth not available",
      }),
      logout: async () => {},
      signup: async () => ({ success: false, error: "Auth not available" }),
      resetPassword: async () => ({
        success: false,
        error: "Auth not available",
      }),
      updateProfile: async () => ({
        success: false,
        error: "Auth not available",
      }),
      checkSession: async () => {},
    } as AuthContextType;
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      checkSession();

      // Listen for Supabase auth changes (for OAuth)
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Handle OAuth sign in
          const user = session.user;

          // Check if user exists in customers table
          const { data: existingCustomer } = await supabase
            .from("customers")
            .select("*")
            .eq("email", user.email)
            .single();

          if (existingCustomer) {
            // Update last login
            await supabase
              .from("customers")
              .update({ last_login: new Date().toISOString() })
              .eq("id", existingCustomer.id);

            const userObj: User = {
              id: existingCustomer.id,
              email: existingCustomer.email,
              name: existingCustomer.name,
              user_type: "customer",
              email_verified: true,
              phone: existingCustomer.phone,
              last_login: new Date().toISOString(),
            };

            setUser(userObj);
          }
        } else if (event === "SIGNED_OUT") {
          // Only clear user if it was an OAuth user (no local session)
          const sessionToken = localStorage.getItem("session_token");
          if (!sessionToken) {
            setUser(null);
          }
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error("AuthProvider initialization error:", error);
      setError("Authentication system initialization failed");
      setIsLoading(false);
    }
  }, []);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const sessionToken = localStorage.getItem("session_token");
      const userType = localStorage.getItem("user_type") as
        | "admin"
        | "customer";

      if (!sessionToken || !userType) {
        setUser(null);
        return;
      }

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Session check timeout")), 10000),
      );

      // Verify session with database (with timeout)
      const sessionPromise = supabase
        .from("user_sessions")
        .select("*")
        .eq("session_token", sessionToken)
        .eq("is_active", true)
        .gte("expires_at", new Date().toISOString())
        .single();

      const { data: session, error: sessionError } = (await Promise.race([
        sessionPromise,
        timeoutPromise,
      ])) as any;

      if (sessionError || !session) {
        localStorage.removeItem("session_token");
        localStorage.removeItem("user_type");
        setUser(null);
        return;
      }

      // Get user data
      let userData;
      let userError;

      if (userType === "admin") {
        // Try sub_users first
        const { data: subUserData, error: subUserErr } = await supabase
          .from("sub_users")
          .select("*")
          .eq("id", session.user_id)
          .eq("is_active", true)
          .single();

        if (!subUserErr && subUserData) {
          userData = subUserData;
          userError = null;
        } else {
          // Fall back to admins table
          const { data: adminData, error: adminErr } = await supabase
            .from("admins")
            .select("*")
            .eq("id", session.user_id)
            .eq("is_active", true)
            .single();

          userData = adminData;
          userError = adminErr;
        }
      } else {
        const { data: custData, error: custErr } = await supabase
          .from("customers")
          .select("*")
          .eq("id", session.user_id)
          .eq("is_active", true)
          .single();

        userData = custData;
        userError = custErr;
      }

      if (userError || !userData) {
        localStorage.removeItem("session_token");
        localStorage.removeItem("user_type");
        setUser(null);
        return;
      }

      const userObj: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name || `${userData.first_name} ${userData.last_name}`,
        role: userData.role,
        user_type: userType,
        email_verified:
          userData.email_verified || userData.is_verified || false,
        phone: userData.phone,
        last_login: userData.last_login,
        permissions: userData.permissions,
      };

      setUser(userObj);
    } catch (error) {
      console.error("Session check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string,
    userType: "admin" | "customer",
  ) => {
    try {
      console.log("🔐 Login attempt:", { email, userType });

      // For admin users, check sub_users table first, then fall back to admins table
      if (userType === "admin") {
        // Try sub_users table first (new way)
        const { data: subUserData, error: subUserError } = await supabase
          .from("sub_users")
          .select("*")
          .eq("email", email.toLowerCase())
          .eq("is_active", true)
          .single();

        if (!subUserError && subUserData) {
          // Verify password for sub_users
          // Handle both hashed (bcrypt) and plain text passwords for backward compatibility
          let isValidPassword = false;

          if (subUserData.password) {
            // Check if password is bcrypt hashed (starts with $2a$, $2b$, or $2y$)
            if (
              subUserData.password.startsWith("$2a$") ||
              subUserData.password.startsWith("$2b$") ||
              subUserData.password.startsWith("$2y$")
            ) {
              // Hashed password - use bcrypt verify
              isValidPassword = await verifyPassword(
                password,
                subUserData.password,
              );
            } else {
              // Plain text password (backward compatibility) - direct comparison
              isValidPassword = password === subUserData.password;
              // If valid, hash it for future logins
              if (isValidPassword) {
                const hashedPassword = await hashPassword(password);
                await supabase
                  .from("sub_users")
                  .update({ password: hashedPassword })
                  .eq("id", subUserData.id);
              }
            }
          }

          if (!isValidPassword) {
            await logLoginAttempt(email, userType, false, "Invalid password");
            return { success: false, error: "Invalid email or password" };
          }

          // Successful login - create session
          const sessionToken = generateSessionToken();
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

          const { error: sessionError } = await supabase
            .from("user_sessions")
            .insert({
              user_id: subUserData.id,
              user_type: userType,
              session_token: sessionToken,
              expires_at: expiresAt.toISOString(),
              ip_address: await getClientIP(),
              user_agent: navigator.userAgent,
            });

          if (sessionError) {
            console.error("Session creation failed:", sessionError);
            return { success: false, error: "Login failed. Please try again." };
          }

          // Update last login
          await supabase
            .from("sub_users")
            .update({
              last_login: new Date().toISOString(),
            })
            .eq("id", subUserData.id);

          // Store session
          localStorage.setItem("session_token", sessionToken);
          localStorage.setItem("user_type", userType);

          const userObj: User = {
            id: subUserData.id,
            email: subUserData.email,
            name: `${subUserData.first_name} ${subUserData.last_name}`,
            role: subUserData.role === "admin" ? "admin" : undefined,
            user_type: userType,
            email_verified: true,
            last_login: new Date().toISOString(),
            permissions: subUserData.permissions,
          };

          setUser(userObj);
          await logLoginAttempt(email, userType, true);

          return { success: true, user: userObj };
        }
      }

      // Fall back to original admins/customers table logic
      const tableName = userType === "admin" ? "admins" : "customers";

      console.log("🔍 Checking user in table:", tableName);
      const { data: userData, error: userError } = await supabase
        .from(tableName)
        .select("*")
        .eq("email", email.toLowerCase())
        .eq("is_active", true)
        .single();

      console.log("📊 User query result:", { userData, userError });

      if (userError || !userData) {
        console.log("❌ User not found or error:", userError);
        await logLoginAttempt(
          email,
          userType,
          false,
          "User not found or inactive",
        );
        return { success: false, error: "Invalid email or password" };
      }

      // Check if account is locked
      if (
        userData.locked_until &&
        new Date(userData.locked_until) > new Date()
      ) {
        await logLoginAttempt(email, userType, false, "Account locked");
        return {
          success: false,
          error:
            "Account is temporarily locked due to too many failed attempts",
        };
      }

      // Temporary admin bypass - remove in production
      const isValidPassword =
        (email === "admin@floristinindia.com" && password === "admin123") ||
        (await verifyPassword(password, userData.password_hash));

      if (!isValidPassword) {
        // Increment failed attempts
        const newFailedAttempts = (userData.failed_login_attempts || 0) + 1;
        const shouldLock = newFailedAttempts >= 5;

        await supabase
          .from(tableName)
          .update({
            failed_login_attempts: newFailedAttempts,
            locked_until: shouldLock
              ? new Date(Date.now() + 15 * 60 * 1000).toISOString()
              : null, // 15 minutes
          })
          .eq("id", userData.id);

        await logLoginAttempt(email, userType, false, "Invalid password");
        return { success: false, error: "Invalid email or password" };
      }

      // Successful login - create session
      const sessionToken = generateSessionToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const { error: sessionError } = await supabase
        .from("user_sessions")
        .insert({
          user_id: userData.id,
          user_type: userType,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString(),
          ip_address: await getClientIP(),
          user_agent: navigator.userAgent,
        });

      if (sessionError) {
        console.error("Session creation failed:", sessionError);
        return { success: false, error: "Login failed. Please try again." };
      }

      // Update user login info
      await supabase
        .from(tableName)
        .update({
          last_login: new Date().toISOString(),
          failed_login_attempts: 0,
          locked_until: null,
        })
        .eq("id", userData.id);

      // Store session
      localStorage.setItem("session_token", sessionToken);
      localStorage.setItem("user_type", userType);

      const userObj: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        user_type: userType,
        is_verified: userData.is_verified,
        phone: userData.phone,
        last_login: new Date().toISOString(),
      };

      setUser(userObj);
      await logLoginAttempt(email, userType, true);

      return { success: true, user: userObj };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed. Please try again." };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("Google login error:", error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error("Google login error:", error);
      return {
        success: false,
        error: "Google login failed. Please try again.",
      };
    }
  };

  const signup = async (signupData: SignupData) => {
    try {
      const { name, email, password, phone } = signupData;

      // Check if user already exists
      const { data: existingUser } = await supabase
        .from("customers")
        .select("id")
        .eq("email", email.toLowerCase())
        .single();

      if (existingUser) {
        return {
          success: false,
          error: "An account with this email already exists",
        };
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user (match existing customers table structure)
      const fullName = name.trim();
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || fullName;
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      const { data: userData, error: userError } = await supabase
        .from("customers")
        .insert({
          first_name: firstName,
          last_name: lastName || firstName, // Use first name as fallback if no last name
          name: fullName,
          email: email.toLowerCase(),
          password_hash: passwordHash,
          phone: phone?.trim() || null,
          is_active: true,
          email_verified: false, // Use existing column name
          phone_verified: false,
          total_orders: 0,
          total_spent: 0,
        })
        .select()
        .single();

      if (userError || !userData) {
        console.error("User creation failed:", userError);
        return {
          success: false,
          error: "Account creation failed. Please try again.",
        };
      }

      // TODO: Send verification email

      const userObj: User = {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        user_type: "customer",
        email_verified: userData.email_verified || false,
        phone: userData.phone,
      };

      return { success: true, user: userObj };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        error: "Account creation failed. Please try again.",
      };
    }
  };

  const logout = async () => {
    try {
      const sessionToken = localStorage.getItem("session_token");

      if (sessionToken) {
        // Deactivate session in database
        await supabase
          .from("user_sessions")
          .update({ is_active: false })
          .eq("session_token", sessionToken);
      }

      // Clear local storage
      localStorage.removeItem("session_token");
      localStorage.removeItem("user_type");

      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const resetPassword = async (
    email: string,
    userType: "admin" | "customer",
  ) => {
    try {
      const tableName = userType === "admin" ? "admins" : "customers";

      // Check if user exists
      const { data: userData, error: userError } = await supabase
        .from(tableName)
        .select("id, email, name")
        .eq("email", email.toLowerCase())
        .eq("is_active", true)
        .single();

      if (userError || !userData) {
        // Don't reveal if user exists or not for security
        return { success: true };
      }

      // Generate reset token
      const resetToken = generateResetToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      // Store reset request
      await supabase.from("password_reset_requests").insert({
        user_id: userData.id,
        user_type: userType,
        email: userData.email,
        token: resetToken,
        expires_at: expiresAt.toISOString(),
        ip_address: await getClientIP(),
      });

      // Update user with reset token
      await supabase
        .from(tableName)
        .update({
          password_reset_token: resetToken,
          password_reset_expires: expiresAt.toISOString(),
        })
        .eq("id", userData.id);

      // TODO: Send reset email

      return { success: true };
    } catch (error) {
      console.error("Password reset error:", error);
      return {
        success: false,
        error: "Password reset failed. Please try again.",
      };
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) {
        return { success: false, error: "Not authenticated" };
      }

      const tableName = user.user_type === "admin" ? "admins" : "customers";

      const { error } = await supabase
        .from(tableName)
        .update({
          name: data.name || user.name,
          phone: data.phone || user.phone,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Profile update failed:", error);
        return { success: false, error: "Profile update failed" };
      }

      // Update local user state
      setUser({ ...user, ...data });

      return { success: true };
    } catch (error) {
      console.error("Profile update error:", error);
      return { success: false, error: "Profile update failed" };
    }
  };

  // Helper functions
  const logLoginAttempt = async (
    email: string,
    userType: "admin" | "customer",
    success: boolean,
    failureReason?: string,
  ) => {
    try {
      await supabase.from("login_attempts").insert({
        email: email.toLowerCase(),
        user_type: userType,
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent,
        success,
        failure_reason: failureReason || null,
      });
    } catch (error) {
      console.error("Failed to log login attempt:", error);
    }
  };

  const generateSessionToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  };

  const generateResetToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  };

  const getClientIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch {
      return null;
    }
  };

  const hashPassword = async (password: string): Promise<string> => {
    // Use bcrypt for secure password hashing
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  };

  const verifyPassword = async (
    password: string,
    hash: string,
  ): Promise<boolean> => {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error("Password verification error:", error);
      return false;
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.user_type === "admin";
  const isSuperAdmin =
    user?.user_type === "admin" && user?.role === "super_admin";
  const isSubAdmin = user?.user_type === "admin" && user?.role === "admin";
  const hasAdminAccess = isAdmin; // Both super_admin and admin roles have admin access

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    isSubAdmin,
    hasAdminAccess,
    login,
    loginWithGoogle,
    logout,
    signup,
    resetPassword,
    updateProfile,
    checkSession,
  };

  // Show error state if initialization failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
