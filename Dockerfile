# Development Stage
FROM node:18 AS development

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

# Install dependencies for development
RUN npm install -g pnpm
RUN pnpm install --only=development
RUN pnpm run migration:up


COPY . .

CMD ["pnpm", "run", "dev"]

# Production Stage
FROM node:18 AS production

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .

# Install dependencies for production
RUN npm install -g pnpm
RUN pnpm install --only=production
RUN pnpm run migration:up

COPY . .

RUN pnpm run build

# Remove development dependencies
RUN pnpm prune --prod

CMD ["pnpm", "start"]
