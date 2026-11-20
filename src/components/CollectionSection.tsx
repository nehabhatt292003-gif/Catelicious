import React, { useState } from 'react';
import { ArrowUpDown, Check, Plus } from 'lucide-react';
import { CatNeed, PackType, Product, SortOption } from '../types';
import { PackArtwork } from './PackArtwork';

interface CollectionSectionProps {
  products: Product[];
  packFilter: 'All' | PackType;
  needFilter: CatNeed;
  sortBy: SortOption;
  onChangePackFilter: (pack: 'All' | PackType) => void;
  onChangeNeedFilter: (need: CatNeed) => void;
  onChangeSort: (sort: SortOption) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

const PACK_FILTERS: ('All' | PackType)[] = ['All', 'Trial Pack', 'Daily Pack'];
const NEED_FILTERS: CatNeed[] = [
  'All',
  'First-Time Switchers',
  'Everyday Nutrition',
  'Coat & Gut Care',
];

export const CollectionSection: React.FC<CollectionSectionProps> = ({
  products,
  packFilter,
  needFilter,
  sortBy,
  onChangePackFilter,
  onChangeNeedFilter,
  onChangeSort,
  onAddToCart,
  onSelectProduct,
}) => {
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const handleQuickAdd = (product: Product) => {
    onAddToCart(product);
    setRecentlyAddedId(product.id);
    window.setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === product.id ? null : curr));
    }, 1200);
  };

  return (
    <section id="collection" className="py-12 sm:py-16 border-t border-[#E4DDD2]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-medium text-[#525B56] mb-1.5">
              Cat Food Collection · Mid-Range Natural Nutrition
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2421]">
              One Clean Recipe, Sized for How You Feed
            </h2>
          </div>
          <p className="text-sm text-[#525B56] max-w-md leading-relaxed">
            No confusing flavor sprawl. Start with the 7-day Trial Pack or pick your monthly
            everyday pouch between ₹550 and ₹650.
          </p>
        </div>

        {/* HUFT-Inspired Filter & Sort Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E4DDD2]">
          <div className="flex flex-wrap items-center gap-3">
            {/* Segmented Pack Type Filter */}
            <div
              className="inline-flex items-center gap-1 p-1 bg-[#F4EFE6] border border-[#E4DDD2] rounded-lg"
              role="group"
              aria-label="Filter by pack type"
            >
              {PACK_FILTERS.map((pack) => {
                const active = packFilter === pack;
                return (
                  <button
                    key={pack}
                    type="button"
                    onClick={() => onChangePackFilter(pack)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#234F3E] text-[#FBF9F5]'
                        : 'text-[#525B56] hover:text-[#1E2421]'
                    }`}
                  >
                    {pack === 'All' ? 'All Packs' : `${pack}s`}
                  </button>
                );
              })}
            </div>

            {/* Need Filter */}
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Filter by cat need"
            >
              {NEED_FILTERS.map((need) => {
                const active = needFilter === need;
                return (
                  <button
                    key={need}
                    type="button"
                    onClick={() => onChangeNeedFilter(need)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                      active
                        ? 'bg-[#E6F0EA] border-[#234F3E] text-[#1E2421]'
                        : 'bg-[#FBF9F5] border-[#E4DDD2] text-[#525B56] hover:border-[#1E2421]/30 hover:text-[#1E2421]'
                    }`}
                  >
                    {need === 'All' ? 'All Needs' : need}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Count + Sort */}
          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
            <span className="text-xs text-[#525B56] tabular-nums whitespace-nowrap">
              Showing {products.length} {products.length === 1 ? 'pack' : 'packs'}
            </span>
            <label className="inline-flex items-center gap-2 text-xs font-medium text-[#1E2421] bg-[#F4EFE6] border border-[#E4DDD2] rounded-lg px-3 py-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#525B56]" aria-hidden="true" />
              <select
                value={sortBy}
                onChange={(e) => onChangeSort(e.target.value as SortOption)}
                aria-label="Sort products"
                className="bg-transparent text-xs font-medium text-[#1E2421] focus:outline-none cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </label>
          </div>
        </div>

        {/* Uniform Product Grid */}
        {products.length === 0 ? (
          <div className="rounded-2xl border border-[#E4DDD2] bg-[#F4EFE6] p-10 text-center">
            <p className="font-display text-xl text-[#1E2421] mb-2">
              No packs match those exact filters.
            </p>
            <p className="text-sm text-[#525B56] mb-5">
              Reset your filters to view our Trial Pack and Daily Nutrition range.
            </p>
            <button
              type="button"
              onClick={() => {
                onChangePackFilter('All');
                onChangeNeedFilter('All');
              }}
              className="px-4 py-2 text-xs font-semibold bg-[#234F3E] text-[#FBF9F5] rounded-lg hover:bg-[#193B2E] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const isAdded = recentlyAddedId === product.id;
              return (
                <article
                  key={product.id}
                  className="group flex flex-col rounded-2xl border border-[#E4DDD2] bg-[#FBF9F5] overflow-hidden transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* 65% Visual Backdrop */}
                  <button
                    type="button"
                    onClick={() => onSelectProduct(product)}
                    className="relative aspect-[4/3] w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#234F3E]"
                    aria-label={`View ingredients and details for ${product.name}`}
                  >
                    <PackArtwork
                      sku={product.sku}
                      name={product.name}
                      weightLabel={product.weightLabel}
                      pastelTone={product.pastelTone}
                      packType={product.packType}
                      imageUrl={product.imageUrl}
                    />
                  </button>

                  {/* Card Body — Identical Field Order */}
                  <div className="flex flex-col flex-1 p-5">
                    {/* Single Quiet Text Kicker (Zero Pill Spam) */}
                    <div className="flex items-center justify-between gap-2 text-xs text-[#525B56] mb-1.5">
                      <span>{product.kicker}</span>
                      <span className="font-mono-sku text-[11px] text-[#6E7772]">
                        {product.sku}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectProduct(product)}
                      className="text-left focus-visible:outline-none focus-visible:underline"
                    >
                      <h3 className="font-display text-lg font-semibold text-[#1E2421] leading-snug">
                        {product.name}
                      </h3>
                    </button>

                    <p className="text-xs text-[#525B56] mt-1 mb-3">{product.subtitle}</p>

                    {/* Natural Nutrition Highlights (Clean Typography, No Pills) */}
                    <ul className="space-y-1.5 text-xs text-[#1E2421]/90 mb-5 flex-1">
                      {product.nutritionHighlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2">
                          <span className="text-[#234F3E] font-bold" aria-hidden="true">
                            ·
                          </span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Price Baseline & Action */}
                    <div className="pt-4 border-t border-[#E4DDD2] flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-[#1E2421] tabular-nums">
                            ₹{product.priceInr}
                          </span>
                          {product.compareAtInr && (
                            <span className="text-xs text-[#6E7772] line-through tabular-nums">
                              ₹{product.compareAtInr}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#525B56]">{product.servingsEstimate}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px] ${
                          isAdded
                            ? 'bg-[#E6F0EA] text-[#1E2421] border border-[#234F3E]'
                            : 'bg-[#234F3E] text-[#FBF9F5] hover:bg-[#193B2E]'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#234F3E]" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
