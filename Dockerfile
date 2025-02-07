FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

FROM node:18-alpine AS production

WORKDIR /app

COPY --from=build /app /app
COPY .env .env

EXPOSE 5656

CMD ["npm", "run", "dev"]
