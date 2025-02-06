# === Build Stage ===
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# === Runtime Stage ===
# Serve with Nginx
# Why? It is designed for serving static content like HTML, CSS, and JavaScript files, 
# which is exactly what a built React application consists of. 
# This can lead to faster load times and better performance under load.
# Port 80 is the default port for HTTP traffic needed for nginx.
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# other option is localhost
# CMD [ "npm", "start" ]
