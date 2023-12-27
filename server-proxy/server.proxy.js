const proxy = require("express-http-proxy");
const app = require("express")();
const https = require("https");

const env = require("dotenv").config();

const soundEnglishEnv = require("dotenv").config({
  path: "../deploy/environment/sound-english-client.env",
});

const authEnv = require("dotenv").config({
  path: "../deploy/environment/authorization-client.env",
});

const httpsOptions = {
  cert: fs.readFileSync(env.SOUND_ENGLISH_CERT_PATH),
  key: fs.readFileSync(env.SOUND_ENGLISH_CERT_KEY_PATH),
};

app.use(
  proxy((req) => {
    const withPath = (host) => `${host}/${req.path}`;

    if (req.hostname === env.SOUND_ENGLISH_DOMAIN)
      return withPath(`${env.SERVER_LOCAL_STATIC_IP}:${soundEnglishEnv.PORT}`);

    if (req.hostname === env.SOUND_ENGLISH_AUTH_DOMAIN)
      return withPath(`${env.SERVER_LOCAL_STATIC_IP}:${authEnv.PORT}`);

    return "/";
  })
);

https.createServer(options, app).listen(443);
