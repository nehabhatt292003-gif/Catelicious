import React, { Component, ErrorInfo, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { CATALOG_PRODUCTS } from './data/catalog';
import {
  AuthUser,
  CartItem,
  CatNeed,
  MockOrder,
  PackType,
  Product,
  SortOption,
  UserPreferences,
} from './types';
import {
  DEFAULT_PREFERENCES,
  ensureUserAccountDoc,
  fetchCartFromFirestore,
  loadSavedCart,
  saveCartForScope,
  saveOrderToFirestore,
  saveUserPreferences,
  saveUserPreferencesToFirestore,
  signOutAccount,
  subscribeAuthState,
  syncCartItemsToFirestore,
} from './lib/firebase';
import { Header } from './components/Header';
import { HeroEditorialVisual } from './components/PackArtwork';
import { CollectionSection } from './components/CollectionSection';
import { ValueComparisonSection } from './components/ValueComparisonSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';

class StorefrontErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Storefront ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5] p-6">
          <div className="max-w-md rounded-2xl border border-[#E4DDD2] bg-[#F4EFE6] p-6 text-center space-y-3">
            <h1 className="font-display text-xl font-semibold text-[#1E2421]">
              Something went wrong
            </h1>
            <p className="text-xs text-[#525B56]">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-[#234F3E] text-[#FBF9F5] text-xs font-semibold"
            >
              Reload Storefront
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function StorefrontContent() {
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Auth & persisted preferences
  const [user, setUser] = useState<AuthUser | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => loadSavedCart('guest'));
  const isHydratingRef = useRef(false);

  // Collection filters & sort
  const [packFilter, setPackFilter] = useState<'All' | PackType>('All');
  const [needFilter, setNeedFilter] = useState<CatNeed>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Overlays
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (authedUser) => {
      setUser(authedUser);
      if (authedUser) {
        isHydratingRef.current = true;
        try {
          const loadedPrefs = await ensureUserAccountDoc(authedUser, DEFAULT_PREFERENCES);
          setPreferences(loadedPrefs);
          saveUserPreferences(authedUser.uid, loadedPrefs);

          const remoteCart = await fetchCartFromFirestore(authedUser.uid);
          if (remoteCart.length > 0) {
            setCartItems(remoteCart);
            saveCartForScope(authedUser.uid, remoteCart);
          } else {
            const guestCart = loadSavedCart('guest');
            if (guestCart.length > 0) {
              setCartItems(guestCart);
              await syncCartItemsToFirestore(authedUser.uid, guestCart);
            }
          }
        } catch (err) {
          console.error('Failed to sync Firebase user state:', err);
        } finally {
          isHydratingRef.current = false;
        }
      } else {
        setCartItems(loadSavedCart('guest'));
        setPreferences(DEFAULT_PREFERENCES);
      }
    });
    return unsubscribe;
  }, []);

  // Persist cart automatically to localStorage and Firestore when authenticated
  useEffect(() => {
    const scope = user?.uid || 'guest';
    saveCartForScope(scope, cartItems);
    if (user && !isHydratingRef.current) {
      syncCartItemsToFirestore(user.uid, cartItems).catch((err) => {
        console.error('Failed to sync cart to Firestore:', err);
      });
    }
  }, [cartItems, user]);

  const handleAuthenticated = async (authedUser: AuthUser) => {
    setUser(authedUser);
  };

  const handleUpdatePreferences = async (nextPrefs: UserPreferences) => {
    setPreferences(nextPrefs);
    if (user) {
      saveUserPreferences(user.uid, nextPrefs);
      try {
        await saveUserPreferencesToFirestore(user, nextPrefs);
      } catch (err) {
        console.error('Failed to save cat preferences to Firestore:', err);
      }
    }
  };

  const handleSignOut = async () => {
    await signOutAccount();
    setUser(null);
    setPreferences(DEFAULT_PREFERENCES);
    setCartItems(loadSavedCart('guest'));
  };

  const handleOrderConfirmed = async (order: MockOrder) => {
    if (user) {
      try {
        await saveOrderToFirestore(user.uid, order);
      } catch (err) {
        console.error('Failed to save order to Firestore:', err);
      }
    }
  };

  const addToCart = (product: Product, openDrawer = false) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(20, item.quantity + 1) }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity: 1 }];
    });
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.min(20, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const trialProduct = CATALOG_PRODUCTS[0];
  const coreProduct = CATALOG_PRODUCTS[2];

  const filteredProducts = useMemo(() => {
    const filtered = CATALOG_PRODUCTS.filter((p) => {
      const matchesPack = packFilter === 'All' || p.packType === packFilter;
      const matchesNeed = needFilter === 'All' || p.needTags.includes(needFilter);
      return matchesPack && matchesNeed;
    });

    if (sortBy === 'price-asc') {
      return [...filtered].sort((a, b) => a.priceInr - b.priceInr);
    }
    if (sortBy === 'price-desc') {
      return [...filtered].sort((a, b) => b.priceInr - a.priceInr);
    }
    return filtered;
  }, [packFilter, needFilter, sortBy]);

  const totalBagCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#1E2421]">
      {/* Slim Dismissible Announcement Strip */}
      {!bannerDismissed && (
        <div className="bg-[#234F3E] text-[#FBF9F5] text-xs py-2 px-4 flex items-center justify-center relative">
          <p className="text-center pr-6 truncate">
            Free urban delivery on orders ₹599+ · Test acceptance risk-free with our ₹249 Trial Pack
          </p>
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            className="absolute right-3 p-1 text-[#FBF9F5]/80 hover:text-[#FBF9F5] transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <Header
        cartCount={totalBagCount}
        user={user}
        preferences={preferences}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={handleSignOut}
      />

      <main className="flex-1">
        {/* Storefront Collection Hero */}
        <section className="py-10 sm:py-14">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="text-xs text-[#525B56] mb-6 flex items-center gap-2">
              <a href="#top" className="hover:text-[#1E2421]">
                Home
              </a>
              <span aria-hidden="true">/</span>
              <span className="text-[#1E2421] font-medium">Cat Food Collection</span>
              {user && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#234F3E] font-medium">
                    Tailored for {preferences.catName} ({preferences.lifeStage})
                  </span>
                </>
              )}
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center">
                <p className="text-xs font-medium text-[#9E5A47] mb-3">
                  Naturally Sourced · Urban India · ₹550–₹650 Daily Range
                </p>
                <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#1E2421] leading-[1.12] tracking-tight">
                  Healthy Cat Food Without the Luxury Price Tag.
                </h1>
                <p className="mt-4 text-base text-[#525B56] leading-relaxed max-w-xl">
                  Crafted for health-conscious urban cat parents who check every ingredient label.
                  68%+ real deboned chicken and pumpkin, zero artificial fillers, priced fairly at
                  ₹600 for your everyday 1 kg pack.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => addToCart(coreProduct, true)}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-[#234F3E] text-[#FBF9F5] hover:bg-[#193B2E] rounded-lg transition-colors whitespace-nowrap"
                  >
                    <span>Shop Core Pack — ₹600</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => addToCart(trialProduct, true)}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-[#F9EAE4] text-[#1E2421] border border-[#9E5A47]/25 hover:bg-[#F3DDD4] rounded-lg transition-colors whitespace-nowrap"
                  >
                    <span>Try 7-Day Trial Pack — ₹249</span>
                  </button>
                </div>

                <dl className="mt-9 pt-6 border-t border-[#E4DDD2] grid grid-cols-3 gap-4 max-w-lg">
                  <div>
                    <dt className="text-xs text-[#525B56]">Animal Protein</dt>
                    <dd className="text-base font-bold text-[#1E2421] tabular-nums mt-0.5">
                      68%+ Real Meat
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#525B56]">Daily Feeding</dt>
                    <dd className="text-base font-bold text-[#1E2421] tabular-nums mt-0.5">
                      ~₹27 / Day
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#525B56]">Fillers &amp; Dyes</dt>
                    <dd className="text-base font-bold text-[#1E2421] mt-0.5">0% Corn or Soy</dd>
                  </div>
                </dl>
              </div>

              <div className="lg:col-span-6">
                <HeroEditorialVisual />
              </div>
            </div>
          </div>
        </section>

        <CollectionSection
          products={filteredProducts}
          packFilter={packFilter}
          needFilter={needFilter}
          sortBy={sortBy}
          onChangePackFilter={setPackFilter}
          onChangeNeedFilter={setNeedFilter}
          onChangeSort={setSortBy}
          onAddToCart={(product) => addToCart(product, false)}
          onSelectProduct={(product) => setActiveProduct(product)}
        />

        <ValueComparisonSection onSelectTrialPack={() => addToCart(trialProduct, true)} />
      </main>

      <footer className="border-t border-[#E4DDD2] bg-[#F4EFE6] py-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="font-display text-lg font-semibold text-[#1E2421]">Catelicious</span>
            <p className="text-xs text-[#525B56] mt-1">
              Natural mid-range cat nutrition for urban Indian households.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-[#525B56]">
            <a href="#collection" className="hover:text-[#1E2421]">
              Collection
            </a>
            <a href="#compare" className="hover:text-[#1E2421]">
              Price Comparison
            </a>
            <a href="#ingredients" className="hover:text-[#1E2421]">
              Ingredients
            </a>
            <button
              type="button"
              onClick={() => setIsAuthOpen(true)}
              className="hover:text-[#1E2421]"
            >
              {user ? 'Cat Profile' : 'Sign In'}
            </button>
          </div>
        </div>
      </footer>

      <ProductDetailModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={(product) => addToCart(product, true)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        user={user}
        preferences={preferences}
        onClose={() => setIsAuthOpen(false)}
        onAuthenticated={handleAuthenticated}
        onUpdatePreferences={handleUpdatePreferences}
      />

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        products={CATALOG_PRODUCTS}
        user={user}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={updateCartQty}
        onRemoveItem={removeFromCart}
        onAddTrialPack={() => addToCart(trialProduct, false)}
        onClearCart={clearCart}
        onOrderConfirmed={handleOrderConfirmed}
      />
    </div>
  );
}

export default function App() {
  return (
    <StorefrontErrorBoundary>
      <StorefrontContent />
    </StorefrontErrorBoundary>
  );
}
