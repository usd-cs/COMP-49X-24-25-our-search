# === Build Stage ===
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN ls -lah /app && find /app
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# === Runtime Stage ===
# Serve with Nginx
# Why? It is designed for serving static content like HTML, CSS, and JavaScript files, 
# which is exactly what a built React application consists of. 
# This can lead to faster load times and better performance under load.
# Port 80 is the default port for HTTP traffic needed for nginx.
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# Nginx configuration to handle client-side routing
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]