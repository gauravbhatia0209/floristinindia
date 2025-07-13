#!/bin/bash

# Florist in India - Quick Deployment Script
# This script helps deploy your application to various platforms

set -e

echo "🌸 Florist in India - Deployment Script"
echo "======================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_status "✅ Node.js and npm are installed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm run install:all
    print_status "✅ Dependencies installed"
}

# Build application
build_application() {
    print_status "Building application..."
    npm run build
    print_status "✅ Application built successfully"
}

# Test build locally
test_build() {
    print_status "Testing build locally..."
    
    # Check if build files exist
    if [ ! -d "client/dist" ]; then
        print_error "Client build failed - dist directory not found"
        exit 1
    fi
    
    if [ ! -d "server/dist" ]; then
        print_error "Server build failed - dist directory not found"
        exit 1
    fi
    
    print_status "✅ Build test passed"
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Check if user is logged in
    if ! vercel whoami &> /dev/null; then
        print_warning "Please login to Vercel first:"
        vercel login
    fi
    
    # Deploy
    if [ "$1" = "prod" ]; then
        print_status "Deploying to production..."
        vercel --prod
    else
        print_status "Deploying to preview..."
        vercel
    fi
    
    print_status "✅ Deployed to Vercel successfully"
}

# Build Docker image
build_docker() {
    print_status "Building Docker image..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    docker build -t florist-in-india:latest .
    print_status "✅ Docker image built successfully"
}

# Run Docker container
run_docker() {
    print_status "Running Docker container..."
    
    # Stop existing container if running
    if docker ps -q -f name=florist-app; then
        print_warning "Stopping existing container..."
        docker stop florist-app
        docker rm florist-app
    fi
    
    # Run new container
    docker run -d \
        --name florist-app \
        -p 3000:3000 \
        --env-file .env.production \
        florist-in-india:latest
    
    print_status "✅ Docker container is running on port 3000"
}

# Health check
health_check() {
    print_status "Running health check..."
    
    sleep 5  # Wait for app to start
    
    if curl -f http://localhost:3000/api/health &> /dev/null; then
        print_status "✅ Application is healthy"
    else
        print_error "❌ Health check failed"
        exit 1
    fi
}

# Main deployment function
main() {
    echo ""
    echo "Select deployment option:"
    echo "1) Vercel (Preview)"
    echo "2) Vercel (Production)"  
    echo "3) Docker (Local)"
    echo "4) Build Only"
    echo "5) Full Check (Build + Test)"
    echo ""
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            check_requirements
            install_dependencies
            build_application
            test_build
            deploy_vercel
            ;;
        2)
            check_requirements
            install_dependencies
            build_application
            test_build
            deploy_vercel prod
            ;;
        3)
            check_requirements
            install_dependencies
            build_application
            test_build
            build_docker
            run_docker
            health_check
            ;;
        4)
            check_requirements
            install_dependencies
            build_application
            test_build
            ;;
        5)
            check_requirements
            install_dependencies
            build_application
            test_build
            print_status "✅ All checks passed - ready for deployment!"
            ;;
        *)
            print_error "Invalid choice. Please select 1-5."
            exit 1
            ;;
    esac
}

# Check if environment file exists
if [ ! -f ".env.example" ]; then
    print_error "Environment example file not found. Please create .env.example first."
    exit 1
fi

# Run main function
main

echo ""
print_status "🎉 Deployment completed successfully!"
echo ""
echo "Next steps:"
echo "1. Verify your application is running correctly"
echo "2. Test all functionality including admin panel"
echo "3. Check AI-readable endpoints (/api/ai/*)"
echo "4. Verify analytics tracking is working"
echo ""
echo "Need help? Check DEPLOYMENT_GUIDE.md for detailed instructions."
