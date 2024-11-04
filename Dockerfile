FROM node:14 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist/culinary-frontend-service /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
