# Multi-stage build for Florist in India application

# Stage 1: Build the client application
FROM node:18-alpine AS client-builder

WORKDIR /app

# Copy package files
COPY client/package*.json ./client/
COPY package*.json ./

# Install dependencies
RUN cd client && npm ci --only=production

# Copy client source code
COPY client/ ./client/
COPY shared/ ./shared/

# Build the client application
WORKDIR /app/client
RUN npm run build

# Stage 2: Build the server application  
FROM node:18-alpine AS server-builder

WORKDIR /app

# Copy package files
COPY server/package*.json ./server/
COPY package*.json ./

# Install dependencies
RUN cd server && npm ci --only=production

# Copy server source code
COPY server/ ./server/
COPY shared/ ./shared/

# Build the server application
WORKDIR /app/server
RUN npm run build

# Stage 3: Production image
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy built applications
COPY --from=client-builder --chown=nextjs:nodejs /app/client/dist ./client/dist
COPY --from=server-builder --chown=nextjs:nodejs /app/server/dist ./server/dist
COPY --from=server-builder --chown=nextjs:nodejs /app/server/node_modules ./server/node_modules

# Copy shared files
COPY --chown=nextjs:nodejs shared/ ./shared/

# Copy public files and other necessary files
COPY --chown=nextjs:nodejs public/ ./public/
COPY --chown=nextjs:nodejs robots.txt ./public/robots.txt

# Copy server package.json for production dependencies
COPY --from=server-builder --chown=nextjs:nodejs /app/server/package*.json ./server/

# Create uploads directory
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

# Start the application
CMD ["dumb-init", "node", "server/dist/index.js"]
