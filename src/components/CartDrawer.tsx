import React, { useState } from 'react';
import { X, Minus, Plus, Trash2, CheckCircle2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { AuthUser, CartItem, MockOrder, Product } from '../types';
import { FREE_DELIVERY_THRESHOLD_INR, STANDARD_DELIVERY_FEE_INR } from '../data/catalog';
import { PackArtwork } from './PackArtwork';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  products: Product[];
  user: AuthUser | null;
  onClose: () => void;
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onAddTrialPack: () => void;
  onClearCart: () => void;
  onOpenAuth?: () => void;
  onOrderConfirmed?: (order: MockOrder) => Promise<void> | void;
}

const URBAN_CITIES = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai'];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  products,
  user,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onAddTrialPack,
  onClearCart,
  onOpenAuth,
  onOrderConfirmed,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash on Delivery'>('UPI');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<MockOrder | null>(null);

  if (!isOpen) return null;

  const resolvedItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((entry): entry is { productId: string; quantity: number; product: Product } =>
      Boolean(entry)
    );

  const subtotalInr = resolvedItems.reduce(
    (sum, entry) => sum + entry.product.priceInr * entry.quantity,
    0
  );
  const qualifiesFreeDelivery = subtotalInr >= FREE_DELIVERY_THRESHOLD_INR || subtotalInr === 0;
  const deliveryFeeInr = qualifiesFreeDelivery ? 0 : STANDARD_DELIVERY_FEE_INR;
  const totalInr = subtotalInr + deliveryFeeInr;
  const amountToFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD_INR - subtotalInr);

  const hasTrialPack = resolvedItems.some((entry) => entry.product.packType === 'Trial Pack');
  const hasDailyPack = resolvedItems.some((entry) => entry.product.packType === 'Daily Pack');
  const showTrialPrompt = hasDailyPack && !hasTrialPack;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const trimmedName = (customerName || user?.displayName || '').trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName || trimmedPhone.length < 10 || !trimmedAddress) {
      setFormError('Please enter your full name, 10-digit mobile number, and urban delivery address.');
      return;
    }

    const orderNumber = `CAT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const order: MockOrder = {
      orderId: orderNumber,
      customerName: trimmedName,
      phone: trimmedPhone,
      city,
      address: trimmedAddress,
      paymentMethod,
      items: resolvedItems.map((entry) => ({
        sku: entry.product.sku,
        name: entry.product.name,
        weightLabel: entry.product.weightLabel,
        quantity: entry.quantity,
        unitPriceInr: entry.product.priceInr,
      })),
      subtotalInr,
      deliveryFeeInr,
      totalInr,
      placedAtIso: new Date().toISOString(),
    };

    if (onOrderConfirmed) {
      await onOrderConfirmed(order);
    }
    setConfirmedOrder(order);
    onClearCart();
    setStep('confirmed');
  };

  const handleCloseDrawer = () => {
    if (step === 'confirmed') {
      setStep('cart');
      setConfirmedOrder(null);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1E2421]/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag and checkout"
    >
      <div className="fixed inset-0" onClick={handleCloseDrawer} aria-hidden="true" />

      <aside className="relative z-10 w-full max-w-md h-full bg-[#FBF9F5] border-l border-[#E4DDD2] shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-[#E4DDD2] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="p-1.5 rounded-lg hover:bg-[#F4EFE6] text-[#1E2421] transition-colors"
                aria-label="Back to bag"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="font-display text-xl font-semibold text-[#1E2421]">
              {step === 'cart' && 'Your Catelicious Bag'}
              {step === 'checkout' && 'Simulated Urban Checkout'}
              {step === 'confirmed' && 'Order Confirmed'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCloseDrawer}
            className="w-9 h-9 rounded-lg border border-[#E4DDD2] flex items-center justify-center text-[#1E2421] hover:bg-[#F4EFE6] transition-colors"
            aria-label="Close bag"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {step === 'confirmed' && confirmedOrder ? (
            <div className="space-y-5">
              <div className="rounded-2xl bg-[#E6F0EA] border border-[#234F3E]/25 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#234F3E] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-mono-sku text-xs font-semibold text-[#234F3E]">
                      {confirmedOrder.orderId}
                    </p>
                    <h3 className="font-display text-lg font-semibold text-[#1E2421] mt-0.5">
                      Simulated Order Placed
                    </h3>
                    <p className="text-xs text-[#525B56] mt-1">
                      Prototype confirmation only — no real payment was charged. Dispatching to{' '}
                      <span className="font-medium text-[#1E2421]">{confirmedOrder.city}</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#E4DDD2] bg-[#F4EFE6]/60 p-4 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#525B56]">Recipient</span>
                  <span className="font-medium text-[#1E2421]">{confirmedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#525B56]">Payment Mode</span>
                  <span className="font-medium text-[#1E2421]">{confirmedOrder.paymentMethod}</span>
                </div>
                <div className="pt-2 border-t border-[#E4DDD2] space-y-1.5">
                  {confirmedOrder.items.map((line) => (
                    <div key={line.sku} className="flex justify-between">
                      <span className="text-[#1E2421]">
                        {line.name} ({line.weightLabel}) × {line.quantity}
                      </span>
                      <span className="font-medium tabular-nums text-[#1E2421]">
                        ₹{line.unitPriceInr * line.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#E4DDD2] flex justify-between text-sm font-bold text-[#1E2421]">
                  <span>Total</span>
                  <span className="tabular-nums">₹{confirmedOrder.totalInr}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep('cart');
                  setConfirmedOrder(null);
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-lg bg-[#234F3E] text-[#FBF9F5] text-sm font-semibold hover:bg-[#193B2E] transition-colors"
              >
                Continue Browsing Collection
              </button>
            </div>
          ) : resolvedItems.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F4EFE6] border border-[#E4DDD2] mx-auto flex items-center justify-center text-[#525B56]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-[#1E2421]">
                  Your bag is empty
                </p>
                <p className="text-xs text-[#525B56] mt-1 max-w-xs mx-auto">
                  Start with our ₹249 First-Taste Trial Pack or pick the flagship ₹600 Core Daily
                  Pack.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onAddTrialPack();
                }}
                className="px-4 py-2.5 rounded-lg bg-[#234F3E] text-[#FBF9F5] text-xs font-semibold hover:bg-[#193B2E] transition-colors"
              >
                Add ₹249 Trial Pack
              </button>
            </div>
          ) : step === 'cart' ? (
            <>
              {/* Free Delivery Threshold Banner */}
              <div className="rounded-xl bg-[#F4EFE6] border border-[#E4DDD2] p-3.5 text-xs">
                {qualifiesFreeDelivery ? (
                  <p className="font-medium text-[#234F3E]">
                    Free urban delivery unlocked on your order.
                  </p>
                ) : (
                  <p className="text-[#1E2421]">
                    Add <span className="font-semibold tabular-nums">₹{amountToFreeDelivery}</span>{' '}
                    more for free urban delivery (orders ₹{FREE_DELIVERY_THRESHOLD_INR}+).
                  </p>
                )}
              </div>

              {/* Cart Items */}
              <ul className="divide-y divide-[#E4DDD2]">
                {resolvedItems.map(({ product, quantity }) => (
                  <li key={product.id} className="py-4 flex gap-3.5">
                    <div className="w-20 h-20 rounded-xl border border-[#E4DDD2] overflow-hidden shrink-0">
                      <PackArtwork
                        sku={product.sku}
                        name={product.name}
                        weightLabel={product.weightLabel}
                        pastelTone={product.pastelTone}
                        packType={product.packType}
                        imageUrl={product.imageUrl}
                        compact
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-[#1E2421] truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-[#525B56]">
                            {product.weightLabel} · <span className="font-mono-sku">{product.sku}</span>
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(product.id)}
                          className="p-1 text-[#6E7772] hover:text-[#9E5A47] transition-colors"
                          aria-label={`Remove ${product.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-[#E4DDD2] rounded-lg bg-[#F4EFE6]">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(product.id, -1)}
                            className="w-8 h-8 flex items-center justify-center text-[#1E2421] hover:bg-[#E4DDD2]/50 rounded-l-lg"
                            aria-label={`Decrease quantity of ${product.name}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold tabular-nums text-[#1E2421]">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(product.id, 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#1E2421] hover:bg-[#E4DDD2]/50 rounded-r-lg"
                            aria-label={`Increase quantity of ${product.name}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-sm font-bold text-[#1E2421] tabular-nums">
                          ₹{product.priceInr * quantity}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Trial-Pack Prompt for First-Time Buyers */}
              {showTrialPrompt && (
                <div className="rounded-xl bg-[#F9EAE4] border border-[#9E5A47]/25 p-4 space-y-2.5">
                  <p className="text-xs font-semibold text-[#1E2421]">
                    First time trying Catelicious?
                  </p>
                  <p className="text-xs text-[#525B56] leading-relaxed">
                    Add our low-commitment 300g Trial Pack (₹249) so your cat can test acceptance
                    before opening the 1 kg pack.
                  </p>
                  <button
                    type="button"
                    onClick={onAddTrialPack}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1E2421] text-[#FBF9F5] text-xs font-semibold hover:bg-[#234F3E] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Trial Pack · ₹249</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Step 2: Simulated Urban Checkout Form */
            <form id="mock-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              {!user && onOpenAuth && (
                <div className="rounded-xl bg-[#E6F0EA] border border-[#234F3E]/20 p-3.5 flex items-center justify-between gap-3">
                  <p className="text-xs text-[#1E2421]">
                    Sign in with Google to save this order to your profile.
                  </p>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="px-3 py-1.5 rounded-lg bg-[#234F3E] text-[#FBF9F5] text-xs font-semibold whitespace-nowrap shrink-0 hover:bg-[#193B2E] transition-colors"
                  >
                    Google Sign In
                  </button>
                </div>
              )}

              {formError && (
                <div className="rounded-lg bg-[#F9EAE4] border border-[#9E5A47]/30 p-3 text-xs text-[#1E2421]">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-[#1E2421] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName || user?.displayName || ''}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Rohan Mehta"
                  className="w-full rounded-lg border border-[#E4DDD2] bg-[#FBF9F5] px-3.5 py-2.5 text-sm text-[#1E2421] focus:outline-none focus:ring-2 focus:ring-[#234F3E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#1E2421] mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full rounded-lg border border-[#E4DDD2] bg-[#FBF9F5] px-3.5 py-2.5 text-sm text-[#1E2421] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#234F3E]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#1E2421] mb-1">
                    Metro City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-lg border border-[#E4DDD2] bg-[#FBF9F5] px-3.5 py-2.5 text-sm text-[#1E2421] focus:outline-none focus:ring-2 focus:ring-[#234F3E]"
                  >
                    {URBAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1E2421] mb-1">
                  Apartment / Street Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat 402, Indiranagar 100ft Road"
                  className="w-full rounded-lg border border-[#E4DDD2] bg-[#FBF9F5] px-3.5 py-2.5 text-sm text-[#1E2421] focus:outline-none focus:ring-2 focus:ring-[#234F3E]"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-[#1E2421] mb-2">
                  Simulated Payment Preference
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['UPI', 'Cash on Delivery'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-semibold transition-colors ${
                        paymentMethod === method
                          ? 'bg-[#E6F0EA] border-[#234F3E] text-[#1E2421]'
                          : 'bg-[#FBF9F5] border-[#E4DDD2] text-[#525B56]'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer Totals & Action */}
        {resolvedItems.length > 0 && step !== 'confirmed' && (
          <div className="px-6 py-5 border-t border-[#E4DDD2] bg-[#F4EFE6]/70 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#525B56]">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-[#1E2421]">₹{subtotalInr}</span>
              </div>
              <div className="flex justify-between text-[#525B56]">
                <span>Urban Delivery</span>
                <span className="tabular-nums font-medium text-[#1E2421]">
                  {deliveryFeeInr === 0 ? 'Free' : `₹${deliveryFeeInr}`}
                </span>
              </div>
              <div className="pt-2 border-t border-[#E4DDD2] flex justify-between text-sm font-bold text-[#1E2421]">
                <span>Total</span>
                <span className="tabular-nums">₹{totalInr}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 px-4 rounded-lg bg-[#234F3E] text-[#FBF9F5] text-sm font-semibold hover:bg-[#193B2E] transition-colors"
              >
                Proceed to Mock Checkout · ₹{totalInr}
              </button>
            ) : (
              <button
                type="submit"
                form="mock-checkout-form"
                className="w-full py-3 px-4 rounded-lg bg-[#234F3E] text-[#FBF9F5] text-sm font-semibold hover:bg-[#193B2E] transition-colors"
              >
                Place Simulated Order · ₹{totalInr}
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
};
