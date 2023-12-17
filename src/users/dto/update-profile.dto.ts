export class UpdateProfileDto {
  username?: string;
  email?: string;
  password?: string;
  newpassword?: string;
  picture?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}
