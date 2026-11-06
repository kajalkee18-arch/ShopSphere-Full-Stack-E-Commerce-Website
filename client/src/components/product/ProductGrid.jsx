import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products = [] }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-2xl font-bold">
          📦
        </div>
        <h3 className="text-base font-bold text-slate-900">No products found</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          We couldn't find any products matching your selected search or filter criteria. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
