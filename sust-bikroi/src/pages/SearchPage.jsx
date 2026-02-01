import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductBox from '../components/ProductBox';
import { productService } from '../services/productService';
import { showError } from '../utils/notifications';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState({ items: [], page: 1, limit: 12, total: 0, totalPages: 0, query: '' });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setPage(1); // Reset to first page when query changes
      performSearch(query, 1);
    }
  }, [query]);

  useEffect(() => {
    if (query && page > 1) {
      performSearch(query, page);
    }
  }, [page]);

  const performSearch = async (searchQuery, currentPage = 1) => {
    try {
      setLoading(true);
      const result = await productService.searchProducts(searchQuery, { page: currentPage, limit: 12 });
      if (result.success) {
        setSearchResults(result.data);
      } else {
        setSearchResults({ items: [], page: 1, limit: 12, total: 0, totalPages: 0, query: searchQuery });
        showError(result.message);
      }
    } catch (error) {
      setSearchResults({ items: [], page: 1, limit: 12, total: 0, totalPages: 0, query: searchQuery });
      showError('Search failed');
    } finally {
      setLoading(false);
    }
  };

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
                <span className="ml-1 text-sm font-medium text-muted-foreground md:ml-2">Search Results</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-muted-foreground">
            {loading ? 'Searching...' : `Found ${searchResults.total} products`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : searchResults.total === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">Try searching with different keywords or browse our categories.</p>
            <div className="flex justify-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResults.items.map((product) => (
                <Link key={product._id} to={`/product/${product._id}`}>
                  <ProductBox product={product} />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {searchResults.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-muted"
                >
                  Previous
                </button>
                {Array.from({ length: searchResults.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 border rounded hover:bg-muted ${p === page ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === searchResults.totalPages}
                  onClick={() => setPage((p) => Math.min(searchResults.totalPages, p + 1))}
                  className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-muted"
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

export default SearchPage;


