docker stop $(docker ps -a --filter network="kaluger-projects-prod_kaluger-projects-prod" -q)
docker compose -f ./docker-compose.prod.yml up -d