# **Simple Shopping Cart**

### **Project Goal**

A minimal e-commerce site to list products and manage a shopping cart.

### **Core Features**

- **Backend:**
  1. Create an API endpoint that returns a hardcoded JSON list of products (e.g., 5-10 items with id, name, price, and imageUrl). No database needed for this simple version.
  2. Create an API endpoint that accepts a list of product IDs and quantities, logs the order to the console, and returns a success message.
- **Frontend:**
  1. Fetch and display the products in a grid.
  2. Implement an "Add to Cart" button for each product.
  3. Manage the cart state on the client side.
  4. Show a cart view (a modal or separate page) with the list of items, quantities, and a total price.
  5. A "Checkout" button that sends the cart data to the backend checkout endpoint.

### **Evaluation Criteria**

- **Dev Skills & Code Quality:** Clear separation between frontend and backend, well-defined API, effective state management on the frontend for the cart.
- **Completion:** A user can view products, add them to a cart, and simulate a checkout.

### **Bonus Features ✨**

- Allow users to change the quantity of items in the cart.
- Persist the cart contents in localStorage so it doesn't get lost on page refresh.
- **Test Cases:** A backend test for the /products endpoint.
