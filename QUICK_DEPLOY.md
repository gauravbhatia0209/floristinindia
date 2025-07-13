# 🚀 Quick Deploy Guide - Florist in India

## 5-Minute Vercel Deployment

### **Step 1: Prepare Environment**

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your Supabase credentials
nano .env.local
```

Required variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **Step 2: Test Build Locally**

```bash
# Install dependencies
npm install
cd client && npm install
cd ../server && npm install
cd ..

# Test build
npm run build

# Verify build files exist
ls client/dist/
ls server/dist/
```

### **Step 3: Deploy to Vercel**

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Use simple config for easier deployment
mv vercel.simple.json vercel.json

# Deploy
vercel --prod
```

### **Step 4: Configure Environment in Vercel**

After deployment, add environment variables in Vercel dashboard:

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add these variables:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
NODE_ENV = production
```

### **Step 5: Redeploy with Environment Variables**

```bash
# Redeploy to apply environment variables
vercel --prod
```

## ✅ Verification Checklist

After deployment, test these URLs:

- [ ] **Homepage**: `https://your-app.vercel.app`
- [ ] **Admin Panel**: `https://your-app.vercel.app/admin`
- [ ] **API Health**: `https://your-app.vercel.app/api/health`
- [ ] **Products API**: `https://your-app.vercel.app/api/ai/products`
- [ ] **Sitemap**: `https://your-app.vercel.app/sitemap.xml`

## 🔧 Common Issues & Fixes

### **Issue: Build Fails**

```bash
# Clear all node_modules and rebuild
rm -rf node_modules client/node_modules server/node_modules
npm install && cd client && npm install && cd ../server && npm install
npm run build
```

### **Issue: API Routes Not Working**

- Ensure you're using `vercel.simple.json` (renamed to `vercel.json`)
- Check environment variables are set in Vercel dashboard
- Verify build completed successfully

### **Issue: Database Connection Fails**

- Verify Supabase URL and keys in environment variables
- Check database RLS policies are configured
- Ensure database migrations have been run

### **Issue: File Uploads Not Working**

- File uploads use `/api/upload` endpoint
- Check server logs in Vercel dashboard
- Verify upload permissions in code

## 🌐 Custom Domain Setup

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed by Vercel

## 📊 Monitoring

Check these after deployment:

- **Performance**: Vercel Analytics dashboard
- **Logs**: Vercel Functions logs
- **Errors**: Check Function error logs
- **Database**: Supabase dashboard for query performance

## 🆘 Need Help?

If deployment fails:

1. Check the build logs in Vercel dashboard
2. Verify all environment variables are set
3. Test the build locally first
4. Use the simple Vercel config (`vercel.simple.json`)

Your florist application should now be live! 🌸
