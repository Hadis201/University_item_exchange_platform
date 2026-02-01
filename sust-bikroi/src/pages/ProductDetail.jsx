import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import { showError, showSuccess } from '../utils/notifications';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await productService.getProductById(id);
        if (result.success) {
          setProduct(result.data);
        } else {
          showError(result.message);
          navigate('/');
        }
      } catch (error) {
        showError('Failed to load product details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!isAuthenticated || !user || product.owner._id !== user._id) {
      showError('You are not authorized to delete this product');
      return;
    }

    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const result = await productService.deleteProduct(product._id);
        if (result.success) {
          showSuccess('Product deleted successfully');
          navigate('/');
        } else {
          showError(result.message);
        }
      } catch (error) {
        showError('Failed to delete product');
      }
    }
  };

  const isOwner = isAuthenticated && user && product?.owner?._id === user._id;

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }

    navigate('/chat', {
      state: {
        peer: {
          _id: product.owner?._id,
          fullName: product.owner?.fullName,
          userName: product.owner?.userName,
        },
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/" className="text-primary hover:text-primary/90">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const productImages = product.productImage || [];
  const currentImage = productImages[currentImageIndex] || '/api/placeholder/500/400';

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link to={`/category/${product.category}`} className="ml-1 text-sm font-medium text-muted-foreground hover:text-primary md:ml-2">
                  {product.category}
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-muted-foreground md:ml-2">{product.productName}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-12">
              <img
                src={currentImage}
                alt={product.productName}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden border-2 ${currentImageIndex === index ? 'border-primary' : 'border-border'
                      }`}
                  >
                    <img
                      src={image}
                      alt={`${product.productName} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{product.productName}</h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Category: {product.category}</span>
                <span>•</span>
                <span className="capitalize">Condition: {product.condition}</span>
              </div>
            </div>

            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                ৳{product.price}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Location</h3>
              <p className="text-muted-foreground">{product.location}</p>
            </div>

            {/* Seller Information */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground mb-2">Seller Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {product.owner?.fullName || "Unknown User"}</p>
                {!isOwner && (
                  <>
                    <p><span className="font-medium">Phone:</span> {product.owner?.phoneNumber || "N/A"}</p>
                    <p><span className="font-medium">Email:</span> {product.owner?.email || "N/A"}</p>
                  </>
                )}
                <p><span className="font-medium">Student ID:</span> {product.owner?.studentId || "N/A"}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {!isOwner && (
                <button
                  onClick={handleContactSeller}
                  className="flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Contact Seller
                </button>
              )}

              {isOwner && (
                <>
                  <button
                    onClick={() => navigate(`/sell?edit=${product._id}`)}
                    className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Delete Product
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;