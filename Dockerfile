# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json ./
COPY yarn.lock* ./

# Install dependencies (will use yarn.lock if exists)
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else yarn install; fi

COPY . .
RUN yarn build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app

# Copy package files and build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock* ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile --production; \
    else yarn install --production; fi

EXPOSE 3000
CMD ["node", "dist/main"]