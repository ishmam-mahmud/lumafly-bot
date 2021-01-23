FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN apk add python3 make gcc musl-dev g++

RUN npm install && npm install better-sqlite3

EXPOSE 4000

CMD ["npm", "start"]