\*: must be logged in as user\
\*\*: must be logged in as admin

## User Management

- [x] `POST /auth/register` For user registration.
- [x] `POST /auth/login` For user login, returning a token for authenticated sessions.
- [ ] `POST /auth/logout` To log the user out, invalidating the session token.
- [x] \*`GET /users/profile` To fetch the profile details of the logged-in user.
- [x] \*`PUT /users/profile` To update user profile details.

## Product Management

- [x] `GET /products` To fetch a list of products, possibly with filtering, sorting, and pagination.
- [x] `GET /products/search?name={name}` To fetch the details of a specific product.
- [x] `GET /products/{product_id}` To fetch the details of a specific product.
- [x] \*`POST /products` To add a new product.
- [x] \*`PUT /products/{product_id}` To update an existing product.
- [x] \*`DELETE /products/{product_id}` To delete a product.
- [ ] \*`POST /products/{product_id}/reviews` To add a review for a product.
- [ ] `GET /products/{product_id}/reviews` To fetch reviews for a product.

## Cart Management

- [x] \*`GET /cart` To fetch the logged user shopping cart.
- [x] \*`POST /cart/items` To add a product to the cart.
- [x] \*`PUT /cart/items/{item_id}` To update the quantity of a product in the cart.
- [x] \*`DELETE /cart/items/{item_id}` To remove a product from the cart.
- [x] \*`POST /cart/checkout` To initiate a payment for an order.

## Order Management

- [ ] \*`GET /orders` To fetch a list of orders made by the user.
- [ ] \*`GET /orders/{order_id}` To fetch the details of a specific order.
- [ ] \*`PUT /orders/{order_id}/cancel` To cancel an order (if applicable).
- [ ] \*`PUT /orders/{order_id}/return` To return an order (if applicable).

## Admin-Specific Endpoints

- \*\*`GET /admin/orders` To fetch all orders across all users.
- \*\*`GET /admin/users` To fetch all users.
- \*\*`PUT /admin/orders/{order_id}/status` To update the status of an order.
- \*\*`GET /admin/users` To fetch a list of all users.
