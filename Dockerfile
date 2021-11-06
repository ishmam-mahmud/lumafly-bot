FROM node:lts-alpine

WORKDIR /lumafly

COPY ../../ .
COPY ../../**/* .

RUN yarn install

ENTRYPOINT [ "npx", "start", "-w", "@lumafly/core" ]