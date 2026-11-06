import React from 'react';
import { Filter, RotateCcw, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductFilters = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  maxPrice,
  onChangeMaxPrice,
  selectedRating,
  onSelectRating,
  onResetFilters
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span>Filters</span>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Categories
        </h4>
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              selectedCategory === 'all' || !selectedCategory
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => onSelectCategory(cat.slug || cat._id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat.slug || selectedCategory === cat._id
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Max Price
          </h4>
          <span className="text-xs font-bold text-slate-900">
            {formatCurrency(maxPrice || 50000)}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="50000"
          step="500"
          value={maxPrice || 50000}
          onChange={(e) => onChangeMaxPrice(Number(e.target.value))}
          className="w-full accent-indigo-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
          <span>₹500</span>
          <span>₹50,000</span>
        </div>
      </div>

      {/* Customer Ratings */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          {[4, 3, 2].map((stars) => (
            <button
              key={stars}
              type="button"
              onClick={() => onSelectRating(selectedRating === stars ? null : stars)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedRating === stars
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < stars ? 'fill-amber-400' : 'text-slate-200 fill-slate-100'
                      }`}
                    />
                  ))}
                </div>
                <span>& Up</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;

