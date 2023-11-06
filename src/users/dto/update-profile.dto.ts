export class UpdateProfileDto {
  profilePic: string;
  password: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}
