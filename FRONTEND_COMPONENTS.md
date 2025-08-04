# Frontend Components Reference

## Component Architecture Overview

The frontend uses a hierarchical component structure with shadcn/ui as the base design system, custom business logic components, and page-level components.

```
Component Hierarchy:
├── Layout Components (Header, Footer, Layout)
├── Page Components (Index, Products, ProductDetail, etc.)
├── Business Logic Components (Cart, Checkout, Product Cards)
├── Admin Components (Dashboard, Management interfaces)
├── UI Components (shadcn/ui based)
└── Utility Components (ProtectedRoute, ErrorBoundary)
```

---

## Layout Components

### Header.tsx
**Location**: `/client/components/layout/Header.tsx`

Main navigation component with responsive design.

**Features:**
- Mobile-responsive hamburger menu
- Category dropdown navigation
- Search functionality
- Cart icon with item count
- User authentication status
- Dynamic menu from database

**Props:**
```typescript
interface HeaderProps {
  // No props - uses context for state
}
```

**Usage:**
```tsx
import Header from '@/components/layout/Header';

<Header />
```

**Key Functionality:**
- Category fetching from Supabase
- Mobile menu toggle
- Search modal integration
- Cart count display
- Authentication status checking

---

### Footer.tsx
**Location**: `/client/components/layout/Footer.tsx`

Configurable footer component.

**Features:**
- Newsletter subscription
- Social media links
- Company information
- Dynamic sections from database
- Responsive grid layout

**Configuration:**
Footer content is managed through the admin panel and stored in the database.

---

### Layout.tsx
**Location**: `/client/components/layout/Layout.tsx`

Main layout wrapper component.

**Structure:**
```tsx
<Layout>
  <Header />
  <main>
    <Outlet /> {/* React Router outlet for page content */}
  </main>
  <Footer />
</Layout>
```

---

## Product Components

### ProductCard (Homepage)
**Location**: `/client/pages/Index.tsx` (integrated)

Product display card for homepage featured products.

**Features:**
- 4:5 aspect ratio images
- Uniform card height
- Price display with sale pricing
- Add to cart functionality
- Product link navigation

**Structure:**
```tsx
<Card className="h-full flex flex-col">
  <div className="aspect-[4/5]"> {/* Product Image */}
    <img src={product.images[0]} alt={product.name} />
    {hasDiscount && <Badge>SALE</Badge>}
  </div>
  <CardContent className="flex-grow flex flex-col justify-between">
    <div> {/* Product Info */}
      <h3>{product.name}</h3>
      <div> {/* Price Display */}
        <span>₹{displayPrice}</span>
        {hasDiscount && <span className="line-through">₹{originalPrice}</span>}
      </div>
    </div>
    <Button onClick={handleAddToCart}>Add to Cart</Button>
  </CardContent>
</Card>
```

---

### ProductCard (Products Page)
**Location**: `/client/pages/Products.tsx`

Enhanced product card with list and grid view support.

**View Modes:**
- **Grid View**: Card layout similar to homepage
- **List View**: Horizontal layout with description

**Features:**
- Responsive layout switching
- Product variant display
- Stock status indication
- Quick add to cart

---

### ProductDetail Component
**Location**: `/client/pages/ProductDetail.tsx`

Comprehensive product detail page.

**Features:**
- Image gallery with zoom
- Variant selection (size, color, etc.)
- Quantity selector
- Add to cart with variants
- Related products
- Product reviews section

**Key Sections:**
```tsx
<ProductDetail>
  <ProductImageGallery images={product.images} />
  <ProductInfo>
    <ProductTitle />
    <ProductPrice />
    <VariantSelector />
    <QuantitySelector />
    <AddToCartButton />
  </ProductInfo>
  <ProductTabs>
    <DescriptionTab />
    <ReviewsTab />
    <ShippingTab />
  </ProductTabs>
  <RelatedProducts />
</ProductDetail>
```

---

## Shopping Cart Components

### Cart Component
**Location**: `/client/pages/Cart.tsx`

Shopping cart page with item management.

**Features:**
- Item quantity controls
- Remove items functionality
- Price calculations
- Coupon code application
- Shipping calculator
- Checkout navigation

**Cart Item Structure:**
```tsx
<CartItem>
  <ProductImage />
  <ProductDetails>
    <ProductName />
    <VariantInfo />
    <PricePerUnit />
  </ProductDetails>
  <QuantityControls>
    <DecrementButton />
    <QuantityInput />
    <IncrementButton />
  </QuantityControls>
  <ItemTotal />
  <RemoveButton />
</CartItem>
```

---

### CartContext
**Location**: `/client/contexts/CartContext.tsx`

Global cart state management.

**State Structure:**
```typescript
interface CartState {
  items: CartItem[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  isLoading: boolean;
}
```

**Available Actions:**
```typescript
const {
  items,
  totals,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  applyCoupon,
  calculateShipping
} = useCart();
```

---

## Checkout Components

### Checkout Component
**Location**: `/client/pages/Checkout.tsx`

Multi-step checkout process.

**Steps:**
1. Customer Information
2. Delivery Details
3. Payment Method
4. Order Review

**Features:**
- Form validation with React Hook Form
- Address management
- Delivery date/time selection
- Payment method selection
- Order summary

### ShippingMethodSelector
**Location**: `/client/components/checkout/ShippingMethodSelector.tsx`

Shipping options selection component.

**Features:**
- Multiple shipping methods
- Delivery date picker
- Time slot selection
- Price calculation
- Special delivery options

---

## Admin Components

### AdminLayout.tsx
**Location**: `/client/components/admin/AdminLayout.tsx`

Admin panel layout with navigation.

**Features:**
- Responsive sidebar navigation
- Mobile menu support
- User role display
- Logout functionality
- Security wrapper integration

**Navigation Structure:**
```typescript
const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Categories', href: '/admin/categories', icon: Tags },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  // ... more navigation items
];
```

---

### ProductVariations.tsx
**Location**: `/client/components/admin/ProductVariations.tsx`

Product variant management interface.

**Features:**
- Dynamic variant creation
- Attribute management (size, color, etc.)
- Price/inventory per variant
- Image upload for variants
- Bulk variant operations

**Variant Structure:**
```typescript
interface ProductVariant {
  id: string;
  name: string;
  attributes: Record<string, string>;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  sku: string;
  images: string[];
  is_active: boolean;
}
```

---

### SectionBuilder.tsx
**Location**: `/client/components/admin/SectionBuilder.tsx`

Homepage section management interface.

**Section Types:**
- Hero Carousel
- Featured Products
- Category Grid
- Text Content
- Image Banners

**Features:**
- Drag and drop reordering
- Live preview
- Section configuration
- Content management

---

## UI Components (shadcn/ui)

### Form Components

**Button**
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default|destructive|outline|secondary|ghost|link" 
        size="default|sm|lg|icon">
  Button Text
</Button>
```

**Input**
```tsx
import { Input } from '@/components/ui/input';

<Input 
  type="text|email|password|number"
  placeholder="Enter text"
  value={value}
  onChange={handleChange}
/>
```

**Select**
```tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

<Select onValueChange={handleSelect}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

---

### Display Components

**Card**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content here
  </CardContent>
</Card>
```

**Badge**
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default|secondary|destructive|outline">
  Badge Text
</Badge>
```

**Alert**
```tsx
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

<Alert>
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Alert Title</AlertTitle>
  <AlertDescription>
    Alert description text
  </AlertDescription>
</Alert>
```

---

### Navigation Components

**Breadcrumb**
```tsx
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/products">Products</BreadcrumbLink>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

**Tabs**
```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

---

### Modal Components

**Dialog**
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    Dialog content here
  </DialogContent>
</Dialog>
```

**Sheet (Mobile Menu)**
```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon">
      <Menu className="h-5 w-5" />
    </Button>
  </SheetTrigger>
  <SheetContent side="left">
    <SheetHeader>
      <SheetTitle>Navigation</SheetTitle>
    </SheetHeader>
    Navigation content
  </SheetContent>
</Sheet>
```

---

## Custom Utility Components

### ProtectedRoute.tsx
**Location**: `/client/components/ProtectedRoute.tsx`

Route-level authentication and authorization.

**Usage:**
```tsx
import ProtectedRoute, { AdminRoute } from '@/components/ProtectedRoute';

// Customer protected route
<ProtectedRoute requireAuth={true} requireAdmin={false}>
  <AccountPage />
</ProtectedRoute>

// Admin protected route
<AdminRoute>
  <AdminDashboard />
</AdminRoute>
```

**Props:**
```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}
```

---

### AdminSecurityWrapper.tsx
**Location**: `/client/components/AdminSecurityWrapper.tsx`

Additional security layer for admin components.

**Usage:**
```tsx
import AdminSecurityWrapper from '@/components/AdminSecurityWrapper';

// Regular admin feature
<AdminSecurityWrapper>
  <AdminComponent />
</AdminSecurityWrapper>

// Super admin only feature
<AdminSecurityWrapper requireSuperAdmin={true}>
  <SuperAdminComponent />
</AdminSecurityWrapper>
```

---

### ErrorBoundary.tsx
**Location**: `/client/components/ErrorBoundary.tsx`

React error boundary for graceful error handling.

**Usage:**
```tsx
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</ErrorBoundary>
```

---

## Image Upload Components

### ImageUpload.tsx
**Location**: `/client/components/ui/image-upload.tsx`

File upload component with preview and validation.

**Features:**
- Drag and drop upload
- Image preview
- Multiple file support
- Progress indication
- File validation

**Usage:**
```tsx
import ImageUpload from '@/components/ui/image-upload';

<ImageUpload
  onUpload={handleUpload}
  maxFiles={5}
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
/>
```

---

## Component Development Guidelines

### Component Structure
```tsx
// Import statements
import React from 'react';
import { ComponentProps } from 'react';

// Type definitions
interface ComponentProps {
  // prop definitions
}

// Component definition
export default function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks
  // State
  // Effects
  // Event handlers
  // Render methods
  
  return (
    <div>
      {/* JSX content */}
    </div>
  );
}
```

### Best Practices

1. **TypeScript**: All components must have proper type definitions
2. **Props Interface**: Define clear interfaces for component props
3. **Default Props**: Use default values for optional props
4. **Error Handling**: Implement error boundaries and loading states
5. **Accessibility**: Include proper ARIA attributes and semantic HTML
6. **Performance**: Use React.memo for expensive components
7. **Testing**: Include unit tests for complex logic

### Styling Guidelines

1. **Tailwind CSS**: Use utility classes for styling
2. **Component Variants**: Use cva (class-variance-authority) for component variants
3. **Responsive Design**: Mobile-first approach
4. **Dark Mode**: Consider dark mode support where applicable
5. **Consistent Spacing**: Use Tailwind spacing scale

### State Management

1. **Local State**: useState for component-specific state
2. **Context**: For cross-component state (Auth, Cart)
3. **Custom Hooks**: Extract reusable logic
4. **Props Drilling**: Avoid deep prop drilling, use context instead

For implementation details and examples, refer to the existing components in the codebase.
