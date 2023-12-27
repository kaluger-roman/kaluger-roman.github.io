FROM node:18.16.0-alpine
WORKDIR /app
COPY . /app
COPY /etc/letsencrypt/live /app/certificates
RUN npm ci

CMD node /app/server.proxy.js

EXPOSE 80