**CampusTrade** is a full-stack marketplace platform designed for college students to buy and sell items within their campus community. Students can create accounts using their institute email, list products for sale, browse available listings, save products to a wishlist, and manage their marketplace activity through a modern web interface.

**Features**

Authentication : User registration and login, JWT-based authentication, secure password hashing using bcrypt, protected routes for authenticated users.

Marketplace : Create, edit, and delete listings, browse all available products, search listings by keyword and filter products by category and price range.

Wishlist : Add and remove products from a wishlist, view saved items for future purchases.

Image Uploads : Support for multiple product images, product image previews for listings.

**Tech Stack**

Frontend
* React
* Vite
* React Router
* Axios
* CSS

Backend
* Node.js
* Express.js
* JWT Authentication
* Multer

Database
* MySQL

Deployment
* Frontend: Vercel
* Backend: Railway
* Database: Railway MySQL

**Environment Variables**

Backend
Create a .env file inside the server folder:

PORT=8080

MYSQL_HOST=
MYSQL_PORT=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=

JWT_SECRET=
JWT_EXPIRES_IN=7d

CLIENT_URL= http://localhost:5173


Frontend
Create a .env file inside the client folder:

VITE_API_URL= http://localhost:8080/api


**Future Improvements**
* Real-time chat between buyers and sellers
* Product reporting and moderation system
* Product reviews and ratings
* AI-powered recommendations
* Campus-specific marketplace communities
