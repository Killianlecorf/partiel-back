FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

FROM node:18-alpine AS production

RUN apk add --no-cache netcat-openbsd

WORKDIR /app

COPY --from=build /app /app

COPY start.sh .
RUN chmod +x start.sh

EXPOSE 5656

CMD ["/bin/sh", "-c", "./start.sh"]
