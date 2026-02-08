# Title

***Shopping-cart-app***

# Reference Document

## 1. Objective

The goal is to develop a functional web service and a React-based frontend that handles the basic lifecycle of an e-commerce transaction: **User Creation → Authentication → Cart Management → Order Placement**.

**Important Note: Single-Device Session Management**
To ensure a user is only logged in from a single device at a time, the application must maintain a single active token for each user. This is achieved by:

1. **Storage**: Storing the generated JWT token in the `users` table/collection upon successful login.
2. **Prevention**: Checking if a token already exists in the user's record during a login attempt. If a token is present, the system denies access and the frontend displays a popup: *"You cannot login on another device."*
3. **Cleanup**: Removing the token from the database record when the user logs out, allowing them to log in again (on the same or a different device).

## 2. Technical Requirements

### Backend (Server)

- **Node.js & Express**: Web framework.
- **MongoDB & Mongoose**: Database and ODM (Object Data Modeling).
- **jsonwebtoken (JWT)**: For user authentication and session tokens.
- **bcryptjs**: For hashing passwords.
- **Cors**: To allow the frontend to communicate with the backend.

### Frontend (Client)

- **React (Vite)**: Modern frontend library.
- **Tailwind CSS**: For styling and responsive design.
- **Lucide React**: For UI icons.
- **Axios**: For making HTTP requests to the API.

## . Step-by-Step Instructions

### Phase 1: Backend Setup

1. **Environment Setup**: Initialize a Node.js project (`npm init`) and install dependencies (`express`, `mongoose`, `dotenv`, `jsonwebtoken`, `bcryptjs`, `cors`).
2. **Database Connection**: Connect to MongoDB using Mongoose.
3. **Schema Definition**: Create Mongoose models for `User`, `Item`, `Cart`, and `Order`. **Crucial**: The `User` model must include a `token` field to store the current active session.
4. **Middleware**: Implement an `auth` middleware that verifies the JWT token and ensures it matches the token stored in the user's database record.
5. **API Implementation**:
    - **POST /users**: Create a new user.
    - **POST /users/login**: Generate a token, store it in the User record, and return it. **Validation**: If a token already exists in the record, block the login to enforce the single-device rule.
    - **POST /users/logout**: Clear the token field in the User record.
    - **GET /items**: List all items.
    - **POST /carts**: (Protected) Add items to the user's specific cart.
    - **POST /orders**: (Protected) Convert the current cart into an order.

### Phase 2: Frontend Development

1. **Authentication Layer**: Create a Login screen.
    - Handle the specific error case where the user is already logged in elsewhere.
    - Store the received JWT in `localStorage` or cookies.
2. **Item Browser**: Build a grid view to list all available items from the database.
3. **Cart Integration**: On clicking an item, send a POST request to `/carts` with the item ID and the user's token.
4. **Dashboard Controls**: Add buttons for "Cart" (to see pending items) and "Order History" (to see completed orders).
5. **Checkout Flow**: Implement the checkout button that triggers the `/orders` API, clears the cart, and shows a success notification.

## 4. Project Structure

```
/shopping-cart-app
├── /backend
│   ├── /models
│   │   ├── User.js      // Added token field here
│   │   ├── Item.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── /middleware
│   │   └── auth.js      // Validates token against DB
│   ├── /routes
│   │   ├── userRoutes.js
│   │   ├── itemRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── server.js
│   └── .env
├── /frontend
│   ├── /src
│   │   ├── /components
│   │   │   ├── Login.jsx
│   │   │   ├── ItemList.jsx
│   │   │   └── Navbar.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── tailwind.config.js
└── package.json
```

<details>
<summary>Click to view user credentials</summary>

<br/>

**You can use any one of the following credentials**

```text
  username: bhanu
  password: bhanu@1234
```

```text
 username: rahul
 password: rahul@1234
```

<br/>
</details>

