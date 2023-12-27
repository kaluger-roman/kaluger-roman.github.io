rm -rf ./certificates
cp -arfL /etc/letsencrypt/live/. ./certificates
docker compose up --build
