import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({
  rating = 0,
  maxStars = 5,
  size = 'sm',
  interactive = false,
  onChange,
  showValue = false
}) => {
  const sizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(rating);

          return (
            <button
              key={index}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange && onChange(starValue)}
              className={`${
                interactive
                  ? 'cursor-pointer hover:scale-110 transition-transform p-0.5'
                  : 'cursor-default'
              }`}
            >
              <Star
                className={`${sizes[size]} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300 fill-slate-100'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-slate-700 ml-1">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default RatingStars;

