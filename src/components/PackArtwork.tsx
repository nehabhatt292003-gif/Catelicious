import React, { useState } from 'react';
import { PastelTone } from '../types';
import { HERO_IMAGE_URL } from '../data/catalog';

interface PackArtworkProps {
  sku: string;
  name?: string;
  weightLabel: string;
  pastelTone: PastelTone;
  packType: 'Trial Pack' | 'Daily Pack';
  imageUrl?: string;
  compact?: boolean;
}

const BACKDROP_MAP: Record<PastelTone, string> = {
  peach: '#F9EAE4',
  butter: '#FBF3DF',
  sage: '#E6F0EA',
  lavender: '#EDEAF7',
};

export const PackArtwork: React.FC<PackArtworkProps> = ({
  sku,
  name,
  weightLabel,
  pastelTone,
  imageUrl,
  compact = false,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const backdrop = BACKDROP_MAP[pastelTone];

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
      style={{ backgroundColor: backdrop }}
    >
      {imageUrl && !imgFailed ? (
        <img
          src={imageUrl}
          alt={`${name || sku} (${weightLabel}) natural cat food pouch`}
          referrerPolicy="no-referrer"
          loading={compact ? 'lazy' : 'eager'}
          onError={() => setImgFailed(true)}
          className={`w-full h-full object-cover ${
            compact ? '' : 'transition-transform duration-300 group-hover:scale-[1.03]'
          }`}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
          <span className="font-display text-sm font-semibold text-[#1E2421]">
            {name || 'Catelicious'}
          </span>
          <span className="font-mono-sku text-xs text-[#525B56] mt-1">
            {sku} · {weightLabel}
          </span>
        </div>
      )}
    </div>
  );
};

export const HeroEditorialVisual: React.FC = () => {
  const [heroFailed, setHeroFailed] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[340px] lg:min-h-[430px] rounded-2xl border border-[#E4DDD2] bg-[#E6F0EA] overflow-hidden flex items-center justify-center">
      {!heroFailed ? (
        <img
          src={HERO_IMAGE_URL}
          alt="Healthy tabby cat beside a ceramic bowl of Catelicious natural kibble, fresh pumpkin, and a matte sage pouch"
          referrerPolicy="no-referrer"
          onError={() => setHeroFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="p-8 text-center">
          <p className="font-display text-2xl font-semibold text-[#1E2421]">Catelicious</p>
          <p className="text-sm text-[#525B56] mt-1">
            Healthy, naturally sourced daily nutrition for urban cats
          </p>
        </div>
      )}
    </div>
  );
};
