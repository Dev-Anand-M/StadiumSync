# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage — lightweight nginx to serve static files
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add security headers and compression
RUN apk add --no-cache gzip

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
