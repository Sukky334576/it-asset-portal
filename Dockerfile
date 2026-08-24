# Multi-stage Dockerfile for IT Asset Management Hub
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Final lightweight runner image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy installed dependencies and source code
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY server.js ./
COPY services/ ./services/
COPY routes/ ./routes/
COPY middleware/ ./middleware/
COPY data/ ./data/
COPY public/ ./public/

# Expose port
EXPOSE 3000

# Non-root user for enterprise security
USER node

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/assets || exit 1

CMD ["node", "server.js"]
