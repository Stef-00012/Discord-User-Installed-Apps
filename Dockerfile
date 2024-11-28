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


# COPY package.json package-lock.json /bot/
COPY . .

RUN rm -rf /bot/node_modules
RUN npm i

ENTRYPOINT ["npm", "run", "build"]