# 🚀 Deployment Guide - Florist in India

This guide covers multiple deployment options for your full-stack flower delivery application.

## 📋 Prerequisites

Before deployment, ensure you have:

- ✅ **Supabase Account** with database setup
- ✅ **Domain name** (optional but recommended)
- ✅ **Environment variables** configured
- ✅ **Database migrations** completed

## 🔧 Pre-Deployment Setup

### 1. **Environment Variables**

Create production environment variables based on `.env.example`:

```bash
# Copy the example file
cp .env.example .env.production

# Edit with your production values
nano .env.production
```

**Required Variables:**

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_API_URL=https://your-domain.com/api
NODE_ENV=production
```

### 2. **Database Setup**

Run your database migrations in Supabase:

```sql
-- Run the main setup script
-- Copy contents from database-setup.sql to Supabase SQL Editor
```

### 3. **Build Test**

Test local build before deployment:

```bash
# Install dependencies
npm install
cd client && npm install
cd ../server && npm install

# Build both client and server
cd ../client && npm run build
cd ../server && npm run build
```

## 🌐 Option 1: Vercel Deployment (Recommended)

### **Step 1: Install Vercel CLI**

```bash
npm install -g vercel
```

### **Step 2: Login to Vercel**

```bash
vercel login
```

### **Step 3: Configure Environment Variables**

Create environment variables in Vercel dashboard or via CLI:

```bash
# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NODE_ENV production
```

### **Step 4: Deploy**

```bash
# Deploy to Vercel
vercel

# For production deployment
vercel --prod
```

### **Step 5: Configure Domain (Optional)**

```bash
# Add custom domain
vercel domains add your-domain.com
```

### **Vercel-Specific Notes:**

- ✅ **Automatic HTTPS** enabled
- ✅ **Global CDN** for fast loading
- ✅ **Serverless functions** for API routes
- ✅ **Automatic deployments** on Git push

## 🐳 Option 2: Docker Deployment

### **Step 1: Build Docker Image**

```bash
# Build the Docker image
docker build -t florist-in-india .

# Or build with tag
docker build -t florist-in-india:latest .
```

### **Step 2: Run Container Locally (Test)**

```bash
# Run with environment variables
docker run -d \
  --name florist-app \
  -p 3000:3000 \
  -e VITE_SUPABASE_URL=your_supabase_url \
  -e VITE_SUPABASE_ANON_KEY=your_anon_key \
  -e NODE_ENV=production \
  florist-in-india:latest

# Check logs
docker logs florist-app
```

### **Step 3: Deploy to Cloud**

#### **Docker Hub + Cloud Provider:**

```bash
# Tag and push to Docker Hub
docker tag florist-in-india your-username/florist-in-india
docker push your-username/florist-in-india

# Deploy on DigitalOcean/AWS/GCP
# Use your cloud provider's container service
```

#### **Docker Compose (for VPS):**

Create `docker-compose.yml`:

```yaml
version: "3.8"
services:
  app:
    image: florist-in-india:latest
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    volumes:
      - ./uploads:/app/public/uploads
    restart: unless-stopped
```

Deploy:

```bash
docker-compose up -d
```

## ☁️ Option 3: Cloud Platform Deployment

### **Railway**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### **Render**

1. Connect GitHub repository
2. Set build command: `cd client && npm run build && cd ../server && npm run build`
3. Set start command: `cd server && npm start`
4. Add environment variables in dashboard

### **Heroku**

```bash
# Install Heroku CLI and login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set VITE_SUPABASE_URL=your_url
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

## 🔧 Post-Deployment Configuration

### **1. DNS Configuration**

Point your domain to deployment:

```
# For Vercel
CNAME: your-domain.com -> cname.vercel-dns.com

# For Docker/VPS
A Record: your-domain.com -> your_server_ip
```

### **2. SSL Certificate**

- **Vercel**: Automatic HTTPS
- **Docker/VPS**: Use Let's Encrypt + Nginx
- **Cloud Providers**: Usually included

### **3. Admin Account Setup**

After deployment, create admin account in Supabase:

```sql
-- In Supabase SQL Editor
INSERT INTO admins (email, password_hash, role, is_active)
VALUES ('admin@yourdomain.com', crypt('your_password', gen_salt('bf')), 'super_admin', true);
```

### **4. File Upload Configuration**

Ensure upload directory is writable:

```bash
# For Docker
docker exec -it container_name chmod 755 /app/public/uploads

# For VPS
chmod 755 ./public/uploads
```

## 📊 Monitoring & Maintenance

### **Health Checks**

Your app includes these health endpoints:

- **`GET /api/health`** - Application health
- **`GET /api/ai/data-freshness`** - Data freshness status
- **`GET /sitemap.xml`** - SEO sitemap

### **Monitoring Setup**

```bash
# Check application status
curl https://your-domain.com/api/health

# Monitor logs
# Vercel: Check dashboard
# Docker: docker logs container_name
```

### **Backup Strategy**

- **Database**: Supabase automatic backups
- **Files**: Regular backup of `/uploads` directory
- **Code**: Git repository backups

## 🚨 Troubleshooting

### **Common Issues:**

**1. Build Failures:**

```bash
# Clear cache and rebuild
rm -rf node_modules client/node_modules server/node_modules
npm install && cd client && npm install && cd ../server && npm install
```

**2. Environment Variables Not Loading:**

```bash
# Check environment variables are set
echo $VITE_SUPABASE_URL
# Restart application after setting
```

**3. Database Connection Issues:**

- Verify Supabase URL and keys
- Check database RLS policies
- Ensure database migrations are complete

**4. File Upload Issues:**

```bash
# Check permissions
ls -la public/uploads
# Fix permissions
chmod 755 public/uploads
```

### **Performance Optimization:**

1. **Enable Gzip** (usually automatic on platforms)
2. **Configure CDN** for static assets
3. **Database indexing** for better query performance
4. **Image optimization** for uploads

## 🎯 Success Checklist

After deployment, verify:

- ✅ **Homepage loads** correctly
- ✅ **Admin panel accessible** at `/admin`
- ✅ **Database connections** working
- ✅ **File uploads** functioning
- ✅ **API endpoints** responding
- ✅ **AI-readable data** available at `/api/ai/*`
- ✅ **Analytics tracking** enabled
- ✅ **SEO meta tags** present
- ✅ **Mobile responsiveness** working

## 📞 Support

For deployment issues:

1. Check application logs
2. Verify environment variables
3. Test database connections
4. Review build output

Your florist application is now ready for production with AI-readable features, comprehensive analytics, and optimal performance! 🌸
