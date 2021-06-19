FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN apk add python3 make gcc musl-dev g++

RUN npm install --production && npm install better-sqlite3

CMD ["npm", "start"]