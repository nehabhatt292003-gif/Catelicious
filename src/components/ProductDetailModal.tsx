import React from 'react';
import { X, Plus } from 'lucide-react';
import { Product } from '../types';
import { PackArtwork } from './PackArtwork';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2421]/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-title"
    >
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FBF9F5] border border-[#E4DDD2] shadow-2xl grid grid-cols-1 md:grid-cols-12">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-lg bg-[#FBF9F5]/90 border border-[#E4DDD2] flex items-center justify-center text-[#1E2421] hover:bg-[#F4EFE6] transition-colors"
          aria-label="Close product details"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Visual Left */}
        <div className="md:col-span-5 min-h-[260px]">
          <PackArtwork
            sku={product.sku}
            name={product.name}
            weightLabel={product.weightLabel}
            pastelTone={product.pastelTone}
            packType={product.packType}
            imageUrl={product.imageUrl}
          />
        </div>

        {/* Contiguous Purchase Module Right */}
        <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#525B56] mb-1">
              <span>{product.kicker}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-sku">{product.sku}</span>
            </div>

            <h3 id="pdp-title" className="font-display text-2xl font-semibold text-[#1E2421]">
              {product.name}
            </h3>
            <p className="text-sm text-[#525B56] mt-1">{product.description}</p>

            {/* Key Ingredients */}
            <div className="mt-5">
              <h4 className="text-xs font-semibold text-[#1E2421] mb-2">
                Naturally Sourced Ingredients
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#525B56]">
                {product.keyIngredients.map((ingredient) => (
                  <li key={ingredient} className="flex items-start gap-1.5">
                    <span className="text-[#234F3E] font-bold" aria-hidden="true">
                      ·
                    </span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Guaranteed Analysis */}
            <div className="mt-5 pt-4 border-t border-[#E4DDD2]">
              <h4 className="text-xs font-semibold text-[#1E2421] mb-2.5">
                Guaranteed Nutritional Profile
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.guaranteedAnalysis.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-lg bg-[#F4EFE6] px-3 py-2 border border-[#E4DDD2]"
                  >
                    <p className="text-[11px] text-[#525B56]">{metric.label}</p>
                    <p className="text-xs font-semibold text-[#1E2421] tabular-nums mt-0.5">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Feeding Guide */}
            <div className="mt-4 rounded-xl bg-[#E6F0EA] p-3.5 text-xs text-[#1E2421]">
              <span className="font-semibold">Feeding &amp; Transition Guide: </span>
              <span className="text-[#525B56]">{product.feedingGuide}</span>
            </div>
          </div>

          {/* Sticky Footer Purchase Bar */}
          <div className="pt-4 border-t border-[#E4DDD2] flex items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#1E2421] tabular-nums">
                  ₹{product.priceInr}
                </span>
                {product.compareAtInr && (
                  <span className="text-xs text-[#6E7772] line-through tabular-nums">
                    ₹{product.compareAtInr}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#525B56]">{product.servingsEstimate}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-[#FBF9F5] bg-[#234F3E] hover:bg-[#193B2E] rounded-lg transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
