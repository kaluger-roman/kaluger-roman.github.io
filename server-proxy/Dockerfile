FROM node:18.16.0-alpine
WORKDIR /app
COPY . /app
RUN npm ci

CMD node /app/server.proxy.js

EXPOSE 80
EXPOSE 443