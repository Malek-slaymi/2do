# Stage 1 : build (Node 20)
FROM node:20-alpine AS build
WORKDIR /app
# copy only package files first for better caching
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Stage 2 : production image (nginx)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

