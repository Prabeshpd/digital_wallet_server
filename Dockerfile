FROM node:16.17-bullseye-slim AS base

FROM base AS builder
WORKDIR /node-express
COPY ["package.json", "yarn.lock",  "tsconfig.json", "./"]
RUN  yarn
COPY ["src", "./src"]
RUN yarn build

FROM builder AS dependencies
WORKDIR /node-express
COPY ["package.json", "yarn.lock", "./"]
RUN yarn --prod

# STAGE: Run migrations
FROM base AS migrate
WORKDIR /node-express
COPY --from=base /node-express /node-express
CMD yarn migrate

# STAGE: Rollback migrations
FROM base AS migrate-rollback
WORKDIR /node-express
COPY --from=base /node-express /node-express
CMD yarn rollback

FROM base AS main
WORKDIR /node-express
EXPOSE ${SERVER_PORT}
COPY --from=builder /node-express/dist /node-express/dist
COPY --from=builder ["node-express/package.json", "node-express/yarn.lock", "node-express/"]
COPY --from=dependencies /node-express/node_modules /node-express/node_modules
ENTRYPOINT [ "node", "dist/server.js" ]
