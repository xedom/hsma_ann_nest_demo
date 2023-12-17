import { AppConfig } from './interfaces';

export default (): AppConfig => ({
  host: process.env.HOST || '0.0.0.0',
  port: parseInt(process.env.PORT) || 3000,

  mongodb: {
    uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shop',
  },

  auth: {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresInSeconds:
        parseInt(process.env.JWT_EXPIRATION_TIME_SECONDS) || 900,
    },
    github: {
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_OAUTH_CALLBACK_URL,
    },
    auth0: {
      clientId: process.env.AUTH0_OAUTH_CLIENT_ID,
      clientSecret: process.env.AUTH0_OAUTH_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_OAUTH_CALLBACK_URL,
      domain: process.env.AUTH0_OAUTH_DOMAIN,
    },
  },

  cookie: {
    expires: process.env.COOKIE_EXPIRES || '7200000',
    domain: process.env.COOKIE_DOMAIN || '127.0.0.1',
    httpOnly: process.env.COOKIE_HTTP_ONLY || 'true',
    secure: process.env.COOKIE_SECURE || 'false',
    sameSite: process.env.COOKIE_SAME_SITE || 'none',
  },

  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE',
  },
});
