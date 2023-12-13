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

  'cookie.expires'?: string;
  'cookie.domain'?: string;
  'cookie.httpOnly'?: string;
  'cookie.secure'?: string;
  'cookie.sameSite'?: string;

  'cors.origin'?: string;
  'cors.methods'?: string;
}
