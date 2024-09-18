Для деплоя

- Установить docker, ngrok
- ngrok http 3030 --authtoken TOKEN
- токен лежит тут в .env
- Подставить урл в index.html src iframe <url>/sound-english-client
- В environment папке

- для authorization-сlient
  REACT_APP_SERVER_HOST=wss://<url>/authorization-server

- для sound-english-client
  REACT_APP_AUTH_HOST=wss://<url>/authorization-server
  REACT_APP_SERVER_HOST=wss://<url>/sound-english-server

- git push
- docker compose up

ngrok http 80 --authtoken 1uf3T4yQYchPREb0oG99M4JxbO0_6a5ZZZLe66Kjd7uoLBBiL ;
