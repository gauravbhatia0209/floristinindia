import { UserPermissions } from "@shared/database.types";

export type ModuleName = keyof UserPermissions;
export type ActionName = "view" | "create" | "edit" | "delete";

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  permissions: UserPermissions | undefined,
  module: ModuleName,
  action: ActionName = "view",
): boolean {
  if (!permissions) return false;
  
  const modulePerms = permissions[module];
  if (!modulePerms) return false;
  
  return (modulePerms as any)[action] === true;
}

/**
 * Check if user can view a module
 */
export function canViewModule(
  permissions: UserPermissions | undefined,
  module: ModuleName,
): boolean {
  return hasPermission(permissions, module, "view");
}

/**
 * Check if user can create in a module
 */
export function canCreate(
  permissions: UserPermissions | undefined,
  module: ModuleName,
): boolean {
  return hasPermission(permissions, module, "create");
}

/**
 * Check if user can edit in a module
 */
export function canEdit(
  permissions: UserPermissions | undefined,
  module: ModuleName,
): boolean {
  return hasPermission(permissions, module, "edit");
}

/**
 * Check if user can delete in a module
 */
export function canDelete(
  permissions: UserPermissions | undefined,
  module: ModuleName,
): boolean {
  return hasPermission(permissions, module, "delete");
}

/**
 * Map navigation items to required module permissions
 */
export function getRequiredModuleForNav(href: string): ModuleName | null {
  const moduleMap: Record<string, ModuleName> = {
    "/admin/products": "products",
    "/admin/categories": "categories",
    "/admin/orders": "orders",
    "/admin/customers": "customers",
    "/admin/coupons": "coupons",
    "/admin/shipping": "shipping",
    "/admin/pages": "pages",
    "/admin/homepage": "homepage",
    "/admin/footer-editor": "pages",
    "/admin/menu-bar": "pages",
    "/admin/settings": "settings",
    "/admin/users": "users",
    "/admin/contact-submissions": "users",
    "/admin/analytics": "orders",
  };

  return moduleMap[href] || null;
}

/**
 * Check if user can access a navigation item
 */
export function canAccessNav(
  href: string,
  permissions: UserPermissions | undefined,
): boolean {
  // Some pages don't require specific permissions
  if (href === "/admin" || href === "/admin/database-setup") {
    return true;
  }

  const requiredModule = getRequiredModuleForNav(href);
  if (!requiredModule) return true; // If no module mapping, allow access

  return canViewModule(permissions, requiredModule);
}
