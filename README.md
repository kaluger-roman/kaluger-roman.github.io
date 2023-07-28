Для деплоя

- Установить docker, ngrok
- ngrok http 3030 --authtoken TOKEN
- токен лежит тут в .env
- Подставить урл в index.html src iframe
- В environment папке

- для authorization-сlient
  REACT_APP_SERVER_HOST=<url>/authorization-server

- для sound-english-client
  REACT_APP_AUTH_HOST=<url>/authorization-server
  REACT_APP_SERVER_HOST=<url>/sound-english-server

- git push
