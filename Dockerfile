FROM node:16-alpine AS deps
WORKDIR /lumafly
COPY package.json yarn.lock prisma ./
RUN yarn install --frozen-lockfile && yarn prisma generate

FROM node:16-alpine AS builder
WORKDIR /lumafly
COPY . .
COPY --from=deps /lumafly/node_modules ./node_modules/
RUN yarn build --minify
RUN rm -rf node_modules
RUN yarn install --production --frozen-lockfile && yarn prisma generate

FROM node:16-alpine AS runner
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S lumafly -u 1001

WORKDIR /lumafly
COPY --from=builder --chown=lumafly:nodejs /lumafly/package.json ./package.json
COPY --from=builder --chown=lumafly:nodejs /lumafly/yarn.lock ./yarn.lock
COPY --from=builder --chown=lumafly:nodejs /lumafly/node_modules ./node_modules/
COPY --from=builder --chown=lumafly:nodejs /lumafly/dist/main.js ./main.js

USER lumafly

ENTRYPOINT [ "node", "main.js" ]
