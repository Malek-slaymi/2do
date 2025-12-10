# Stage 1 : build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Stage 2 : production image
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# Optional: custom nginx.conf copy
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
