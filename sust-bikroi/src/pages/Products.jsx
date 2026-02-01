import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductBox from '../components/ProductBox';
import LoadingSpinner from '../components/LoadingSpinner';
import { showError } from '../utils/notifications';

const Products = () => {
  const [pageData, setPageData] = useState({ items: [], page: 1, limit: 12, total: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const result = await productService.getAllProducts({ page, limit: 12 });
        if (result.success) {
          setPageData(result.data);
        } else {
          setPageData({ items: [], page: 1, limit: 12, total: 0, totalPages: 0 });
          showError(result.message);
        }
      } catch (e) {
        setPageData({ items: [], page: 1, limit: 12, total: 0, totalPages: 0 });
        showError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [page]);

  const PaginationButton = ({ onClick, disabled, children, isActive = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 ${isActive
          ? 'bg-primary text-primary-foreground shadow-md'
          : 'bg-card text-foreground border border-input hover:bg-muted'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
            Discover Your Next Treasure
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Browse through a wide variety of items listed by students just like you.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading products..." />
        ) : pageData.total === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl shadow-lg border border-border animate-fade-in-up">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No Products Found</h3>
            <p className="text-muted-foreground mb-8">It looks like nothing is for sale right now. Why not be the first?</p>
            <Link
              to="/sell"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform hover:scale-105"
            >
              Sell Your Item
            </Link>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {pageData.items.map((product) => (
                <ProductBox key={product._id} product={product} />
              ))}
            </div>

            {pageData.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12 pt-8 border-t border-border">
                <PaginationButton
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  &larr; Previous
                </PaginationButton>
                {Array.from({ length: pageData.totalPages }, (_, i) => i + 1).map((p) => (
                  <PaginationButton
                    key={p}
                    onClick={() => setPage(p)}
                    isActive={p === page}
                  >
                    {p}
                  </PaginationButton>
                ))}
                <PaginationButton
                  disabled={page === pageData.totalPages}
                  onClick={() => setPage((p) => Math.min(pageData.totalPages, p + 1))}
                >
                  Next &rarr;
                </PaginationButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;



