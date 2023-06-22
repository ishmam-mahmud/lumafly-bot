FROM node:16 AS deps
WORKDIR /lumafly
COPY package.json yarn.lock prisma .yarnrc.yml ./
COPY .yarn ./.yarn/
RUN yarn install --immutable && yarn prisma generate

FROM node:16 AS builder
WORKDIR /lumafly
COPY . .
COPY --from=deps /lumafly/node_modules ./node_modules/
COPY --from=deps /lumafly/.yarn ./.yarn/
RUN yarn build --minify
RUN yarn prisma generate

FROM node:16 AS runner
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
