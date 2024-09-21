const { createProxyMiddleware } = require("http-proxy-middleware");
const app = require("express")();
const https = require("https");
const fs = require("fs");
const tls = require("tls");
const env = require("dotenv").config().parsed;

const soundEnglishEnv = require("dotenv").config({
  path: "./environment/sound-english-client.env",
}).parsed;

const soundEnglishServerEnv = require("dotenv").config({
  path: "./environment/sound-english-server.env",
}).parsed;

const authEnv = require("dotenv").config({
  path: "./environment/authorization-client.env",
}).parsed;

const authServerEnv = require("dotenv").config({
  path: "./environment/authorization-server.env",
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
    if (
      fs.existsSync(certs[serverName].key) &&
      fs.existsSync(certs[serverName].cert)
    ) {
      certsToReturn[serverName] = tls.createSecureContext({
        key: fs.readFileSync(certs[serverName].key),
        cert: fs.readFileSync(certs[serverName].cert),
      });
    }
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
  if (req.secure || req.path.includes("/.well-known/acme-challenge")) {
    next();
  } else {
    // res.redirect("https://" + req.hostname + req.url);
    // commented untill ssl for domain

    next(); // mock
  }
});

const wsProxy = createProxyMiddleware(
  (pathname) => !pathname.match("/.well-known/acme-challenge"),
  {
    target: `http://${env.SERVER_LOCAL_STATIC_IP}:${soundEnglishEnv.PORT}`,
    router: {
      [`${env.SOUND_ENGLISH_AUTH_DOMAIN}/api`]: `http://${env.SERVER_LOCAL_STATIC_IP}:${authServerEnv.SERVER_PORT}`,
      [`${env.SOUND_ENGLISH_DOMAIN}/api`]: `http://${env.SERVER_LOCAL_STATIC_IP}:${soundEnglishServerEnv.SERVER_PORT}`,
      [env.SOUND_ENGLISH_AUTH_DOMAIN]: `http://${env.SERVER_LOCAL_STATIC_IP}:${authEnv.PORT}`,
      [env.SOUND_ENGLISH_DOMAIN]: `http://${env.SERVER_LOCAL_STATIC_IP}:${soundEnglishEnv.PORT}`,
    },
    pathRewrite: (path) => path.replace("/domain-auth", ""),
    ws: true,
    logLevel: "debug",
  }
);

app.use(wsProxy);

const httpsServer = https.createServer(options, app);

httpsServer.listen(443);

app.listen(80);
