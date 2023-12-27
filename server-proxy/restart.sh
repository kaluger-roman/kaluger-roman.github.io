rm -rf ./certificates
cp -r /etc/letsencrypt/live ./certificates
docker compose up --build
