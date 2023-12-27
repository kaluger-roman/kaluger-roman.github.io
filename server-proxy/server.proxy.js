const proxy = require("express-http-proxy");
const app = require("express")();
const https = require("https");
const tls = require("tls");
const env = require("dotenv").config();

const soundEnglishEnv = require("dotenv").config({
  path: "../deploy/environment/sound-english-client.env",
});

const authEnv = require("dotenv").config({
  path: "../deploy/environment/authorization-client.env",
});

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

app.listen(80);