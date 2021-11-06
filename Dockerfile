FROM node:lts-alpine

WORKDIR /lumafly

COPY . .

RUN yarn install

ENTRYPOINT [ "yarn", "core:start" ]