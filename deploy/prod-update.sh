git pull
docker stop $(docker ps -a --filter network="kaluger-projects-prod_kaluger-projects-prod" -q)
docker rm $(docker ps -a --filter network="kaluger-projects-prod_kaluger-projects-prod" -q)
docker system prune -a -f --filter label=AUTO_UPDATE=true
docker compose -f ./docker-compose.prod.yml up -d --build