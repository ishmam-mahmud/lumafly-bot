FROM node:lts-alpine

WORKDIR /lumafly

COPY . .

RUN yarn install

RUN yarn deploy:commands

ENTRYPOINT [ "yarn", "core:start" ]