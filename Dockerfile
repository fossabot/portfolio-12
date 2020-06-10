FROM node:10-alpine

# Install prerequisites for node-gyp
RUN apk add --no-cache \
  g++ \
  make \
  python

# Install prerequisites for gulp-imagemin
RUN apk add --no-cache \
  autoconf \
  automake \
  libtool \
  nasm

# Install Chomium for puppeteer
RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont

# Configure Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
  PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
  PUPPETEER_NO_SANDBOX=true \
  PUPPETEER_HEADLESS=true

# Install portfolio dependencies
WORKDIR /usr/src/portfolio
COPY package*.json ./
RUN npm install
RUN npm install -g gulp

# Copy the portfolio
COPY . .

# Expose port and run server
EXPOSE 4000
ENTRYPOINT ["gulp", "serve"]
