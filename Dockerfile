# Development Stage
FROM node:18-alpine AS development

RUN mkdir -p /app/node_modules && chown -R node:node /app
RUN chown -R node:node /usr/local

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

USER node

# Install dependencies for development
RUN npm install -g pnpm
RUN pnpm install

COPY --chown=node:node . .

EXPOSE 8000

CMD ["pnpm", "run", "dev"]



# Production Stage
FROM node:18-alpine AS production

RUN mkdir -p /app/node_modules && chown -R node:node /app
RUN chown -R node:node /usr/local

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

USER node

# Install dependencies for production
RUN npm install -g pnpm
RUN pnpm install --only=production

COPY --chown=node:node . .

RUN pnpm run build

# Remove development dependencies
RUN pnpm prune --prod

EXPOSE 8000

CMD ["pnpm", "start"]
