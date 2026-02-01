import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProductDetail from './pages/ProductDetail';
import SellPost from './pages/SellPost';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import Profile from './pages/Profile';
import ChatPage from './pages/Chatpage';
import Layout from './Layout';
import Products from './pages/Products';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Layout wrapper */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sell" element={<SellPost />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<ChatPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
