import { AuthProvider } from '..';

export interface User {
  id: string;

  provider: AuthProvider;
  providerId: string;

  username: string;

  photos: string[];
}
