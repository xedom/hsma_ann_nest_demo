## User Management

- `POST /users/signup` For user registration.
- `POST /users/login` For user login, returning a token for authenticated sessions.
- `POST /users/logout` To log the user out, invalidating the session token.
- `GET /users/profile` To fetch the profile details of the logged-in user.
- `PUT /users/profile` To update user profile details.

## Product Management

- `GET /products` To fetch a list of products, possibly with filtering, sorting, and pagination.
- `GET /products/{product_id}` To fetch the details of a specific product.
- `POST /products` To add a new product.
- `PUT /products/{product_id}` To update an existing product.
- `DELETE /products/{product_id}` To delete a product.
- `POST /products/{product_id}/reviews` To add a review for a product.
- `GET /products/{product_id}/reviews` To fetch reviews for a product.

## Cart Management

- `GET /cart` To fetch the current state of the user’s shopping cart.
- `POST /cart/items` To add a product to the cart.
- `PUT /cart/items/{item_id}` To update the quantity of a product in the cart.
- `DELETE /cart/items/{item_id}` To remove a product from the cart.

## Order Management

- `GET /orders` To fetch a list of orders made by the user.
- `GET /orders/{order_id}` To fetch the details of a specific order.
- `POST /orders` To create a new order from the items in the shopping cart.
- `PUT /orders/{order_id}/cancel` To cancel an order (if applicable).

## Payment

- `POST /payments` To initiate a payment for an order.
- `GET /payments/{payment_id}/status` To check the status of a payment.

## Miscellaneous

- `GET /categories` To fetch a list of product categories.
- `GET /search` To perform a search across products, categories, or other relevant entities.

## Admin-Specific Endpoints

- `GET /admin/orders` To fetch all orders across all users.
- `PUT /admin/orders/{order_id}/status` To update the status of an order.
- `GET /admin/users` To fetch a list of all users.
