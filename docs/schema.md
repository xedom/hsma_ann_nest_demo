## user

```js
{
  username: String,
  email: String,
  password: String,
  picture: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  orders: [OrderID],
  cart: CartID,
  balance: Number,
  role: [VUser, Admin, CUser],
}
```

## product

```js
{
  name: String,
  description: String,
  price: Number,
  stock: Number,
  images: [String],
  category: String,
  reviews: [{
    userID: String,
    rating: Number,
    comment: String,
  }],
}
```

## cart

```js
{
  userID: String,
  items: [{
    productID: String,
    quantity: Number,
  }],
  total: Number,
}
```

## order

```js
{
  userID: String,
  items: [{
    productID: String,
    quantity: Number,
  }],
  total: Number,
  status: String,
}
```

## category

```js
{
  name: String,
  description: String,
}
```
