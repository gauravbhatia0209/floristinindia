#!/bin/bash

# Florist in India - Setup Script for Separate Deployments
# This script prepares your project for separate frontend/backend deployment

set -e

echo "🌸 Setting up Florist in India for Separate Deployment"
echo "===================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to update import paths in client
update_client_imports() {
    print_status "Updating client import paths..."
    
    # Update all TypeScript and TSX files in client directory
    find client -name "*.ts" -o -name "*.tsx" | while read file; do
        if grep -q "@shared/database.types" "$file"; then
            sed -i.bak 's/@shared\/database\.types/@\/types\/database.types/g' "$file"
            rm "${file}.bak" 2>/dev/null || true
            echo "Updated imports in: $file"
        fi
    done
    
    print_status "✅ Client imports updated"
}

# Function to update import paths in server
update_server_imports() {
    print_status "Updating server import paths..."
    
    # Update all TypeScript files in server directory  
    find server -name "*.ts" | while read file; do
        if grep -q "@shared/database.types" "$file"; then
            sed -i.bak 's/@shared\/database\.types/@\/types\/database.types/g' "$file"
            rm "${file}.bak" 2>/dev/null || true
            echo "Updated imports in: $file"
        fi
    done
    
    print_status "✅ Server imports updated"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install client dependencies
    print_status "Installing client dependencies..."
    cd client && npm install
    cd ..
    
    # Install server dependencies  
    print_status "Installing server dependencies..."
    cd server && npm install
    cd ..
    
    print_status "✅ Dependencies installed"
}

# Function to test builds
test_builds() {
    print_status "Testing builds..."
    
    # Test client build
    print_status "Testing client build..."
    cd client
    npm run build
    if [ ! -d "dist" ]; then
        print_error "Client build failed - no dist directory"
        exit 1
    fi
    cd ..
    
    # Test server build
    print_status "Testing server build..."
    cd server
    npm run build
    if [ ! -d "dist" ]; then
        print_error "Server build failed - no dist directory"
        exit 1
    fi
    cd ..
    
    print_status "✅ Both builds successful"
}

# Function to setup deployment configs
setup_deployment_configs() {
    print_status "Setting up deployment configurations..."
    
    # Check if client/vercel.json exists
    if [ ! -f "client/vercel.json" ]; then
        print_warning "Client vercel.json not found. Please create one manually."
    fi
    
    # Check if server/vercel.json exists
    if [ ! -f "server/vercel.json" ]; then
        print_warning "Server vercel.json not found. Please create one manually."
    fi
    
    print_status "✅ Deployment configs ready"
}

# Function to create environment templates
create_env_templates() {
    print_status "Creating environment templates..."
    
    # Client .env.example
    cat > client/.env.example << EOF
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# API Configuration
VITE_API_URL=https://your-backend-url.com

# Environment
NODE_ENV=development
EOF

    # Server .env.example
    cat > server/.env.example << EOF
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Server Configuration
NODE_ENV=development
PORT=3000
EOF

    print_status "✅ Environment templates created"
}

# Function to show deployment instructions
show_deployment_instructions() {
    echo ""
    echo "🎯 Next Steps for Deployment:"
    echo "=============================="
    echo ""
    echo "1. Deploy Backend First:"
    echo "   cd server"
    echo "   vercel --prod"
    echo "   # Note the backend URL"
    echo ""
    echo "2. Update Frontend Config:"
    echo "   # Edit client/vercel.json"
    echo "   # Replace 'your-backend-url.com' with actual backend URL"
    echo ""
    echo "3. Deploy Frontend:"
    echo "   cd client"
    echo "   vercel --prod"
    echo ""
    echo "4. Configure Environment Variables:"
    echo "   # In Vercel dashboard for both projects"
    echo "   # Add environment variables from .env.example files"
    echo ""
    echo "📚 See SEPARATE_DEPLOYMENT_GUIDE.md for detailed instructions"
}

# Main execution
main() {
    echo ""
    echo "Select setup option:"
    echo "1) Full setup (imports + dependencies + build test)"
    echo "2) Update imports only"
    echo "3) Install dependencies only"
    echo "4) Test builds only"
    echo "5) Create environment templates"
    echo ""
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            update_client_imports
            update_server_imports
            install_dependencies
            test_builds
            setup_deployment_configs
            create_env_templates
            show_deployment_instructions
            ;;
        2)
            update_client_imports
            update_server_imports
            ;;
        3)
            install_dependencies
            ;;
        4)
            test_builds
            ;;
        5)
            create_env_templates
            ;;
        *)
            print_error "Invalid choice. Please select 1-5."
            exit 1
            ;;
    esac
}

# Check if we're in the right directory
if [ ! -d "client" ] || [ ! -d "server" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Run main function
main

echo ""
print_status "🎉 Setup completed successfully!"
echo ""
echo "Your project is now ready for separate deployment!"
echo "Frontend: ./client/"
echo "Backend:  ./server/" 
echo ""
echo "Check SEPARATE_DEPLOYMENT_GUIDE.md for deployment instructions."
