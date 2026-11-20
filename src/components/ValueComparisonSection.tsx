import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { VALUE_COMPARISON_COLUMNS } from '../data/catalog';

interface ValueComparisonSectionProps {
  onSelectTrialPack: () => void;
}

const INGREDIENT_PILLARS = [
  {
    title: '01. Real Deboned Poultry First',
    detail:
      '68%+ farm-sourced chicken and nutrient-dense organ meats provide bioavailable taurine and lean amino acids without meat by-product meal.',
    surface: 'bg-[#F9EAE4]',
  },
  {
    title: '02. Gentle Prebiotic Botanicals',
    detail:
      'Steamed pumpkin, chicory root inulin, and natural soluble fiber support smooth digestion for indoor apartment cats.',
    surface: 'bg-[#E6F0EA]',
  },
  {
    title: '03. Zero Fillers or Synthetic Dyes',
    detail:
      'No corn gluten, soy protein, artificial food coloring, or harsh chemical preservatives—preserved naturally with mixed tocopherols.',
    surface: 'bg-[#EDEAF7]',
  },
];

const TRANSITION_STEPS = [
  { days: 'Days 1–2', ratio: '25% Catelicious · 75% Current Food', note: 'Introduce aroma gradually' },
  { days: 'Days 3–4', ratio: '50% Catelicious · 50% Current Food', note: 'Observe stool & appetite' },
  { days: 'Days 5–6', ratio: '75% Catelicious · 25% Current Food', note: 'Full energy & hydration' },
  { days: 'Day 7+', ratio: '100% Catelicious Daily Bowl', note: 'Ready for Core ₹600 pack' },
];

export const ValueComparisonSection: React.FC<ValueComparisonSectionProps> = ({
  onSelectTrialPack,
}) => {
  return (
    <>
      {/* Value Comparison Callout */}
      <section id="compare" className="py-14 sm:py-16 border-t border-[#E4DDD2] bg-[#F4EFE6]/60">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-medium text-[#525B56] mb-1.5">
              Why Catelicious Exists
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2421]">
              Clean Nutrition Without the Luxury Markup
            </h2>
            <p className="text-sm text-[#525B56] mt-2 leading-relaxed">
              Urban Indian cat parents shouldn&apos;t have to choose between low-cost grain
              fillers and ₹1,500+ imported bags. Here is how our mid-range ₹550–₹650 packs compare.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {VALUE_COMPARISON_COLUMNS.map((col) => (
              <div
                key={col.id}
                className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between border ${
                  col.isHighlighted
                    ? 'bg-[#E6F0EA] border-[#234F3E]/40 shadow-sm'
                    : 'bg-[#FBF9F5] border-[#E4DDD2]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#E4DDD2]">
                    <div>
                      <h3 className="font-display text-xl font-semibold text-[#1E2421]">
                        {col.tierName}
                      </h3>
                      <p className="text-xs text-[#525B56] mt-0.5">{col.subtitle}</p>
                    </div>
                    {col.isHighlighted && (
                      <span className="text-xs font-semibold text-[#234F3E] whitespace-nowrap">
                        Recommended
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-lg font-bold text-[#1E2421] tabular-nums">
                    {col.priceRange}
                  </p>

                  <dl className="mt-5 space-y-4">
                    {col.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dt className="text-xs font-medium text-[#525B56]">{metric.label}</dt>
                        <dd className="text-sm text-[#1E2421] mt-0.5 flex items-start gap-2">
                          {col.isHighlighted && (
                            <Check
                              className="w-4 h-4 text-[#234F3E] shrink-0 mt-0.5"
                              aria-hidden="true"
                            />
                          )}
                          <span>{metric.value}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {col.isHighlighted && (
                  <div className="mt-6 pt-4 border-t border-[#234F3E]/15">
                    <button
                      type="button"
                      onClick={onSelectTrialPack}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-[#234F3E] text-[#FBF9F5] hover:bg-[#193B2E] rounded-lg transition-colors"
                    >
                      <span>Test with ₹249 Trial Pack</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ingredients & 7-Day Trial Guide */}
      <section id="ingredients" className="py-14 sm:py-16 border-t border-[#E4DDD2]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 space-y-14">
          {/* Natural Ingredients Grid */}
          <div>
            <div className="max-w-2xl mb-8">
              <p className="text-xs font-medium text-[#525B56] mb-1.5">
                Ingredient Transparency
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#1E2421]">
                Formulated Around What Cats Actually Digest
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {INGREDIENT_PILLARS.map((pillar) => (
                <div
                  key={pillar.title}
                  className={`rounded-2xl p-6 border border-[#E4DDD2] ${pillar.surface}`}
                >
                  <h3 className="font-display text-lg font-semibold text-[#1E2421] mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-[#525B56] leading-relaxed">{pillar.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Trial Transition Guide */}
          <div
            id="trial-guide"
            className="rounded-2xl border border-[#E4DDD2] bg-[#F4EFE6] p-6 sm:p-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-medium text-[#525B56] mb-1">
                  First-Time Switcher Protocol
                </p>
                <h3 className="font-display text-2xl font-semibold text-[#1E2421]">
                  How Our 7-Day Trial Pack Works
                </h3>
              </div>
              <button
                type="button"
                onClick={onSelectTrialPack}
                className="self-start lg:self-auto px-4 py-2.5 text-xs font-semibold bg-[#234F3E] text-[#FBF9F5] hover:bg-[#193B2E] rounded-lg transition-colors whitespace-nowrap"
              >
                Add Trial Pack (₹249)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TRANSITION_STEPS.map((step) => (
                <div
                  key={step.days}
                  className="rounded-xl bg-[#FBF9F5] border border-[#E4DDD2] p-4"
                >
                  <p className="font-mono-sku text-xs font-medium text-[#9E5A47]">
                    {step.days}
                  </p>
                  <p className="text-sm font-semibold text-[#1E2421] mt-1">{step.ratio}</p>
                  <p className="text-xs text-[#525B56] mt-1">{step.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
