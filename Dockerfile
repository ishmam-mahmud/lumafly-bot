FROM node:lts-alpine

WORKDIR /app

COPY . .

RUN /app/install.sh

EXPOSE 4000

CMD ["npm", "start"]