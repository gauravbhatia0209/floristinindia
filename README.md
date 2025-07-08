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
