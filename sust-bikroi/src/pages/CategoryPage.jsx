import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductBox from '../components/ProductBox';
import { productService } from '../services/productService';
import { showError } from '../utils/notifications';

const CategoryPage = () => {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [productsPage, setProductsPage] = useState({ items: [], page: 1, limit: 12, total: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const categoryNames = {
    electronics: "Electronics",
    books: "Books",
    furniture: "Furniture",
    cycles: "Cycles",
    motorcycles: "Motorcycles",
    clothing: "Clothing",
    sports: "Sports",
    others: "Others"
  };

  const displayName = categoryNames[category] || (category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Category');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await productService.getProductsByCategory(category, { page, limit: 12 });
        if (result.success) {
          setProductsPage(result.data);
        } else {
          setProductsPage({ items: [], page: 1, limit: 12, total: 0, totalPages: 0 });
          showError(result.message);
        }
      } catch (error) {
        setProductsPage({ items: [], page: 1, limit: 12, total: 0, totalPages: 0 });
        showError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, page]);

  // Filtering by price range (safe number parsing)
  const filteredProducts = productsPage.items.filter((product) => {
    const min = priceRange.min !== '' ? Number(priceRange.min) : null;
    const max = priceRange.max !== '' ? Number(priceRange.max) : null;
    if (min !== null && product.price < min) return false;
    if (max !== null && product.price > max) return false;
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
      default:
        // assuming higher `id` = newer
        return b.id - a.id;
    }
  });

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
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-muted-foreground md:ml-2">{displayName}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {displayName} ({loading ? '...' : productsPage.total} items)
          </h1>
          <p className="text-muted-foreground">
            Browse through {displayName.toLowerCase()} available for sale
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : productsPage.total === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found in {displayName}</h3>
            <p className="text-muted-foreground mb-6">We don't have listings under this category at the moment. You can list an item or browse other categories.</p>
            <div className="flex justify-center gap-4">
              <Link
                to="/sell"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                List Your Product
              </Link>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-input text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-muted"
              >
                Browse Home
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Filters and Sort */}
            <div className="bg-card rounded-lg shadow-sm p-6 mb-8 border border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sort */}
                <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-foreground mb-2">
                    Sort by
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price Range (৳)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setPriceRange({ min: '', max: '' });
                      setSortBy('newest');
                    }}
                    className="w-full px-4 py-2 border border-input text-foreground rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-muted focus:ring-offset-2"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid or No-results message */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <Link key={product._id} to={`/product/${product._id}`}>
                    <ProductBox product={product} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or check back later for new listings.</p>
                <Link
                  to="/sell"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  List Your Product
                </Link>
              </div>
            )}

            {/* Pagination */}
            {productsPage.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: productsPage.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 border rounded ${p === page ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === productsPage.totalPages}
                  onClick={() => setPage((p) => Math.min(productsPage.totalPages, p + 1))}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

