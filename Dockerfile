FROM node:18-alpine

WORKDIR /bot

RUN apk add --no-cache \
    build-base \
    python3 \
    sqlite-dev \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    bash \
    imagemagick \
    pixman-dev \
    pkgconfig \
    bind-tools \
    fastfetch \
    curl

COPY package.json package-lock.json /bot/
RUN npm i

COPY . .

ENTRYPOINT ["npm", "run", "build"]