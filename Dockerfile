FROM node:14 AS build

WORKDIR /app

LABEL org.opencontainers.image.title="culinary-user-service"
LABEL org.opencontainers.image.authors="wiktor czetyrbok"
LABEL org.opencontainers.image.version="0.0.1-SNAPSHOT"
LABEL org.opencontainers.image.description="Culinary application backend service"
LABEL org.opencontainers.image.licenses="MIT"

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM node:14

RUN npm install -g serve

WORKDIR /app

COPY --from=build /app/dist/culinary-frontend-service .

EXPOSE 3000

CMD ["serve", "-s", ".", "-l", "3000"]

