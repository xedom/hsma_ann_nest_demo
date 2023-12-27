\*: must be logged in as user\
\*\*: must be logged in as vendor\
\*\*\*: must be logged in as admin

## User Management

- `POST /auth/login` For user login, returning a token for authenticated sessions.
- `POST /auth/register` For user registration.
- \*`GET /auth/logout` To log the user out, invalidating the session token.
- `GET /auth/github` To log the user in using GitHub OAuth.
- `GET /auth/github/callback` To handle the callback from GitHub OAuth.
- `GET /auth/auth0` To log the user in using Auth0.
- `GET /auth/auth0/callback` To handle the callback from Auth0.

- `GET /users` To fetch a list of users.
- `GET /users/{username}` To fetch the details of a specific user.
- `GET /users/id/{user_id}` To fetch the details of a specific user.
- \*`POST /users/settings` To update user settings/information.
- `PUT /users/{user_id}` To update an existing user (role).
- \*\*\*`DELETE /users/{user_id}` To delete a user.
- \*`GET /users/profile` To fetch the profile details of the logged-in user.

## Product Management

- `GET /products` To fetch a list of products, possibly with filtering, sorting, and pagination.
- `GET /products/search?name={name}` To fetch the details of a specific product.
- `GET /products/user/{user_id}` To fetch a list of products by a specific user.
- `GET /products/{product_id}` To fetch the details of a specific product.
- \*\*`PUT /products/{product_id}` To update an existing product.
- \*\*`POST /products` To add a new product.
- \*\*\*`DELETE /products/{product_id}` To delete a product.
<!-- - \*`POST /products/{product_id}/reviews` To add a review for a product. -->
<!-- - `GET /products/{product_id}/reviews` To fetch reviews for a product. -->

## Cart Management

- \*`GET /cart` To fetch user shopping cart.
- \*`POST /cart/items` To add a product to the cart.
- \*`PUT /cart/items/{item_id}` To update the quantity of a product in the cart.
- \*`DELETE /cart/items/{item_id}` To remove a product from the cart.
- \*`POST /cart/checkout` To initiate a payment for an order.

## Order Management

- \*`GET /orders` To fetch a list of orders made by the user.
- \*`GET /orders/{order_id}` To fetch the details of a specific order.
- \*`PUT /orders/{order_id}/cancel` To cancel an order (if applicable).
- \*`PUT /orders/{order_id}/return` To return an order (if applicable).

<!-- ## Admin-Specific Endpoints

- \*\*\*`GET /admin/orders` To fetch all orders across all users.
- \*\*\*`GET /admin/users` To fetch all users.
- \*\*\*`PUT /admin/orders/{order_id}/status` To update the status of an order.
- \*\*\*`GET /admin/users` To fetch a list of all users. -->
