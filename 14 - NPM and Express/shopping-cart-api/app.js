const express = require("express");
const app = express();
const port = 3000;
const products = require("./products");
const cartItems = require("./cart");

// Middleware
app.use(express.json());

// app.get()
// app.post()
// app.put()
// app.delete()

// This will return products array and cartItems array
// console.log("Products:", products)
// console.log("Cart:", cartItems)

// .get(Route/URL, Callback(Route Handler))
app.get("/products", (request, response) => {
  // Status Code 200: Successful
  response.status(200).json(products);
});

// Route Parameter: placeholder
app.get("/products/:productID", (request, response) => {
  // Check: int.parse
  const productID = parseInt(request.params.productID);

  // create a test condition, the first element passed the test condition will be return
  const product = products.find(
    (productObject) => productObject.id === productID
  );

  if (product) {
    // If there is a match, return the product Object.
    response.status(200).json(product);
  } else {
    // Return an error and tell the user the product is not found.
    response.status(404).json({ message: "Product not found" });
  }
});

function generateUniqueId() {
  if (products.length === 0) {
    // No product object inside of the products array.
    return 1;
  }

  const lastProductObject = products[products.length - 1];
  return lastProductObject.id + 1;
}

// .post(Route/URL, Callback(Route Handler))
app.post("/products", (request, response) => {
  // This will return the same value as desctructuring objects.
  // const name = request.body.name
  // const price = request.body.price
  const { name, price } = request.body;

  if (!name || !price) {
    return response.status(400).json({ message: "Name and price is required" });
  }

  const newProduct = {
    id: generateUniqueId(),
    name,
    price,
  };

  products.push(newProduct);

  response.status(201).json({ message: "Product added to the product list." });
});

app.put("/products/:productId", (request, response) => {
  const productId = parseInt(request.params.productId);
  const { name, price } = request.body;

  if (!name || !price) {
    return response.status(400).json({ message: "Name and price is required" });
  }

  const product = products.find(
    (productObject) => productObject.id === productId
  );

  if (product) {
    product.name = name;
    product.price = price;
    response.status(200).json({ message: "Product updated successfully." });
  } else {
    response.status(404).json({ message: "Product not found" });
  }
});

app.delete("/products/:productId", (request, response) => {
  const productId = parseInt(request.params.productId);

  const productIndex = products.findIndex(
    (productObject) => productObject.id === productId
  );

  if (productIndex !== -1) {
    // .splice(start, deleteCount?, element/s)
    products.splice(productIndex, 1);
    response.status(200).json({ message: "Product deleted successfully" });
  } else {
    response.status(404).json({ message: "Product not found" });
  }
});

// ---------------------------------------------------------
// ---------------------------------------------------------

app.get("/cart", (request, response) => {
  response.status(200).json(cartItems);
});

app.post("/cart", (request, response) => {
  const { productID, quantity } = request.body;

  if (!productID || !quantity) {
    return response
      .status(400)
      .json({ message: "Product ID and quantity are required" });
  }

  const product = products.find(
    (productObject) => productObject.id === productID
  );

  if (!product) {
    return response.status(404).json({ message: "Product not found" });
  }

  const cartItem = cartItems.find(
    (cartItemObject) => cartItemObject.productID === productID
  );

  if (cartItem) {
    // If it exists, update the quantity
    cartItem.quantity += quantity;
  } else {
    // If it doesn't exist, add a new item to the cart
    const newCartItem = {
      productID,
      quantity,
    };

    cartItems.push(newCartItem);
  }

  response
    .status(200)
    .json({ message: "Item has been added to your shopping cart", cartItems });
});

app.delete("/cart/:productId", (request, response) => {
  const productId = parseInt(request.params.productId);

  const productIndex = cartItems.findIndex(
    (cartItemObject) => cartItemObject.productID === productId
  );

  if (productIndex !== -1) {
    // .splice(start, deleteCount?, element/s)
    cartItems.splice(productIndex, 1);
    response.status(200).json({ message: "Item removed from cart" });
  } else {
    response.status(404).json({ message: "Item does not exist" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}...`);
});

// Testing
//  http://localhost:3000/cart/1 = deleted an item to the cart
// http://localhost:3000/cart/2 = not exist
// Sample item to add on cart

//   {
//     "productID": 1,
//     "quantity": 1
//    }

// }
