export type AuthProvider =
  | 'local'
  | 'github'
  | 'google'
  | 'facebook'
  | 'twitter'
  | 'apple';

// https://en.wikipedia.org/wiki/JSON_Web_Token#Standard_fields
export type JwtPayload = {
  sub: string;
  iat?: number;
  exp?: number;

  username: string;
  photo?: string;
};
