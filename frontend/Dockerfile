# === Build Stage ===
FROM node:22-sim AS build
WORKDIR /app

ARG REACT_APP_DOMAIN
ENV REACT_APP_DOMAIN=$REACT_APP_DOMAIN

COPY package*.json ./
RUN npm install
COPY . .
RUN ls -lah /app && find /app
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# === Runtime Stage ===
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]