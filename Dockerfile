FROM node:18.12.1-alpine3.15 AS deps
WORKDIR /lumafly
COPY package.json package-lock.json prisma ./
RUN npm install && npx prisma generate

FROM node:18.12.1-alpine3.15 AS builder
WORKDIR /lumafly
COPY . .
COPY --from=deps /lumafly/node_modules ./node_modules/
RUN npm run build
RUN npx prisma generate

FROM node:18.12.1-alpine3.15 AS runner
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S lumafly -u 1001

WORKDIR /lumafly
COPY --from=builder --chown=lumafly:nodejs /lumafly/package.json ./package.json
COPY --from=builder --chown=lumafly:nodejs /lumafly/package-lock.json ./package-lock.json
COPY --from=builder --chown=lumafly:nodejs /lumafly/node_modules ./node_modules/
COPY --from=builder --chown=lumafly:nodejs /lumafly/dist/main.js ./main.js

USER lumafly

ENTRYPOINT [ "node", "main.js" ]
