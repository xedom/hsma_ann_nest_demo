export class CreateCartDto {
  userID: string;
  items: { productID: string; quantity: number }[];
  total: number;
}
