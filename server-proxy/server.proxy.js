const { createProxyMiddleware } = require("http-proxy-middleware");
const app = require("express")();
const https = require("https");
const fs = require("fs");
const tls = require("tls");
const env = require("dotenv").config().parsed;

const soundEnglishEnv = require("dotenv").config({
  path: "./environment/sound-english-client.env",
}).parsed;

const authEnv = require("dotenv").config({
  path: "./environment/authorization-client.env",
}).parsed;

const certs = {
  [env.SOUND_ENGLISH_DOMAIN]: {
    key: env.SOUND_ENGLISH_CERT_KEY_PATH,
    cert: env.SOUND_ENGLISH_CERT_PATH,
  },
  [env.SOUND_ENGLISH_AUTH_DOMAIN]: {
    key: env.SOUND_ENGLISH_AUTH_CERT_KEY_PATH,
    cert: env.SOUND_ENGLISH_AUTH_CERT_PATH,
  },
};

const getSecureContexts = (certs) => {
  const certsToReturn = {};
  for (const serverName of Object.keys(certs)) {
    certsToReturn[serverName] = tls.createSecureContext({
      key: fs.readFileSync(certs[serverName].key),
      cert: fs.readFileSync(certs[serverName].cert),
    });
  }
  return certsToReturn;
};

const secureContexts = getSecureContexts(certs);

const options = {
  SNICallback: (servername, cb) => {
    const ctx = secureContexts[servername];

    if (cb) {
      cb(null, ctx);
    } else {
      return ctx;
    }
  },
};

app.enable("trust proxy");

app.use(require("express").static("public"));

app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect("https://" + req.hostname + req.url);
  }
});

app.use(
  createProxyMiddleware({
    target: `${env.SERVER_LOCAL_STATIC_IP}:${soundEnglishEnv.PORT}`,
    router: {
      [env.SOUND_ENGLISH_DOMAIN]: `${env.SERVER_LOCAL_STATIC_IP}:${soundEnglishEnv.PORT}`,
      [env.SOUND_ENGLISH_AUTH_DOMAIN]: `${env.SERVER_LOCAL_STATIC_IP}:${authEnv.PORT}`,
    },
    ws: true,
  })
);

https.createServer(options, app).listen(443);

app.listen(80);
