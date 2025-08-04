# Florist in India - Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Authentication & Authorization](#authentication--authorization)
9. [UI Components](#ui-components)
10. [React Hooks](#react-hooks)
11. [Pages Structure](#pages-structure)
12. [Deployment](#deployment)
13. [Development Guidelines](#development-guidelines)

---

## Project Overview

**Florist in India** is a full-stack e-commerce platform for flower and gift delivery. The platform supports:

- 🌸 Product catalog with categories (Flowers, Cakes, Plants, etc.)
- 🛒 Shopping cart and checkout functionality
- 👥 Customer and admin authentication
- 📱 Responsive design for mobile and desktop
- 📧 Email notifications for orders
- 📊 Admin dashboard for order management
- 💳 Payment integration (Razorpay)
- 🚚 Order tracking and delivery management

---

## Technology Stack

### Frontend

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **State Management**: React Context API
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **HTTP Client**: Fetch API
- **Password Hashing**: bcryptjs

### Backend

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Custom JWT-based sessions
- **Email Service**: Nodemailer
- **File Upload**: Multer + Supabase Storage
- **Payment**: Razorpay integration

### Development & Deployment

- **Development**: Vite dev server + tsx watch
- **Backend Deployment**: Fly.io
- **Frontend Deployment**: Vercel/Netlify
- **Database**: Supabase hosted PostgreSQL
- **Environment**: Docker containerized

---

## Project Structure

```
florist-in-india/
├── client/                          # Frontend React application
│   ├── components/                  # Reusable UI components
│   │   ├── admin/                   # Admin-specific components
│   │   ├── checkout/                # Checkout flow components
│   │   ├── layout/                  # Layout components (Header, Footer)
│   │   ├── pages/                   # Static page components
│   │   └── ui/                      # shadcn/ui base components
│   ├── contexts/                    # React Context providers
│   ├── hooks/                       # Custom React hooks
│   ├── lib/                         # Utility libraries
│   ├── pages/                       # Page components
│   │   ├── admin/                   # Admin panel pages
│   │   └── [public pages]           # Public-facing pages
│   ├── types/                       # TypeScript type definitions
│   └── utils/                       # Utility functions
├── server/                          # Backend Express application
│   ├── lib/                         # Backend utilities
│   ├── routes/                      # API route handlers
│   ├─��� types/                       # Backend type definitions
│   └── index.ts                     # Server entry point
├── shared/                          # Shared types and utilities
├── public/                          # Static assets
└── docs/                            # Documentation files
```

---

## Frontend Architecture

### Core Concepts

1. **Component-Based Architecture**: Modular, reusable components
2. **Type Safety**: Full TypeScript integration
3. **Responsive Design**: Mobile-first approach with Tailwind CSS
4. **Context-Based State**: Global state via React Context
5. **Protected Routes**: Role-based access control

### Key Directories

#### `/client/components/`

- **`admin/`**: Admin panel specific components
- **`checkout/`**: Shopping cart and checkout components
- **`layout/`**: Header, Footer, Layout wrappers
- **`pages/`**: Static page content components
- **`ui/`**: Base UI components from shadcn/ui

#### `/client/contexts/`

- **`AuthContext.tsx`**: Authentication and user management
- **`CartContext.tsx`**: Shopping cart state management

#### `/client/pages/`

- **Public Pages**: Home, Products, Cart, Checkout, etc.
- **`admin/`**: Admin dashboard and management pages

---

## Backend Architecture

### API Structure

```
server/
��── lib/
│   ├── email-service.ts            # Email notification service
│   ├── payment-gateways.ts         # Payment processing
│   └── supabase.ts                 # Database client
├── routes/
│   ├── admin-updates.ts            # Admin operations
│   ├── ai-data.ts                  # AI-related endpoints
│   ├── email.ts                    # Email sending endpoints
│   ├── payments.ts                 # Payment processing
│   ├── sitemap.ts                  # SEO sitemap generation
│   └── upload.ts                   # File upload handling
└── index.ts                        # Express server setup
```

### Core Services

1. **Authentication Service**: Session-based auth with role management
2. **Email Service**: Order confirmations and notifications
3. **Payment Service**: Razorpay integration
4. **Upload Service**: File handling with Supabase Storage
5. **Database Service**: Supabase client with type safety

---

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`

- **Purpose**: User/Admin login
- **Body**: `{ email, password, userType }`
- **Response**: `{ success, user?, error? }`

#### POST `/api/auth/logout`

- **Purpose**: Session termination
- **Response**: `{ success }`

### Product Endpoints

#### GET `/api/products`

- **Purpose**: Fetch products with pagination
- **Query**: `{ category?, page?, limit?, search? }`
- **Response**: Products array with metadata

#### GET `/api/products/:id`

- **Purpose**: Get single product details
- **Response**: Product object with variants

### Order Endpoints

#### POST `/api/orders`

- **Purpose**: Create new order
- **Body**: Order details with items
- **Response**: Created order with order number

#### GET `/api/orders/:orderNumber`

- **Purpose**: Get order details
- **Response**: Complete order information

#### PUT `/api/orders/:id/status`

- **Purpose**: Update order status (Admin only)
- **Body**: `{ status }`
- **Response**: Updated order

### Email Endpoints

#### POST `/api/email/order-confirmation`

- **Purpose**: Send order confirmation emails
- **Body**: `{ orderNumber }`
- **Response**: `{ success }`

#### POST `/api/email/order-status-update`

- **Purpose**: Send status update email
- **Body**: `{ orderNumber, oldStatus, newStatus }`
- **Response**: `{ success }`

### Payment Endpoints

#### POST `/api/payments/create`

- **Purpose**: Create payment intent
- **Body**: Payment details
- **Response**: Payment intent with client secret

#### POST `/api/payments/verify`

- **Purpose**: Verify payment completion
- **Body**: Payment verification data
- **Response**: Verification result

### Upload Endpoints

#### POST `/api/upload/image`

- **Purpose**: Upload single image
- **Body**: FormData with image file
- **Response**: `{ url, filename }`

#### POST `/api/upload/images`

- **Purpose**: Upload multiple images
- **Body**: FormData with multiple files
- **Response**: Array of uploaded file details

---

## Database Schema

### Core Tables

#### `products`

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  stock_quantity INTEGER DEFAULT 0,
  sku VARCHAR UNIQUE,
  meta_title VARCHAR(200),
  meta_description VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `categories`

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  image_url VARCHAR,
  parent_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `orders`

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  status VARCHAR DEFAULT 'pending',
  payment_status VARCHAR DEFAULT 'pending',
  payment_method VARCHAR,
  payment_reference VARCHAR,
  total_amount DECIMAL(10,2) NOT NULL,
  items JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  delivery_date DATE,
  delivery_slot VARCHAR,
  special_instructions TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `customers`

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR,
  name VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  phone VARCHAR,
  date_of_birth DATE,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  total_orders INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `admins`

```sql
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Authentication Tables

#### `user_sessions`

```sql
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  user_type VARCHAR NOT NULL CHECK (user_type IN ('admin', 'customer')),
  session_token VARCHAR UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  ip_address VARCHAR,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Authentication & Authorization

### User Types & Roles

1. **Customers**

   - Can browse products, place orders, manage profile
   - Session-based authentication
   - Email verification support

2. **Admins**
   - `admin`: Access to most admin features
   - `super_admin`: Full access including user management

### Authentication Flow

1. **Login**: Validate credentials → Create session → Store session token
2. **Session Check**: Verify token → Check expiration → Validate user status
3. **Protected Routes**: Check authentication → Verify role permissions
4. **Logout**: Invalidate session → Clear client storage

### Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **Session Management**: Secure tokens with expiration
- **Failed Login Protection**: Account locking after 5 failed attempts
- **Role-Based Access Control**: Multiple permission levels
- **Admin Security Wrapper**: Real-time access verification

---

## UI Components

### Component Categories

#### Layout Components (`/components/layout/`)

**Header.tsx**

- Responsive navigation with mobile menu
- Category dropdowns with subcategories
- Search, cart, wishlist, and user icons
- Dynamic menu loading from database

**Footer.tsx**

- Configurable footer sections
- Newsletter signup
- Social media links
- Company information

**Layout.tsx**

- Main layout wrapper
- Header and footer integration
- Main content area with proper spacing

#### Admin Components (`/components/admin/`)

**AdminLayout.tsx**

- Admin dashboard layout
- Sidebar navigation
- User role display
- Security wrapper integration

**ProductVariations.tsx**

- Product variant management
- Dynamic pricing and inventory
- Image upload for variants

**SectionBuilder.tsx**

- Homepage section management
- Drag-and-drop interface
- Dynamic content rendering

#### UI Components (`/components/ui/`)

Built on shadcn/ui library with Tailwind CSS:

- **Forms**: Input, Button, Label, Select, Textarea
- **Data Display**: Card, Badge, Table, Alert
- **Navigation**: Breadcrumb, Tabs, Sheet (mobile menu)
- **Feedback**: Dialog, Toast, Alert Dialog
- **Layout**: Separator, Aspect Ratio, Container

#### Custom Components

**HeroCarousel.tsx**

- Image carousel for homepage
- Responsive design
- Auto-play functionality
- SEO-friendly structure

**ProductCard.tsx**

- Uniform product display
- Price formatting
- Add to cart functionality
- Wishlist integration

**ProtectedRoute.tsx**

- Route-level authentication
- Role-based access control
- Loading states and error handling

---

## React Hooks

### Custom Hooks (`/client/hooks/`)

#### `useCart.ts`

```typescript
export const useCart = () => {
  // Cart state management
  // Add/remove items
  // Calculate totals
  // Local storage persistence
};
```

#### `use-mobile.tsx`

```typescript
export const useMobile = () => {
  // Responsive design helper
  // Detect mobile breakpoints
  // Update on window resize
};
```

#### `use-toast.ts`

```typescript
export const useToast = () => {
  // Toast notification system
  // Success/error/warning messages
  // Auto-dismiss functionality
};
```

### Context Hooks

#### `useAuth()` from AuthContext

```typescript
const {
  user, // Current user object
  isAuthenticated, // Boolean auth status
  isAdmin, // Admin role check
  isSuperAdmin, // Super admin check
  hasAdminAccess, // Admin access verification
  login, // Login function
  logout, // Logout function
  checkSession, // Session validation
} = useAuth();
```

#### `useCart()` from CartContext

```typescript
const {
  items, // Cart items array
  totals, // Calculated totals
  addItem, // Add item to cart
  removeItem, // Remove item from cart
  updateQuantity, // Update item quantity
  clearCart, // Clear all items
  isLoading, // Loading state
} = useCart();
```

---

## Pages Structure

### Public Pages

#### **Home Page** (`/pages/Index.tsx`)

- Hero carousel with promotional banners
- Featured product sections
- Category grid display
- Dynamic content from homepage builder
- SEO optimization with meta tags

#### **Product Pages**

**Products Listing** (`/pages/Products.tsx`)

- Category-based filtering
- Search functionality
- Grid and list view modes
- Pagination with infinite scroll
- Sort options (price, popularity, newest)

**Product Detail** (`/pages/ProductDetail.tsx`)

- Product image gallery
- Variant selection (size, color, etc.)
- Add to cart with quantity selection
- Related products
- Product reviews and ratings

#### **Shopping Flow**

**Cart** (`/pages/Cart.tsx`)

- Item list with quantity controls
- Coupon code application
- Shipping calculation
- Checkout button
- Continue shopping link

**Checkout** (`/pages/Checkout.tsx`)

- Multi-step checkout process
- Customer information form
- Delivery address and date selection
- Payment method selection
- Order summary and confirmation

**Checkout Success** (`/pages/CheckoutSuccess.tsx`)

- Order confirmation display
- Payment status verification
- Email notification trigger
- Order tracking information

#### **User Account**

**Account Dashboard** (`/pages/Account.tsx`)

- User profile management
- Order history with status
- Address book
- Wishlist management
- Linked orders (email/phone based)

**Order Tracking** (`/pages/TrackOrder.tsx`)

- Real-time order status
- Delivery tracking
- Contact support options

### Admin Pages (`/pages/admin/`)

#### **Dashboard** (`/admin/Dashboard.tsx`)

- Key metrics and analytics
- Recent orders overview
- Quick action buttons
- Email testing interface
- System status indicators

#### **Product Management**

**Products** (`/admin/Products.tsx`)

- Product listing with search/filter
- Bulk operations (activate/deactivate)
- Quick edit functionality
- Stock management

**Product Edit** (`/admin/ProductEdit.tsx`)

- Complete product form
- Image upload and management
- SEO settings
- Variant configuration
- Category assignment

#### **Order Management**

**Orders** (`/admin/Orders.tsx`)

- Order listing with filters
- Status update functionality
- Order details modal
- Customer information
- Email notification triggers

#### **Content Management**

**Categories** (`/admin/Categories.tsx`)

- Category tree management
- Image upload for categories
- SEO settings per category
- Parent-child relationships

**Homepage Builder** (`/admin/HomepageBuilder.tsx`)

- Drag-and-drop section builder
- Hero carousel management
- Featured product sections
- Category grid configuration

**Pages** (`/admin/Pages.tsx`)

- Static page management
- Rich text editor
- SEO meta settings
- Page status control

#### **System Management**

**Users** (`/admin/Users.tsx`)

- Admin user management
- Role assignment
- Account status control
- Permission management

**Settings** (`/admin/Settings.tsx`)

- Site-wide configuration
- Payment gateway settings
- Email service configuration
- General business settings

---

## Deployment

### Development Setup

1. **Install Dependencies**

```bash
# Root dependencies
npm install

# Client dependencies
cd client && npm install

# Server dependencies
cd server && npm install
```

2. **Environment Configuration**

```bash
# Copy environment files
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

3. **Database Setup**

- Create Supabase project
- Run SQL migrations from `/client/sql/`
- Configure RLS policies

4. **Start Development Servers**

```bash
# Start both client and server
npm run dev

# Or individually
npm run dev:client  # Frontend on port 5173
npm run dev:server  # Backend on port 3000
```

### Production Deployment

#### Frontend (Vercel/Netlify)

```bash
# Build command
npm run build:client

# Output directory
client/dist

# Environment variables
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://your-backend-url
```

#### Backend (Fly.io)

```bash
# Deploy to Fly.io
fly deploy

# Environment variables
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

---

## Development Guidelines

### Code Standards

1. **TypeScript**: Strict type checking enabled
2. **ESLint**: Code quality and consistency
3. **Prettier**: Code formatting
4. **Component Structure**: Functional components with hooks
5. **File Naming**: PascalCase for components, camelCase for utilities

### Best Practices

#### Component Design

- Single responsibility principle
- Props interface definition
- Error boundary implementation
- Loading states for async operations

#### State Management

- Context for global state
- Local state for component-specific data
- Custom hooks for reusable logic
- Immutable state updates

#### Performance

- Code splitting with lazy loading
- Image optimization and lazy loading
- Debounced search inputs
- Memoization for expensive calculations

#### Security

- Input validation and sanitization
- XSS prevention
- CSRF protection
- Secure authentication flow

### API Design Principles

1. **RESTful Routes**: Standard HTTP methods and status codes
2. **Error Handling**: Consistent error response format
3. **Validation**: Request/response schema validation
4. **Documentation**: Comprehensive API documentation
5. **Versioning**: API version management

### Database Best Practices

1. **Normalization**: Proper relational design
2. **Indexing**: Performance optimization
3. **RLS Policies**: Row-level security
4. **Migrations**: Version-controlled schema changes
5. **Backup Strategy**: Regular automated backups

---

## Troubleshooting

### Common Issues

#### Authentication

- Check session token expiration
- Verify user role permissions
- Clear browser localStorage

#### Database Connection

- Verify Supabase credentials
- Check RLS policy permissions
- Review connection limits

#### Email Service

- Confirm SMTP credentials
- Check email template rendering
- Verify environment variables

#### Payment Processing

- Validate Razorpay configuration
- Check webhook endpoints
- Review payment flow logs

### Development Tools

- **Chrome DevTools**: Component debugging
- **React Developer Tools**: State inspection
- **Supabase Dashboard**: Database management
- **Postman**: API testing
- **Fly.io Logs**: Server monitoring

---

## Contributing

1. **Fork** the repository
2. **Create** feature branch
3. **Follow** coding standards
4. **Write** tests for new features
5. **Submit** pull request with description

For questions or support, contact the development team or refer to the project documentation.
