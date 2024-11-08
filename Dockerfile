FROM node:14 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

LABEL org.opencontainers.image.title="culinary-user-service"
LABEL org.opencontainers.image.authors="wiktor czetyrbok"
LABEL org.opencontainers.image.version="0.0.1-SNAPSHOT"
LABEL org.opencontainers.image.description="Culinary application backend service"
LABEL org.opencontainers.image.licenses="MIT"

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist/culinary-frontend-service /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
