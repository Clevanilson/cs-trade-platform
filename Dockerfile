FROM oven/bun:1.3.12 

WORKDIR /app

COPY package.json ./

COPY packages/di/package.json ./packages/di/

COPY packages/infra/package.json ./packages/infra/

COPY apps/backend/package.json ./apps/backend/

COPY packages ./packages

RUN bun install

COPY apps/backend ./apps/backend

CMD ["bun", "run", "--cwd", "apps/backend", "start"]