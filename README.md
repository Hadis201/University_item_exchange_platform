# 🎓 SUST Item Exchange Platform

> A modern, secure marketplace designed exclusively for SUST students to buy, sell, and exchange items within the campus community.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)[![React](https://img.shields.io/badge/React-19.1+-blue.svg)](https://reactjs.org/)[![MongoDB](https://img.shields.io/badge/MongoDB-8+-green.svg)](https://www.mongodb.com/)

## 📋 Table of Contents

-   [Overview](#overview)
-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Project Structure](#project-structure)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Configuration](#configuration)
-   [Running the Application](#running-the-application)
-   [API Documentation](#api-documentation)
-   [Contributing](#contributing)
-   [License](#license)

## 🎯 Overview

The SUST Item Exchange Platform is a full-stack web application that enables students at Shahjalal University of Science and Technology (SUST) to create a sustainable campus economy. Students can easily list items for sale, browse available products, and connect with fellow students for secure transactions.

### Key Benefits

-   🌱 **Sustainable**: Promote reuse and reduce waste on campus
-   🔒 **Secure**: Student-verified accounts and safe transactions
-   💰 **Cost-effective**: Save money by buying and selling used items
-   👥 **Community-driven**: Built by students, for students

## ✨ Features

### User Management

-   🔐 Secure authentication with JWT (access & refresh tokens)
-   👤 User registration and login
-   📱 Profile management with avatar upload
-   🔄 Automatic token refresh mechanism

### Product Marketplace

-   📦 Create, read, update, and delete product listings
-   🖼️ Image upload with Cloudinary integration
-   🏷️ Category-based product browsing (Electronics, Books, Furniture, etc.)
-   🔍 Search and filter functionality
-   📄 Detailed product pages with seller information

### Frontend Features

-   📱 Fully responsive design with Tailwind CSS
-   ⚡ Fast and modern UI with React 19 and Vite
-   🎨 Intuitive user interface with smooth animations
-   🌐 Client-side routing with React Router
-   💬 Real-time notifications

## 🛠️ Tech Stack

### Backend

-   **Runtime**: Node.js (v18+)
-   **Framework**: Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Authentication**: JWT (jsonwebtoken)
-   **File Upload**: Multer + Cloudinary
-   **Security**: bcrypt for password hashing
-   **CORS**: Enabled for cross-origin requests

### Frontend

-   **Framework**: React 19.1
-   **Build Tool**: Vite 7
-   **Styling**: Tailwind CSS 4
-   **Routing**: React Router DOM v7
-   **HTTP Client**: Axios
-   **State Management**: React Context API

### DevOps & Tools

-   **Version Control**: Git
-   **Package Manager**: npm
-   **Development**: Nodemon for hot reload
-   **Code Quality**: ESLint, Prettier

## 📁 Project Structure

```
University_item_exchange_platform/
├── backend/                    # Backend API server
│   ├── db/                    # Database configuration
│   │   ├── index.js          # MongoDB connection
│   │   └── name.js           # Database name config
│   ├── public/               # Static files
│   │   └── temp/            # Temporary upload storage
│   ├── src/
│   │   ├── controller/      # Route controllers
│   │   │   ├── product.controller.js
│   │   │   └── user.controller.js
│   │   ├── middleware/      # Custom middleware
│   │   │   ├── auth-middleware.js
│   │   │   └── multermiddleware.js
│   │   ├── model/          # Mongoose schemas
│   │   │   ├── product.model.js
│   │   │   └── user.model.js
│   │   ├── router/         # API routes
│   │   │   ├── product.router.js
│   │   │   └── user.router.js
│   │   ├── utils/          # Utility functions
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   └── cloudinary.js
│   │   ├── app.js          # Express app configuration
│   │   └── index.js        # Server entry point
│   ├── .env                # Environment variables
│   └── package.json        # Dependencies
├── sust-bikroi/            # Frontend React web application
    ├── public/             # Static assets
    ├── src/
    │   ├── assets/        # Images, icons
    │   ├── components/    # Reusable components
    │   │   ├── Footer.jsx
    │   │   ├── Header.jsx
    │   │   ├── LoadingSpinner.jsx
    │   │   └── ProductBox.jsx
    │   ├── context/       # React Context
    │   │   └── AuthContext.jsx
    │   ├── pages/         # Page components
    │   │   ├── CategoryPage.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Products.jsx
    │   │   ├── Profile.jsx
    │   │   ├── SearchPage.jsx
    │   │   ├── SellPost.jsx
    │   │   └── Signup.jsx
    │   ├── services/      # API services
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   └── productService.js
    │   ├── utils/         # Helper functions
    │   │   └── notifications.js
    │   ├── App.jsx        # Main App component
    │   ├── Layout.jsx     # Layout wrapper
    │   └── main.jsx       # Application entry point
    ├── index.html
    ├── vite.config.js     # Vite configuration
    └── package.json       # Dependencies
└── sust-bikroi-mobile/     # Mobile React Native app (Expo)
    ├── src/
    │   ├── navigation/    # React Navigation
    │   │   └── AppNavigator.js
    │   ├── screens/       # App screens
    │   │   ├── LoginScreen.js
    │   │   ├── SignupScreen.js
    │   │   ├── HomeScreen.js
    │   │   ├── ProductsScreen.js
    │   │   ├── ProductDetailScreen.js
    │   │   ├── SellPostScreen.js
    │   │   ├── SearchScreen.js
    │   │   ├── CategoryScreen.js
    │   │   ├── ProfileScreen.js
    │   │   └── ChatScreen.js
    │   ├── components/    # Reusable components
    │   │   ├── ProductCard.js
    │   │   └── LoadingSpinner.js
    │   ├── services/      # API services
    │   │   ├── api.js
    │   │   ├── authService.js
    │   │   ├── productService.js
    │   │   ├── chatService.js
    │   │   └── socket.js
    │   └── context/       # Context providers
    │       └── AuthContext.js
    ├── App.js
    ├── app.json           # Expo configuration
    └── package.json
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
-   **npm** (comes with Node.js)
-   **MongoDB** (v5.0 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
-   **Git** - [Download](https://git-scm.com/)
-   **Cloudinary Account** - [Sign up](https://cloudinary.com/) (free tier available)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Hadis201/University_item_exchange_platform.gitcd University_item_exchange_platform
```

### 2. Backend Setup

```bash
# Navigate to backend directorycd backend# Install dependenciesnpm install# Create the required directory for file uploadsmkdir -p public/temp
```

### 3. Frontend Web Setup

```bash
# Navigate to frontend directory (from project root)
cd sust-bikroi
# Install dependencies
npm install
```

### 4. Mobile App Setup (Android)

```bash
# Navigate to mobile app directory (from project root)
cd sust-bikroi-mobile
# Install dependencies
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
DIY
```

### Frontend Configuration

If needed, create a `.env` file in the `sust-bikroi` directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

> **Note**: The frontend is currently configured to use `http://localhost:5000` by default. Modify `src/services/api.js` if you need a different backend URL.

## 🎮 Running the Application

### Development Mode

#### 1. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDBmongod# Or if using MongoDB as a service (Linux)sudo systemctl start mongod# Or if using MongoDB as a service (macOS)brew services start mongodb-community
```

#### 2. Start the Backend Server

```bash
# From the backend directorycd backendnpm run dev
```

The backend server will start at `http://localhost:5000`

You can verify it's running by visiting: `http://localhost:5000/health`

#### 3. Start the Frontend Development Server

Open a new terminal:

```bash
# From the frontend directorycd sust-bikroinpm run dev
```

The frontend will start at `http://localhost:5173`

#### 4. Access the Web Application

Open your browser and navigate to: `http://localhost:5173`

### Running the Mobile App (Android)

#### 1. Configure Backend URL

For the mobile app to connect to your backend, you need to update the API base URL in `/sust-bikroi-mobile/src/services/api.js`:

- **Android Emulator**: The default `http://10.0.2.2:5000` is already configured
- **Physical Device**: Find your computer's local IP and update to `http://192.168.x.x:5000`

To find your local IP:
```bash
# On Linux/Mac
ifconfig | grep "inet "
# On Windows
ipconfig
```

#### 2. Start Expo Dev Server

Make sure the backend is running first, then:

```bash
# From the mobile app directory
cd sust-bikroi-mobile
npx expo start
```

#### 3. Run on Android

You have two options:

**Option A: Android Emulator** (requires Android Studio)
- Press `a` in the Expo CLI to open in Android emulator

**Option B: Physical Android Device** (easier)
- Install [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) from Play Store
- Scan the QR code shown in terminal with Expo Go app
- Make sure your phone and computer are on the same WiFi network

> **Note**: Both the web app and mobile app can run simultaneously and will share the same backend data!

## 🔌 API Documentation

### Base URL

```
http://localhost:5000
```

### Authentication Endpoints

#### Register User

```http
POST /user/registerContent-Type: multipart/form-dataBody:- fullName: string- email: string- password: string- avatar: file (optional)
```

#### Login

```http
POST /user/loginContent-Type: application/jsonBody:{  "email": "user@example.com",  "password": "password123"}Response:{  "statusCode": 200,  "data": {    "user": {...},    "accessToken": "...",    "refreshToken": "..."  }}
```

#### Logout

```http
POST /user/logoutAuthorization: Bearer <access_token>
```

#### Refresh Token

```http
POST /user/refresh-tokenContent-Type: application/jsonBody:{  "refreshToken": "..."}
```

#### Get Current User

```http
GET /user/current-userAuthorization: Bearer <access_token>
```

### Product Endpoints

#### Get All Products

```http
GET /product
```

#### Get Product by ID

```http
GET /product/:id
```

#### Create Product

```http
POST /productAuthorization: Bearer <access_token>Content-Type: multipart/form-dataBody:- title: string- description: string- price: number- category: string- condition: string- images: file[] (up to 5 images)
```

#### Update Product

```http
PATCH /product/:idAuthorization: Bearer <access_token>Content-Type: multipart/form-data
```

#### Delete Product

```http
DELETE /product/:idAuthorization: Bearer <access_token>
```

#### Search Products

​`GET /product/search?q=query&category=electronics`

## 🧪 Testing

```bash
# Backend tests (if configured)cd backendnpm test# Frontend tests (if configured)cd sust-bikroinpm test
```

## 📝 Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Solution**: Make sure MongoDB is running and the connection string in `.env` is correct.

### Issue: File Upload Error (ENOENT: no such file or directory)

**Solution**: Create the `public/temp` directory in the backend folder:

```bash
mkdir -p backend/public/temp
```

### Issue: CORS Error

**Solution**: Check that the backend CORS configuration allows your frontend origin.

### Issue: JWT Token Expired

**Solution**: The refresh token mechanism should handle this automatically. If not, try logging in again.

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

### Coding Standards

-   Follow existing code style
-   Write meaningful commit messages
-   Add comments for complex logic
-   Test your changes before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

-   **SUST L-SHAPE** - Initial work

## 🙏 Acknowledgments

-   SUST Student Community
-   All contributors and testers
-   Open source libraries and tools used in this project

## 📧 Contact

For questions, suggestions, or support:

-   Create an issue in the GitHub repository
-   Email: [hati.tirpol@gmail.com](mailto:hati.tirpol@gmail.com)

## 🗺️ Roadmap

-    Add real-time chat functionality
-    Implement payment integration
-    Add email notifications
-    ✅ Mobile app development (Android - Expo React Native)
-    Advanced search filters
-    User rating and review system
-    Admin dashboard
-    Analytics and insights

---

Made with ❤️ by SUST Students for SUST Students