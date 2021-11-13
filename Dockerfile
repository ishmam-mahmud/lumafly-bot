FROM node:16-alpine AS builder
WORKDIR /lumafly
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build:minify
RUN yarn build:deploy:commands

FROM node:16-alpine AS runtime
WORKDIR /lumafly
COPY --from=builder /lumafly/dist/main.js ./main.js
COPY --from=builder /lumafly/dist/deploy.js ./deploy.js
COPY --from=builder /lumafly/prisma ./prisma
COPY ./package.json ./package.json
COPY ./yarn.lock ./yarn.lock
RUN yarn install --prod --frozen-lockfile

ENTRYPOINT [ "yarn", "prod:run" ]
