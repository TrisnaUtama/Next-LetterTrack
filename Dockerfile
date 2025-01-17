FROM node:18-alpine

RUN apk add --no-cache python3 make g++ openssl3

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g prisma

COPY . .

RUN npm run build
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && npm run start"]
