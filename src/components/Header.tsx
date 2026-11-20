import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { AuthUser, UserPreferences } from '../types';

interface HeaderProps {
  cartCount: number;
  user: AuthUser | null;
  preferences: UserPreferences;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  user,
  preferences,
  onOpenCart,
  onOpenAuth,
  onSignOut,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F5]/95 backdrop-blur-sm border-b border-[#E4DDD2]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="font-display text-2xl font-semibold tracking-tight text-[#1E2421] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#234F3E] rounded"
        >
          Catelicious
        </a>

        {/* Zone 2: 4 single-line nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#525B56]"
        >
          <a
            href="#collection"
            className="hover:text-[#1E2421] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Collection
          </a>
          <a
            href="#compare"
            className="hover:text-[#1E2421] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Compare
          </a>
          <a
            href="#ingredients"
            className="hover:text-[#1E2421] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Ingredients
          </a>
          <a
            href="#trial-guide"
            className="hover:text-[#1E2421] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Trial Guide
          </a>
        </nav>

        {/* Zone 3: Account trigger + Primary Bag action */}
        <div className="flex items-center gap-3 shrink-0 relative">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#1E2421] bg-[#F4EFE6] hover:bg-[#EDE6DA] border border-[#E4DDD2] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
                aria-expanded={menuOpen}
                aria-label="Open account menu"
              >
                {user.photoURL && !avatarFailed ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarFailed(true)}
                    className="w-6 h-6 rounded-full object-cover shrink-0 border border-[#E4DDD2]"
                  />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-[#EDEAF7] text-[#1E2421] font-semibold flex items-center justify-center text-[11px] shrink-0">
                    {user.photoInitials}
                  </span>
                )}
                <span className="hidden sm:inline max-w-[110px] truncate">
                  {user.displayName.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#525B56]" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#FBF9F5] border border-[#E4DDD2] shadow-lg p-4 z-20 text-left">
                    <p className="text-sm font-semibold text-[#1E2421] truncate">
                      {user.displayName}
                    </p>
                    <p className="text-xs text-[#525B56] truncate mt-0.5">{user.email}</p>
                    <p className="text-xs text-[#6E7772] mt-2 pt-2 border-t border-[#E4DDD2]">
                      Google Account · Cat:{' '}
                      <span className="font-medium text-[#1E2421]">{preferences.catName}</span>
                    </p>
                    <div className="mt-3 flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onOpenAuth();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-[#1E2421] hover:bg-[#F4EFE6] rounded-lg transition-colors"
                      >
                        Edit Cat Preferences
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onSignOut();
                        }}
                        className="w-full inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#9E5A47] hover:bg-[#F9EAE4] rounded-lg transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1E2421] hover:bg-[#F4EFE6] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            >
              <UserIcon className="w-4 h-4 text-[#525B56]" />
              <span>Sign In</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#FBF9F5] bg-[#234F3E] hover:bg-[#193B2E] rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
            aria-label={`Open shopping bag with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bag</span>
            <span className="tabular-nums">({cartCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
