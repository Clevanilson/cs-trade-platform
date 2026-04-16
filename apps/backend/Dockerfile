FROM oven/bun:1.3.12 

WORKDIR /app

COPY package.json ./

COPY packages ./packages

COPY apps/backend/package.json ./apps/backend/

RUN bun install

COPY apps/backend ./apps/backend

CMD ["bun", "run", "--cwd", "apps/backend", "start"]
