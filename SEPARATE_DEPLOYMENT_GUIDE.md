# 🚀 Separate Deployment Guide - Frontend & Backend

Your project is now restructured for separate deployments! This allows you to:

- ✅ **Deploy frontend and backend independently**
- ✅ **Scale each service separately**
- ✅ **Use different hosting platforms**
- ✅ **Better CI/CD and development workflows**

## 📁 New Project Structure

```
├── client/                 # Frontend (React + Vite)
│   ├── package.json       # Frontend dependencies
│   ├── vercel.json        # Frontend Vercel config
│   ├── types/             # Frontend types
│   └── ...                # React components, pages, etc.
├── server/                 # Backend (Node.js + Express)
│   ├── package.json       # Backend dependencies
│   ├── vercel.json        # Backend Vercel config
│   ├── tsconfig.json      # Backend TypeScript config
│   ├── types/             # Backend types
│   └── ...                # API routes, logic, etc.
└── database-setup.sql     # Database schema
```

## 🎯 Deployment Options

### **Option 1: Both on Vercel (Recommended)**

Deploy frontend and backend as separate Vercel projects.

### **Option 2: Frontend on Vercel + Backend on Railway/Heroku**

Deploy frontend on Vercel, backend on a different platform.

### **Option 3: Both on Same Platform**

Deploy both on Railway, Render, or other platforms.

## 🌐 Option 1: Both on Vercel

### **Step 1: Deploy Backend First**

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Test build
npm run build

# Login to Vercel (if not already)
vercel login

# Deploy backend
vercel --prod

# Note the backend URL (e.g., https://florist-backend.vercel.app)
```

### **Step 2: Deploy Frontend**

```bash
# Navigate to client folder
cd ../client

# Install dependencies
npm install

# Update the API URL in client/vercel.json
# Replace "https://your-backend-url.com" with your actual backend URL

# Test build
npm run build

# Deploy frontend
vercel --prod
```

### **Step 3: Configure Environment Variables**

**Backend Environment Variables** (in Vercel dashboard):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NODE_ENV=production
```

**Frontend Environment Variables** (in Vercel dashboard):

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=https://your-backend.vercel.app
NODE_ENV=production
```

## 🚀 Option 2: Frontend (Vercel) + Backend (Railway)

### **Step 1: Deploy Backend to Railway**

```bash
cd server

# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

### **Step 2: Deploy Frontend to Vercel**

```bash
cd ../client

# Update client/vercel.json with Railway backend URL
# Replace "https://your-backend-url.com" with Railway URL

# Deploy to Vercel
vercel --prod
```

## 🔧 Configuration Updates Needed

### **1. Update API Base URL in Frontend**

Edit `client/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-actual-backend-url.com/api/$1"
    }
  ]
}
```

### **2. Update CORS in Backend**

Update `server/index.ts` to allow your frontend domain:

```typescript
app.use(
  cors({
    origin: [
      "https://your-frontend.vercel.app",
      "http://localhost:5173", // For development
    ],
  }),
);
```

### **3. Update Environment Variables**

**Frontend** needs:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL` (your backend URL)

**Backend** needs:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## ✅ Verification Steps

After deployment:

### **Test Backend**

- `https://your-backend-url.com/api/health` - Health check
- `https://your-backend-url.com/api/ai/business` - Business API
- `https://your-backend-url.com/sitemap.xml` - Dynamic sitemap

### **Test Frontend**

- `https://your-frontend-url.com` - Homepage
- `https://your-frontend-url.com/admin` - Admin panel
- `https://your-frontend-url.com/products` - Products page

### **Test Integration**

- Admin panel can fetch data from backend
- Product pages load from API
- Cart and checkout functionality works

## 🛠️ Development Workflow

### **Local Development**

**Terminal 1 (Backend):**

```bash
cd server
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2 (Frontend):**

```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

### **Environment Files**

**`server/.env.local`:**

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**`client/.env.local`:**

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:3000
```

## 📊 Benefits of Separate Deployment

### **Scalability**

- Scale frontend and backend independently
- CDN optimization for frontend
- Server optimization for backend

### **Platform Flexibility**

- Use best platform for each service
- Different pricing models
- Specialized features (e.g., Vercel for frontend, Railway for backend)

### **Development**

- Independent deployments
- Faster CI/CD pipelines
- Better error isolation

### **Maintenance**

- Easier updates and rollbacks
- Service-specific monitoring
- Clear separation of concerns

## 🆘 Troubleshooting

### **CORS Errors**

Update backend CORS configuration with frontend URL.

### **API Not Found**

Check frontend `vercel.json` rewrites point to correct backend URL.

### **Environment Variables**

Ensure all environment variables are set in both frontend and backend platforms.

### **Build Failures**

Test builds locally first:

```bash
# Backend
cd server && npm run build

# Frontend
cd client && npm run build
```

## 🎯 Recommended Setup

**For Production:**

- **Frontend**: Vercel (optimal for React + CDN)
- **Backend**: Railway or Vercel (both work well for Node.js)
- **Database**: Supabase (already configured)

This setup gives you maximum flexibility, performance, and scalability! 🌸
