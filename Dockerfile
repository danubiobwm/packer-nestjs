# builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# runner
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json yarn.lock ./
COPY --from=builder /app/dist ./dist
RUN yarn install --production --frozen-lockfile
EXPOSE 3000
CMD ["node", "dist/main.js"]
