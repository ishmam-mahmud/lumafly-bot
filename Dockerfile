FROM node:16-alpine

WORKDIR /lumafly

COPY . .

RUN yarn install

ENTRYPOINT [ "yarn", "deploy" ]
