FROM node:16-alpine AS deps
WORKDIR /lumafly
COPY package.json yarn.lock prisma ./
RUN yarn install --frozen-lockfile && yarn db:orm:gen

FROM node:16-alpine AS builder
WORKDIR /lumafly
COPY . .
COPY --from=deps /lumafly/node_modules ./node_modules
RUN yarn build:minify

FROM node:16-alpine AS runtime
WORKDIR /lumafly
COPY --from=builder /lumafly/dist/main.js ./main.js
COPY --from=builder /lumafly/package.json ./package.json
COPY --from=builder /lumafly/yarn.lock ./yarn.lock
RUN yarn install --prod --frozen-lockfile

ENTRYPOINT [ "yarn", "prod:run" ]
