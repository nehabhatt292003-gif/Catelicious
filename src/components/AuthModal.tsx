import React, { useEffect, useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { AuthUser, UserPreferences } from '../types';
import {
  fetchOrdersFromFirestore,
  signInWithGoogleLive,
  StoredOrderSummary,
} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  user: AuthUser | null;
  preferences: UserPreferences;
  onClose: () => void;
  onAuthenticated: (user: AuthUser) => void;
  onUpdatePreferences: (prefs: UserPreferences) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  user,
  preferences,
  onClose,
  onAuthenticated,
  onUpdatePreferences,
}) => {
  const [catName, setCatName] = useState(preferences.catName);
  const [lifeStage, setLifeStage] = useState<UserPreferences['lifeStage']>(preferences.lifeStage);
  const [priorityGoal, setPriorityGoal] = useState<UserPreferences['priorityGoal']>(
    preferences.priorityGoal
  );
  const [orders, setOrders] = useState<StoredOrderSummary[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCatName(preferences.catName);
    setLifeStage(preferences.lifeStage);
    setPriorityGoal(preferences.priorityGoal);
  }, [preferences, isOpen]);

  useEffect(() => {
    if (!isOpen || !user) {
      setOrders([]);
      return;
    }
    let cancelled = false;
    setLoadingOrders(true);
    fetchOrdersFromFirestore(user.uid)
      .then((list) => {
        if (!cancelled) setOrders(list);
      })
      .catch((err) => {
        console.error('Failed to load saved orders:', err);
      })
      .finally(() => {
        if (!cancelled) setLoadingOrders(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const authedUser = await signInWithGoogleLive();
      onAuthenticated(authedUser);
      onClose();
    } catch (err) {
      const rawMsg = err instanceof Error ? err.message : 'Google Sign-In could not be completed.';
      if (rawMsg.includes('popup-closed-by-user')) {
        setErrorMsg('Sign-in popup was closed before completing Google authentication.');
      } else if (rawMsg.includes('popup-blocked')) {
        setErrorMsg('Popup was blocked by your browser. Please allow popups for this site and try again.');
      } else if (rawMsg.includes('unauthorized-domain')) {
        setErrorMsg(
          `This domain (${window.location.hostname}) needs to be listed under Authorized Domains in Firebase Authentication.`
        );
      } else {
        setErrorMsg(rawMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePrefsOnly = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePreferences({
      catName: catName.trim() || 'Miso',
      lifeStage,
      priorityGoal,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E2421]/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-[#FBF9F5] border border-[#E4DDD2] shadow-2xl p-6 sm:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-lg border border-[#E4DDD2] flex items-center justify-center text-[#1E2421] hover:bg-[#F4EFE6] transition-colors"
          aria-label="Close sign in dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {user ? (
          <div className="space-y-6">
            <form onSubmit={handleSavePrefsOnly} className="space-y-4">
              <div>
                <p className="text-xs font-medium text-[#525B56] mb-1">
                  Verified Google Account
                </p>
                <h2 id="auth-modal-title" className="font-display text-2xl font-semibold text-[#1E2421]">
                  Cat Nutrition Profile
                </h2>
                <p className="text-xs text-[#525B56] mt-1">
                  Signed in as <span className="font-medium text-[#1E2421]">{user.displayName}</span>.
                  Your bag, order history, and cat preferences sync with Firebase.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-[#1E2421] mb-1">
                    Your Cat&apos;s Name
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="w-full rounded-lg border border-[#E4DDD2] bg-[#FBF9F5] px-3.5 py-2.5 text-sm text-[#1E2421] focus:outline-none focus:ring-2 focus:ring-[#234F3E]"
                    placeholder="e.g. Miso"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1E2421] mb-1">
                    Life Stage
                  </label>
                  <select
                    value={lifeStage}
                    onChange={(e) => setLifeStage(e.target.value as UserPreferences['lifeStage'])}
                    className="w-full rounded-lg border border-[#E4DDD2] bg-[#FBF9F5] px-3.5 py-2.5 text-sm text-[#1E2421] focus:outline-none focus:ring-2 focus:ring-[#234F3E]"
                  >
                    <option value="Kitten (3–12m)">Kitten (3–12m)</option>
                    <option value="Indoor Adult">Indoor Adult</option>
                    <option value="Senior (7+ yrs)">Senior (7+ yrs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1E2421] mb-1">
                    Primary Nutrition Focus
                  </label>
                  <select
                    value={priorityGoal}
                    onChange={(e) =>
                      setPriorityGoal(e.target.value as UserPreferences['priorityGoal'])
                    }
                    className="w-full rounded-lg border border-[#E4DDD2] bg-[#FBF9F5] px-3.5 py-2.5 text-sm text-[#1E2421] focus:outline-none focus:ring-2 focus:ring-[#234F3E]"
                  >
                    <option value="Natural Ingredients">Natural Ingredients</option>
                    <option value="Gentle Digestion">Gentle Digestion</option>
                    <option value="Fair Daily Value">Fair Daily Value</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-[#234F3E] text-[#FBF9F5] text-sm font-semibold hover:bg-[#193B2E] transition-colors"
              >
                Save Cat Profile
              </button>
            </form>

            {/* Saved Firestore Orders */}
            <div className="pt-4 border-t border-[#E4DDD2]">
              <h3 className="text-xs font-semibold text-[#1E2421] mb-2">
                Recent Orders
              </h3>
              {loadingOrders ? (
                <p className="text-xs text-[#525B56]">Loading your saved orders...</p>
              ) : orders.length === 0 ? (
                <p className="text-xs text-[#525B56]">
                  No orders placed yet under this account.
                </p>
              ) : (
                <ul className="space-y-2">
                  {orders.map((order) => (
                    <li
                      key={order.orderId}
                      className="rounded-lg bg-[#F4EFE6] border border-[#E4DDD2] p-3 text-xs flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="font-mono-sku font-medium text-[#1E2421]">
                          {order.orderId}
                        </p>
                        <p className="text-[#525B56] truncate">
                          {order.itemsSummary} · {order.city}
                        </p>
                      </div>
                      <span className="font-bold tabular-nums text-[#1E2421] shrink-0">
                        ₹{order.totalInr}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <p className="text-xs font-medium text-[#525B56] mb-1">
                Catelicious Account
              </p>
              <h2 id="auth-modal-title" className="font-display text-2xl font-semibold text-[#1E2421]">
                Sign In with Google
              </h2>
              <p className="text-xs text-[#525B56] mt-1 leading-relaxed">
                Authenticate securely with Firebase Google Sign-In to save your shopping bag,
                order confirmations, and your cat&apos;s feeding profile.
              </p>
            </div>

            {errorMsg && (
              <div className="rounded-lg bg-[#F9EAE4] border border-[#9E5A47]/30 px-3.5 py-2.5 text-xs text-[#1E2421]">
                {errorMsg}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-[#234F3E] text-[#FBF9F5] text-sm font-semibold hover:bg-[#193B2E] disabled:opacity-60 transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-[#FBF9F5] text-[#1E2421] flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                  />
                </svg>
              </span>
              <span>{isLoading ? 'Signing in with Google...' : 'Continue with Google'}</span>
            </button>

            <div className="rounded-xl bg-[#E6F0EA]/70 border border-[#E4DDD2] p-3.5 flex items-start gap-2.5 text-xs text-[#525B56]">
              <ShieldCheck className="w-4 h-4 text-[#234F3E] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                Powered by Firebase Authentication &amp; Cloud Firestore. Your bag and cat
                preferences remain private to your account.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
