FROM oven/bun:debian

WORKDIR /bot

RUN apt update && apt install -y \
    build-essential \
    python3 \
    libsqlite3-dev \
    g++ \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    bash \
    imagemagick \
    libpixman-1-dev \
    pkg-config \
    dnsutils \
    curl \
    wget

RUN wget https://github.com/fastfetch-cli/fastfetch/releases/latest/download/fastfetch-linux-amd64.deb -O /tmp/fastfetch.deb && \
    apt -y install -f /tmp/fastfetch.deb && \
    rm -f /tmp/fastfetch.deb

COPY . .

RUN bun i

ENTRYPOINT ["bun", "run", "build"]