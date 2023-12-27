rm -rf ./certificates
cp -arf /etc/letsencrypt/live/. ./certificates
docker compose up --build
