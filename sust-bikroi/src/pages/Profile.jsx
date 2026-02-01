import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { productService } from '../services/productService';
import { showSuccess, showError } from '../utils/notifications';
import LoadingSpinner from '../components/LoadingSpinner';

const Profile = () => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [myProducts, setMyProducts] = useState([]);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    studentId: ''
  });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        studentId: user.studentId || ''
      });
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchMyProducts();
    }
  }, [activeTab]);

  const fetchMyProducts = async () => {
    setProductsLoading(true);
    try {
      const result = await productService.getMyPosts();
      if (result.success) {
        setMyProducts(result.data);
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError('Failed to fetch your products');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authService.updateProfile(profileData);
      if (result.success) {
        updateUser(result.data);
        showSuccess('Profile updated successfully!');
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await authService.changePassword(passwordData);
      if (result.success) {
        showSuccess('Password changed successfully');
        setPasswordData({ oldPassword: '', newPassword: '' });
      } else {
        showError(result.message);
      }
    } catch (err) {
      showError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        const result = await productService.deleteProduct(productId);
        if (result.success) {
          showSuccess('Product deleted successfully');
          fetchMyProducts(); // Refresh the list
        } else {
          showError(result.message);
        }
      } catch (error) {
        showError('Failed to delete product');
      }
    }
  };

  if (!isAuthenticated) {
    return <LoadingSpinner text="Redirecting to login..." />;
  }

  const TabButton = ({ tabName, currentTab, setTab, children }) => (
    <button
      onClick={() => setTab(tabName)}
      className={`py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-300 ${currentTab === tabName
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
        }`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-card rounded-2xl shadow-lg p-8 mb-8 animate-fade-in-down border border-border">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-4xl">
                {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{user?.fullName}</h1>
              <p className="text-muted-foreground mt-1">{user?.email}</p>
              <p className="text-sm text-muted-foreground mt-1">Student ID: {user?.studentId}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-2xl shadow-lg animate-fade-in-up border border-border">
          <div className="border-b border-border">
            <nav className="flex space-x-8 px-8">
              <TabButton tabName="profile" currentTab={activeTab} setTab={setActiveTab}>Profile Settings</TabButton>
              <TabButton tabName="products" currentTab={activeTab} setTab={setActiveTab}>My Products ({myProducts.length})</TabButton>
              <TabButton tabName="security" currentTab={activeTab} setTab={setActiveTab}>Security</TabButton>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-6">Update Your Profile</h2>

                <InputField label="Full Name" id="fullName" value={profileData.fullName} onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} />
                <InputField label="Email Address" id="email" type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                <InputField label="Phone Number" id="phoneNumber" type="tel" value={profileData.phoneNumber} onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })} />
                <InputField label="Student ID" id="studentId" value={profileData.studentId} onChange={(e) => setProfileData({ ...profileData, studentId: e.target.value })} />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-300"
                >
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordChange} className="space-y-6 max-w-lg mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-6">Change Password</h2>
                <InputField label="Current Password" id="oldPassword" type="password" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
                <InputField label="New Password" id="newPassword" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-300"
                >
                  {loading ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground">My Products</h2>
                  <Link
                    to="/sell"
                    className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-colors"
                  >
                    + Add New Product
                  </Link>
                </div>

                {productsLoading ? <LoadingSpinner text="Loading your products..." /> : myProducts.length === 0 ? (
                  <div className="text-center py-16 bg-muted/20 rounded-xl">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">You haven't listed any products yet.</h3>
                    <p className="text-muted-foreground mb-6">Ready to sell? It's quick and easy.</p>
                    <Link
                      to="/sell"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      List Your First Product
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myProducts.map((product) => (
                      <div key={product._id} className="bg-card border border-border rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                        <Link to={`/product/${product._id}`}>
                          <img
                            src={product.productImage?.[0] || '/api/placeholder/300/200'}
                            alt={product.productName}
                            className="w-full h-48 object-cover"
                          />
                        </Link>
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-foreground mb-2 truncate">{product.productName}</h3>
                          <p className="text-primary font-extrabold text-xl mb-3">৳{product.price}</p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <span>{product.category}</span>
                            <span className="capitalize">{product.condition}</span>
                          </div>
                          <div className="flex space-x-3">
                            <Link
                              to={`/product/${product._id}`}
                              className="flex-1 text-center bg-primary/10 text-primary py-2 px-4 rounded-lg text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="flex-1 bg-destructive text-destructive-foreground py-2 px-4 rounded-lg text-sm font-semibold hover:bg-destructive/90 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, id, type = 'text', value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-foreground mb-2">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
      required
    />
  </div>
);

export default Profile;


