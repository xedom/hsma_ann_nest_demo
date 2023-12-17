export interface AppConfig {
  host: string;
  port: number;

  mongodb: {
    uri: string;
  };

  auth: {
    jwt: {
      secret: string;
      expiresInSeconds: number;
    };
    github: {
      clientId: string;
      clientSecret: string;
      callbackURL: string;
    };
    auth0: {
      clientId: string;
      clientSecret: string;
      callbackURL: string;
      domain: string;
    };
  };

  cookie: {
    expires: string;
    domain: string;
    httpOnly: string;
    secure: string;
    sameSite: string;
  };

  cors: {
    origin: string;
    methods: string;
  };

  'mongodb.uri'?: string;

  'auth.jwt.secret'?: string;
  'auth.jwt.expiresInSeconds'?: number;

  'auth.github.clientId'?: string;
  'auth.github.clientSecret'?: string;
  'auth.github.callbackURL'?: string;

  'auth.auth0.clientId'?: string;
  'auth.auth0.clientSecret'?: string;
  'auth.auth0.callbackURL'?: string;
  'auth.auth0.domain'?: string;

  'cookie.expires'?: string;
  'cookie.domain'?: string;
  'cookie.httpOnly'?: string;
  'cookie.secure'?: string;
  'cookie.sameSite'?: string;

  'cors.origin'?: string;
  'cors.methods'?: string;
}
