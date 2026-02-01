import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import { showSuccess, showError } from '../utils/notifications';

const SellPost = () => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    location: '',
    images: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      showError('Please login to post a product');
      navigate('/login');
    }
    // If editing, fetch product details to prefill
    const prefill = async () => {
      if (editId) {
        try {
          const res = await productService.getProductById(editId);
          if (res.success) {
            const p = res.data;
            setFormData({
              productName: p.productName || '',
              description: p.description || '',
              price: p.price || '',
              category: p.category || '',
              condition: p.condition || '',
              location: p.location || '',
              images: []
            });
          } else {
            showError(res.message);
          }
        } catch (e) {
          showError('Failed to load product for edit');
        }
      }
    };
    prefill();
  }, [isAuthenticated, navigate]);

  const categories = [
    'Electronics',
    'Books',
    'Furniture',
    'Cycles',
    'Motorcycles',
    'Clothing',
    'Sports',
    'Others'
  ];

  const conditions = [
    'new',
    'used',
    'refurbished'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      images: [...formData.images, ...files]
    });
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      showError('Please upload at least one image');
      return;
    }

    setIsLoading(true);

    try {
      const result = editId
        ? await productService.updateProduct(editId, formData)
        : await productService.createProduct(formData);
      if (result.success) {
        showSuccess(editId ? 'Product updated successfully!' : 'Product posted successfully!');
        navigate(editId ? `/product/${editId}` : '/');
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError('Failed to post product. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-lg shadow-md p-8 border border-border">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Sell Your Product</h1>
            <p className="text-muted-foreground">Fill out the form below to list your product for sale</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Product Information</h2>

              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-foreground mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  required
                  value={formData.productName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  placeholder="Describe your product in detail"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
                    Price (৳) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-foreground mb-2">
                    Condition *
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    required
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  >
                    <option value="">Select condition</option>
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    placeholder="e.g., SUST Campus, Sylhet"
                  />
                </div>
              </div>
            </div>


            {/* Image Upload */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2">Product Images</h2>

              <div>
                <label htmlFor="images" className="block text-sm font-medium text-foreground mb-2">
                  Upload Images (Max 5 images)
                </label>
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                />
                <p className="text-sm text-muted-foreground mt-1">Upload clear images of your product</p>
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-destructive/90"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Terms and Submit */}
            <div className="space-y-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border bg-background rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-foreground">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:text-primary/90">Terms of Service</a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:text-primary/90">Privacy Policy</a>.
                  I confirm that the information provided is accurate and I own this product.
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Posting...' : 'Post Product'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-3 border border-input text-foreground rounded-lg font-semibold hover:bg-muted focus:outline-none focus:ring-2 focus:ring-muted focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellPost;
