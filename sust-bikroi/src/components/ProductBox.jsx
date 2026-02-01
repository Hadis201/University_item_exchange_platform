import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductBox = ({ product }) => {
  const navigate = useNavigate();
  // Handle different data structures (backend vs frontend)
  const productName = product.productName || product.name;
  const productPrice = product.price;
  const productDescription = product.description;
  const productCondition = product.condition;
  const productImage = product.productImage?.[0] || product.image || '/api/placeholder/300/200';
  const owner = product.owner;
  const ownerName = owner?.fullName || product.sellerName || 'Unknown';
  const ownerPhone = owner?.phoneNumber || product.sellerPhone || 'N/A';
  const productId = product._id || product.id;

  return (
    <div className="bg-card rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-border group flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden bg-muted/20 border-b border-border">
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300 mix-blend-multiply dark:mix-blend-normal"
        />
        <div className="absolute top-3 right-3">
          <span className="text-xs font-bold text-muted-foreground bg-background/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-border uppercase tracking-wide">
            {productCondition || 'Used'}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-3 flex-grow">
          <h3 className="text-foreground font-bold text-lg leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {productName}
          </h3>
          <p className="text-xs text-muted-foreground font-medium">{product.category || 'General'}</p>
        </div>

        <div className="mb-4">
          <span className="text-xl font-extrabold text-primary block">
            ৳{Number(productPrice).toLocaleString()}
          </span>
        </div>

        <div className="pt-3 border-t border-border mt-auto">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0 text-primary font-bold text-xs ring-2 ring-background">
                {ownerName.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-foreground font-medium text-xs truncate">{ownerName}</p>
                <p className="text-muted-foreground text-[10px] truncate">{ownerPhone}</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${productId}`);
              }}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-3 py-1.5 rounded-lg font-semibold transition-all text-xs whitespace-nowrap active:scale-95"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBox;

