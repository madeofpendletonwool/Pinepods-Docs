# ---- Build stage: compile the Docusaurus static site ----
FROM node:20-alpine AS build
WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Build the site
COPY . .
RUN npm run build

# ---- Serve stage: nginx serving the static build ----
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
