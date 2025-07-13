# 🌸 Florist in India - Premium E-commerce Platform

A fully dynamic, database-driven e-commerce website for premium flower delivery services across India. Built with modern web technologies and designed for scalability, performance, and beautiful user experience.

![Florist in India](https://via.placeholder.com/1200x600/E91E63/FFFFFF?text=Florist+in+India+-+Premium+Flower+Delivery)

## ✨ Features

### 🎯 Core Features

- **Fully Database-Driven**: Every element is stored in and fetched from the database
- **Dynamic Homepage**: Section-based homepage with admin control
- **Product Management**: Complete product catalog with categories, variants, and file uploads
- **Real-time Cart**: Persistent shopping cart with local storage backup
- **Responsive Design**: Beautiful UI that works on all devices
- **Modern Stack**: React 18, TypeScript, Tailwind CSS, Supabase

### 🛍️ E-commerce Features

- **Product Catalog**: Advanced filtering, sorting, and search
- **Shopping Cart**: Add to cart, quantity management, persistent storage
- **Wishlist**: Save favorite products for later
- **User Accounts**: Customer registration and profile management
- **Order Management**: Complete order lifecycle tracking
- **Payment Integration**: Ready for Razorpay, PhonePe, Cashfree
- **Delivery Management**: Pincode-based delivery zones and scheduling

### 🎨 Design & UX

- **Beautiful Florist Theme**: Custom color palette inspired by flowers
- **Modern Animations**: Smooth transitions and micro-interactions
- **Glass Morphism**: Modern UI design elements
- **Gradient Backgrounds**: Beautiful rose, lavender, and sunset gradients
- **Responsive Grid**: Perfect layout on desktop, tablet, and mobile

### 🔧 Admin Features (Planned)

- **Dynamic Content Management**: Modify any section without code
- **Product Management**: Add, edit, delete products and categories
- **Order Management**: Track and update order statuses
- **Customer Management**: View customer data and order history
- **Analytics Dashboard**: Sales reports and insights

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account (or PostgreSQL database)
- Git

### 1. Clone and Install

```bash
git clone <repository-url>
cd florist-india
npm install
```

### 2. Database Setup

#### Option A: Using Supabase (Recommended)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `database-setup.sql`
3. Get your project URL and anon key from Settings > API

#### Option B: Using PostgreSQL

1. Create a new PostgreSQL database
2. Run the `database-setup.sql` script
3. Update the connection string in your environment

### 3. Environment Configuration

```bash
cp .env.example .env
```

Update `.env` with your actual values:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Other configurations...
```

### 4. Start Development

```bash
npm run dev
```

Visit `http://localhost:8080` to see your application.

## 🏗️ Project Structure

```
florist-india/
├── client/                     # React frontend
│   ├── components/
│   │   ├── layout/            # Header, Footer, Layout
│   │   └── ui/                # Reusable UI components
│   ├── contexts/              # React contexts (Cart, etc.)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and configurations
│   ├── pages/                 # Route components
│   └── global.css             # Global styles and theme
├── server/                     # Express API backend
│   ├── routes/                # API route handlers
│   └── index.ts               # Server setup
├── shared/                     # Shared types and utilities
│   ├── api.ts                 # API interfaces
│   └── database.types.ts      # Database type definitions
├── database-setup.sql          # Database schema and sample data
└── README.md
```

## 🎨 Design System

### Color Palette

The application uses a beautiful flower-inspired color palette:

- **Primary (Rose)**: `hsl(339, 82%, 51%)` - Deep rose pink for primary actions
- **Peach**: `hsl(24, 100%, 75%)` - Warm peach for accents
- **Lavender**: `hsl(280, 65%, 85%)` - Soft lavender for secondary elements
- **Sage**: `hsl(95, 20%, 70%)` - Natural sage green
- **Cream**: `hsl(47, 66%, 95%)` - Light cream backgrounds
- **Gold**: `hsl(43, 96%, 56%)` - Golden yellow for highlights

### Typography

- **Headers**: Bold, gradient text effects
- **Body**: Clean, readable sans-serif
- **Buttons**: Medium weight with proper contrast

### Animations

- **Float Animation**: Gentle floating effect for decorative elements
- **Bloom Animation**: Scale and rotate effect for interactive elements
- **Image Hover**: Scale and brightness effects on product images

## 🗄️ Database Schema

### Core Tables

- **`site_settings`**: Global site configuration
- **`product_categories`**: Product categories and subcategories
- **`products`**: Product catalog with variants and metadata
- **`customers`**: Customer profiles and preferences
- **`orders`**: Complete order information and tracking
- **`homepage_sections`**: Dynamic homepage content sections

### Key Features

- **UUID Primary Keys**: For better security and performance
- **JSONB Columns**: For flexible metadata storage
- **Automatic Timestamps**: `created_at` and `updated_at` triggers
- **Indexes**: Optimized for common queries
- **Constraints**: Data integrity and validation

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run start           # Start production server

# Code Quality
npm run typecheck       # TypeScript validation
npm test               # Run tests
npm run format.fix     # Format code with Prettier
```

## 🌐 API Endpoints

### Products

- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `GET /api/categories` - List categories

### Orders (Planned)

- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id` - Update order status

### Customer Management (Planned)

- `POST /api/customers` - Register customer
- `GET /api/customers/:id` - Get customer profile
- `PUT /api/customers/:id` - Update customer info

## 🚀 Deployment

### Netlify (Recommended)

The project includes Netlify configuration:

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on git push

### Manual Deployment

```bash
npm run build
npm run start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "start"]
```

## 🔄 Data Flow

### Frontend to Database

1. **Supabase Client**: Direct connection from React components
2. **Real-time Updates**: Automatic UI updates when data changes
3. **Optimistic Updates**: Immediate UI feedback with rollback on errors

### Admin Panel (Future)

1. **Content Management**: Admin can modify homepage sections
2. **Product Management**: CRUD operations for products and categories
3. **Order Management**: Status updates and customer communication

## 🎯 Roadmap

### Phase 1 (Current)

- ✅ Beautiful homepage with dynamic sections
- ✅ Product catalog with filtering and search
- ✅ Shopping cart functionality
- ✅ Responsive design system

### Phase 2 (Next)

- 🔄 Product detail pages
- 🔄 User authentication and accounts
- 🔄 Checkout and payment integration
- 🔄 Order tracking system

### Phase 3 (Future)

- 📅 Admin dashboard and CMS
- 📅 Advanced search and recommendations
- 📅 Mobile app (React Native)
- 📅 Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the amazing backend-as-a-service platform
- **Radix UI** for the excellent component primitives
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide React** for the beautiful icons

## 📞 Support

For support and questions:

- 📧 Email: orders@floristinindia.com
- 📱 Phone: +91 98765 43210
- 🌐 Website: [www.floristinindia.com](https://www.floristinindia.com)

---

**Built with ❤️ for flower lovers across India** 🌸🇮🇳





components/admin/ProductVariations.tsx:786:19 - error TS2322: Type '{ currentImage: string; onImageChange: (url: string) => void; uploadPath: string; }' is not assignable to type 'IntrinsicAttributes & SingleImageUploadProps'.
  Property 'currentImage' does not exist on type 'IntrinsicAttributes & SingleImageUploadProps'.

786                   currentImage={formData.image_url}
                      ~~~~~~~~~~~~

components/admin/SectionEditor.tsx:851:38 - error TS2322: Type 'number' is not assignable to type 'string'.

851     updateNestedContent(["features", index, key], value);
                                         ~~~~~

components/admin/SectionEditor.tsx:1099:42 - error TS2322: Type 'number' is not assignable to type 'string'.

1099     updateNestedContent(["testimonials", index, key], value);
                                              ~~~~~

components/AIMetaTags.tsx:232:35 - error TS2339: Property 'name' does not exist on type 'string'.

232           metaTitle = `${category.name} - ${siteName}`;
                                      ~~~~

components/AIMetaTags.tsx:233:41 - error TS2339: Property 'description' does not exist on type 'string'.

233           metaDescription = `${category.description || `Beautiful ${category.name.toLowerCase()} for all occasions.`} Fresh flowers with same-day delivery across India.`;
                                            ~~~~~~~~~~~

components/AIMetaTags.tsx:233:78 - error TS2339: Property 'name' does not exist on type 'string'.

233           metaDescription = `${category.description || `Beautiful ${category.name.toLowerCase()} for all occasions.`} Fresh flowers with same-day delivery across India.`;
                                                                                 ~~~~

components/AIMetaTags.tsx:236:22 - error TS2339: Property 'name' does not exist on type 'string'.

236             category.name.toLowerCase(),
                         ~~~~

components/AIMetaTags.tsx:237:22 - error TS2339: Property 'slug' does not exist on type 'string'.

237             category.slug,
                         ~~~~

components/AIMetaTags.tsx:242:31 - error TS2339: Property 'slug' does not exist on type 'string'.

242           category = category.slug;
                                  ~~~~

components/AIMetaTags.tsx:244:33 - error TS2339: Property 'slug' does not exist on type 'string'.

244           context = `${category.slug}-flowers`;
                                    ~~~~

components/pages/DeliveryInfoPage.tsx:291:26 - error TS2339: Property 'updated_at' does not exist on type 'DeliveryPageData'.

291               {pageData?.updated_at
                             ~~~~~~~~~~

components/pages/DeliveryInfoPage.tsx:292:37 - error TS2339: Property 'updated_at' does not exist on type 'DeliveryPageData'.

292                 ? new Date(pageData.updated_at).toLocaleDateString()
                                        ~~~~~~~~~~

components/pages/PrivacyPolicyPage.tsx:294:26 - error TS2339: Property 'updated_at' does not exist on type 'PrivacyPageData'.

294               {pageData?.updated_at
                             ~~~~~~~~~~

components/pages/PrivacyPolicyPage.tsx:295:37 - error TS2339: Property 'updated_at' does not exist on type 'PrivacyPageData'.

295                 ? new Date(pageData.updated_at).toLocaleDateString()
                                        ~~~~~~~~~~

components/pages/TermsConditionsPage.tsx:348:26 - error TS2339: Property 'updated_at' does not exist on type 'TermsPageData'.

348               {pageData?.updated_at
                             ~~~~~~~~~~

components/pages/TermsConditionsPage.tsx:349:37 - error TS2339: Property 'updated_at' does not exist on type 'TermsPageData'.

349                 ? new Date(pageData.updated_at).toLocaleDateString()
                                        ~~~~~~~~~~

components/SectionRenderer.tsx:409:11 - error TS2339: Property 'addToCart' does not exist on type 'CartContextType'.

409   const { addToCart } = useCart();
              ~~~~~~~~~

components/SectionRenderer.tsx:661:27 - error TS2339: Property 'image' does not exist on type '{ id: string; name: string; slug: string; description: string; image_url: string; parent_id: string; is_active: boolean; sort_order: number; meta_title: string; meta_description: string; show_in_menu: boolean; created_at: string; updated_at: string; }'.

661                 {category.image ? (
                              ~~~~~

components/SectionRenderer.tsx:663:35 - error TS2339: Property 'image' does not exist on type '{ id: string; name: string; slug: string; description: string; image_url: string; parent_id: string; is_active: boolean; sort_order: number; meta_title: string; meta_description: string; show_in_menu: boolean; created_at: string; updated_at: string; }'.

663                     src={category.image}
                                      ~~~~~

contexts/AuthContext.tsx:315:9 - error TS2353: Object literal may only specify known properties, and 'is_verified' does not exist in type 'User'.

315         is_verified: userData.is_verified,
            ~~~~~~~~~~~

contexts/CartContext.tsx:8:10 - error TS2305: Module '"@/types/database.types"' has no exported member 'CartItem'.

8 import { CartItem } from "@/types/database.types";
           ~~~~~~~~

lib/productUtils.ts:5:3 - error TS2305: Module '"@/types/database.types"' has no exported member 'ProductCategoryAssignment'.

5   ProductCategoryAssignment,
    ~~~~~~~~~~~~~~~~~~~~~~~~~

lib/shipping-service.ts:102:5 - error TS2741: Property 'time_slot_required' is missing in type '{ method_id: any; config_id: any; name: any; description: any; type: any; price: any; free_shipping_minimum: any; delivery_time: any; rules: any; zone_id: any; zone_name: any; }' but required in type 'AvailableShippingMethod'.

102     return method
        ~~~~~~

  types/shipping.ts:61:3
    61   time_slot_required: boolean;
         ~~~~~~~~~~~~~~~~~~
    'time_slot_required' is declared here.

pages/admin/Analytics.tsx:214:9 - error TS2740: Type '{}' is missing the following properties from type '{ totalRevenue: number; totalOrders: number; avgOrderValue: number; topProducts: { name: string; sales: number; revenue: number; }[]; conversionRate: number; refunds: number; revenueByCategory: { ...; }[]; }': totalRevenue, totalOrders, avgOrderValue, topProducts, and 3 more.

214         sales: salesData,
            ~~~~~

  pages/admin/Analytics.tsx:69:3
    69   sales: {
         ~~~~~
    The expected type comes from property 'sales' which is declared here on type 'AnalyticsData'

pages/admin/Analytics.tsx:215:9 - error TS2739: Type '{}' is missing the following properties from type '{ newCustomers: number; returningCustomers: number; avgOrderFrequency: number; topLocations: { location: string; count: number; }[]; cltv: number; }': newCustomers, returningCustomers, avgOrderFrequency, topLocations, cltv

215         customers: customerData,
            ~~~~~~~~~

  pages/admin/Analytics.tsx:78:3
    78   customers: {
         ~~~~~~~~~
    The expected type comes from property 'customers' which is declared here on type 'AnalyticsData'

pages/admin/Analytics.tsx:216:9 - error TS2739: Type '{}' is missing the following properties from type '{ topViewed: { name: string; views: number; }[]; cartAdds: { name: string; adds: number; }[]; lowStock: { name: string; stock: number; }[]; outOfStock: number; }': topViewed, cartAdds, lowStock, outOfStock

216         products: productData,
            ~~~~~~~~

  pages/admin/Analytics.tsx:85:3
    85   products: {
         ~~~~~~~~
    The expected type comes from property 'products' which is declared here on type 'AnalyticsData'

pages/admin/Analytics.tsx:223:32 - error TS2339: Property 'totalOrders' does not exist on type '{}'.

223           complete: ordersData.totalOrders,
                                   ~~~~~~~~~~~

pages/admin/Categories.tsx:151:17 - error TS2322: Type '{ checked: boolean; onCheckedChange: () => void; size: string; }' is not assignable to type 'IntrinsicAttributes & Omit<SwitchProps & RefAttributes<HTMLButtonElement>, "ref"> & RefAttributes<HTMLButtonElement>'.
  Property 'size' does not exist on type 'IntrinsicAttributes & Omit<SwitchProps & RefAttributes<HTMLButtonElement>, "ref"> & RefAttributes<HTMLButtonElement>'.

151                 size="sm"
                    ~~~~

pages/admin/Categories.tsx:158:17 - error TS2322: Type '{ checked: boolean; onCheckedChange: () => void; size: string; }' is not assignable to type 'IntrinsicAttributes & Omit<SwitchProps & RefAttributes<HTMLButtonElement>, "ref"> & RefAttributes<HTMLButtonElement>'.
  Property 'size' does not exist on type 'IntrinsicAttributes & Omit<SwitchProps & RefAttributes<HTMLButtonElement>, "ref"> & RefAttributes<HTMLButtonElement>'.

158                 size="sm"
                    ~~~~

pages/admin/Coupons.tsx:73:23 - error TS2345: Argument of type '{ id: any; name: any; }[]' is not assignable to parameter of type 'SetStateAction<{ id: string; name: string; slug: string; description: string; image_url: string; parent_id: string; is_active: boolean; sort_order: number; meta_title: string; meta_description: string; show_in_menu: boolean; created_at: string; updated_at: string; }[]>'.
  Type '{ id: any; name: any; }[]' is not assignable to type '{ id: string; name: string; slug: string; description: string; image_url: string; parent_id: string; is_active: boolean; sort_order: number; meta_title: string; meta_description: string; show_in_menu: boolean; created_at: string; updated_at: string; }[]'.
    Type '{ id: any; name: any; }' is missing the following properties from type '{ id: string; name: string; slug: string; description: string; image_url: string; parent_id: string; is_active: boolean; sort_order: number; meta_title: string; meta_description: string; show_in_menu: boolean; created_at: string; updated_at: string; }': slug, description, image_url, parent_id, and 7 more.

73         setCategories(data);
                         ~~~~

pages/admin/HomepageBuilder.tsx:151:39 - error TS2304: Cannot find name 'SectionTemplate'.

151   async function addSection(template: SectionTemplate) {
                                          ~~~~~~~~~~~~~~~

pages/admin/HomepageBuilder.tsx:577:44 - error TS2345: Argument of type '{ id: any; name: any; slug: any; price: any; sale_price: any; images: any; }[]' is not assignable to parameter of type 'SetStateAction<{ id: string; name: string; slug: string; description: string; short_description: string; price: number; sale_price: number; sku: string; stock_quantity: number; is_active: boolean; is_featured: boolean; ... 13 more ...; updated_at: string; }[]>'.
  Type '{ id: any; name: any; slug: any; price: any; sale_price: any; images: any; }[]' is not assignable to type '{ id: string; name: string; slug: string; description: string; short_description: string; price: number; sale_price: number; sku: string; stock_quantity: number; is_active: boolean; is_featured: boolean; ... 13 more ...; updated_at: string; }[]'.
    Type '{ id: any; name: any; slug: any; price: any; sale_price: any; images: any; }' is missing the following properties from type '{ id: string; name: string; slug: string; description: string; short_description: string; price: number; sale_price: number; sku: string; stock_quantity: number; is_active: boolean; is_featured: boolean; ... 13 more ...; updated_at: string; }': description, short_description, sku, stock_quantity, and 15 more.

577         if (products) setAvailableProducts(products);
                                               ~~~~~~~~

pages/admin/HomepageBuilder.tsx:587:48 - error TS2345: Argument of type '{ id: any; name: any; slug: any; image_url: any; }[]' is not assignable to parameter of type 'SetStateAction<{ id: string; name: string; slug: string; description: string; image_url: string; parent_id: string; is_active: boolean; sort_order: number; meta_title: string; meta_description: string; show_in_menu: boolean; created_at: string; updated_at: string; }[]>'.
  Type '{ id: any; name: any; slug: any; image_url: any; }[]' is not assignable to type '{ id: string; name: string; slug: string; description: string; image_url: string; parent_id: string; is_active: boolean; sort_order: number; meta_title: string; meta_description: string; show_in_menu: boolean; created_at: string; updated_at: string; }[]'.
    Type '{ id: any; name: any; slug: any; image_url: any; }' is missing the following properties from type '{ id: string; name: string; slug: string; description: string; image_url: string; parent_id: string; is_active: boolean; sort_order: number; meta_title: string; meta_description: string; show_in_menu: boolean; created_at: string; updated_at: string; }': description, parent_id, is_active, sort_order, and 5 more.

587         if (categories) setAvailableCategories(categories);
                                                   ~~~~~~~~~~

pages/admin/HomepageBuilder.tsx:1132:9 - error TS2367: This comparison appears to be unintentional because the types '"banner" | "hero" | "category_grid" | "product_carousel" | "product_grid" | "text_block" | "image_block" | "testimonials" | "newsletter" | "features"' and '"hero_carousel"' have no overlap.

1132       {(section.type === "hero_carousel" ||
             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

pages/Index.tsx:22:3 - error TS2305: Module '"@/types/database.types"' has no exported member 'HomepageSection'.

22   HomepageSection,
     ~~~~~~~~~~~~~~~

pages/Index.tsx:68:27 - error TS2345: Argument of type '{ id: any; name: any; slug: any; price: any; sale_price: any; images: any; is_active: any; }[]' is not assignable to parameter of type 'SetStateAction<{ id: string; name: string; slug: string; description: string; images: string[]; price: number; sale_price: number; cost_price: number; sku: string; barcode: string; track_inventory: boolean; inventory_quantity: number; ... 14 more ...; updated_at: string; }[]>'.
  Type '{ id: any; name: any; slug: any; price: any; sale_price: any; images: any; is_active: any; }[]' is not assignable to type '{ id: string; name: string; slug: string; description: string; images: string[]; price: number; sale_price: number; cost_price: number; sku: string; barcode: string; track_inventory: boolean; inventory_quantity: number; ... 14 more ...; updated_at: string; }[]'.
    Type '{ id: any; name: any; slug: any; price: any; sale_price: any; images: any; is_active: any; }' is missing the following properties from type '{ id: string; name: string; slug: string; description: string; images: string[]; price: number; sale_price: number; cost_price: number; sku: string; barcode: string; track_inventory: boolean; inventory_quantity: number; ... 14 more ...; updated_at: string; }': description, cost_price, sku, barcode, and 16 more.

68       setFeaturedProducts(fallbackData);
                             ~~~~~~~~~~~~

pages/Index.tsx:280:21 - error TS2304: Cannot find name 'id'.

280                     id,
                        ~~

pages/Index.tsx:782:43 - error TS2339: Property 'style' does not exist on type 'Element'.

782                               placeholder.style.display = "block";
                                              ~~~~~

pages/Index.tsx:956:43 - error TS2339: Property 'style' does not exist on type 'Element'.

956                               placeholder.style.display = "block";
                                              ~~~~~

pages/Page.tsx:237:32 - error TS2339: Property 'blocks' does not exist on type 'never'.

237               pageData.content.blocks
                                   ~~~~~~

pages/Page.tsx:242:37 - error TS2339: Property 'blocks' does not exist on type 'never'.

242                   {pageData.content.blocks.map((block: any, index: number) => {
                                        ~~~~~~

pages/ProductDetail.tsx:335:28 - error TS2339: Property 'category_name' does not exist on type '{ id: string; name: string; slug: string; description: string; short_description: string; price: number; sale_price: number; sku: string; stock_quantity: number; is_active: boolean; is_featured: boolean; ... 13 more ...; updated_at: string; }'.

335     category_name: product.category_name,
                               ~~~~~~~~~~~~~

pages/Products.tsx:65:30 - error TS2304: Cannot find name 'useGoogleAnalytics'.

65   const { trackAddToCart } = useGoogleAnalytics();
                                ~~~~~~~~~~~~~~~~~~

pages/Products.tsx:66:48 - error TS2304: Cannot find name 'useFacebookPixel'.

66   const { trackAddToCart: trackFBAddToCart } = useFacebookPixel();
                                                  ~~~~~~~~~~~~~~~~

pages/Signup.tsx:447:19 - error TS2322: Type 'Dispatch<SetStateAction<boolean>>' is not assignable to type '(checked: CheckedState) => void'.
  Types of parameters 'value' and 'checked' are incompatible.
    Type 'CheckedState' is not assignable to type 'SetStateAction<boolean>'.
      Type '"indeterminate"' is not assignable to type 'SetStateAction<boolean>'.

447                   onCheckedChange={setAcceptTerms}
                      ~~~~~~~~~~~~~~~

  ../node_modules/@radix-ui/react-checkbox/dist/index.d.mts:22:5
    22     onCheckedChange?(checked: CheckedState): void;
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    The expected type comes from property 'onCheckedChange' which is declared here on type 'IntrinsicAttributes & Omit<CheckboxProps & RefAttributes<HTMLButtonElement>, "ref"> & RefAttributes<...>'

pages/TrackOrder.tsx:198:22 - error TS2339: Property 'phone' does not exist on type '{ first_name: any; last_name: any; email: any; phone: any; }[]'.

198           ? customer.phone === verificationField.trim() ||
                         ~~~~~

pages/TrackOrder.tsx:199:22 - error TS2339: Property 'phone' does not exist on type '{ first_name: any; last_name: any; email: any; phone: any; }[]'.

199             customer.phone === `+91${verificationField.trim()}` ||
                         ~~~~~

pages/TrackOrder.tsx:200:22 - error TS2339: Property 'phone' does not exist on type '{ first_name: any; last_name: any; email: any; phone: any; }[]'.

200             customer.phone
                         ~~~~~

pages/TrackOrder.tsx:203:22 - error TS2339: Property 'email' does not exist on type '{ first_name: any; last_name: any; email: any; phone: any; }[]'.

203           : customer.email.toLowerCase() ===
                         ~~~~~

pages/TrackOrder.tsx:215:20 - error TS2352: Conversion of type '{ items: any; customer: { first_name: any; last_name: any; email: any; phone: any; }[]; id: any; order_number: any; status: any; total_amount: any; shipping_amount: any; shipping_address: any; delivery_date: any; ... 6 more ...; customers: { first_name: any; last_name: any; email: any; phone: any; }[]; }' to type 'OrderData' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
  Types of property 'customer' are incompatible.
    Type '{ first_name: any; last_name: any; email: any; phone: any; }[]' is missing the following properties from type '{ first_name: string; last_name: string; email: string; phone: string; }': first_name, last_name, email, phone

215       setOrderData({
                       ~
216         ...orderData,
    ~~~~~~~~~~~~~~~~~~~~~
... 
218         customer: customer,
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~
219       } as OrderData);
    ~~~~~~~~~~~~~~~~~~~~

../server/routes/admin-updates.ts:2:26 - error TS2307: Cannot find module '../lib/supabase.js' or its corresponding type declarations.

2 import { supabase } from "../lib/supabase.js";
                           ~~~~~~~~~~~~~~~~~~~~

../server/routes/ai-data.ts:2:26 - error TS2307: Cannot find module '../lib/supabase.js' or its corresponding type declarations.

2 import { supabase } from "../lib/supabase.js";
                           ~~~~~~~~~~~~~~~~~~~~

../server/routes/sitemap.ts:2:26 - error TS2307: Cannot find module '../lib/supabase.js' or its corresponding type declarations.

2 import { supabase } from "../lib/supabase.js";
                           ~~~~~~~~~~~~~~~~~~~~

../server/routes/upload.ts:107:33 - error TS2349: This expression is not callable.
  Not all constituents of type 'File[] | (<U>(callbackfn: (value: File, index: number, array: File[]) => U, thisArg?: any) => U[])' are callable.
    Type 'File[]' has no call signatures.

107     const imageUrls = req.files.map((file) => ({
                                    ~~~


Found 54 errors in 25 files.

Errors  Files
     1  components/admin/ProductVariations.tsx:786
     2  components/admin/SectionEditor.tsx:851
     7  components/AIMetaTags.tsx:232
     2  components/pages/DeliveryInfoPage.tsx:291
     2  components/pages/PrivacyPolicyPage.tsx:294
     2  components/pages/TermsConditionsPage.tsx:348
     3  components/SectionRenderer.tsx:409
     1  contexts/AuthContext.tsx:315
     1  contexts/CartContext.tsx:8
     1  lib/productUtils.ts:5
     1  lib/shipping-service.ts:102
     4  pages/admin/Analytics.tsx:214
     2  pages/admin/Categories.tsx:151
     1  pages/admin/Coupons.tsx:73
     4  pages/admin/HomepageBuilder.tsx:151
     5  pages/Index.tsx:22
     2  pages/Page.tsx:237
     1  pages/ProductDetail.tsx:335
     2  pages/Products.tsx:65
     1  pages/Signup.tsx:447
     5  pages/TrackOrder.tsx:198
     1  ../server/routes/admin-updates.ts:2
     1  ../server/routes/ai-data.ts:2
     1  ../server/routes/sitemap.ts:2
     1  ../server/routes/upload.ts:107
npm error Lifecycle script `build` failed with error:
npm error code 2
npm error path /Users/naman/Downloads/floristinindia-main/client
npm error workspace florist-frontend@1.0.0
npm error location /Users/naman/Downloads/floristinindia-main/client
npm error command failed
npm error command sh -c tsc && vite build


