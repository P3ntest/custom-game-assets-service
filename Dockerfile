FROM oven/bun:1-debian

# install pngquant
RUN apt-get update && apt-get install -y pngquant

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

COPY . .

CMD ["bun", "run", "index.ts"]
