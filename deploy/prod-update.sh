docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
docker system prune -a -f --filter label=AUTO_UPDATE=true
docker compose -f ./docker-compose.prod.yml up -d --build