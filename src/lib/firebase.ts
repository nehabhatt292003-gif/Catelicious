import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  Auth,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { AuthUser, CartItem, MockOrder, UserPreferences } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function isFirebaseConfigured(): boolean {
  return (
    Boolean(firebaseConfig?.apiKey) &&
    !firebaseConfig.apiKey.startsWith('YOUR_') &&
    Boolean(firebaseConfig?.projectId) &&
    firebaseConfig.projectId !== 'remixed-project-id'
  );
}

const app: FirebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth: Auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
void testConnection();

const USER_CART_PREFIX = 'catelicious_cart_v1_';
const USER_PREFS_PREFIX = 'catelicious_prefs_v1_';

export const DEFAULT_PREFERENCES: UserPreferences = {
  catName: 'Miso',
  lifeStage: 'Indoor Adult',
  priorityGoal: 'Natural Ingredients',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return 'CP';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function mapFirebaseUser(user: User): AuthUser {
  const name = (user.displayName || 'Cat Parent').trim().slice(0, 100);
  return {
    uid: user.uid,
    displayName: name,
    email: (user.email || 'signed-in@catelicious.in').trim().slice(0, 160),
    photoInitials: getInitials(name),
    photoURL: user.photoURL || undefined,
    mode: 'firebase',
  };
}

export function subscribeAuthState(callback: (user: AuthUser | null) => void): () => void {
  return onAuthStateChanged(auth, (fbUser) => {
    callback(fbUser ? mapFirebaseUser(fbUser) : null);
  });
}

export async function signInWithGoogleLive(): Promise<AuthUser> {
  const result = await signInWithPopup(auth, googleProvider);
  return mapFirebaseUser(result.user);
}

export async function signOutAccount(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function ensureUserAccountDoc(
  user: AuthUser,
  fallbackPrefs: UserPreferences
): Promise<UserPreferences> {
  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      const loadedPrefs: UserPreferences = {
        catName: typeof data.catName === 'string' && data.catName ? data.catName : fallbackPrefs.catName,
        lifeStage: data.lifeStage || fallbackPrefs.lifeStage,
        priorityGoal: data.priorityGoal || fallbackPrefs.priorityGoal,
      };
      await updateDoc(ref, {
        displayName: user.displayName.slice(0, 100) || 'Cat Parent',
        email: user.email.slice(0, 160),
        updatedAt: serverTimestamp(),
      });
      return loadedPrefs;
    }

    await setDoc(ref, {
      uid: user.uid,
      displayName: user.displayName.slice(0, 100) || 'Cat Parent',
      email: user.email.slice(0, 160),
      catName: (fallbackPrefs.catName || 'Miso').slice(0, 60),
      lifeStage: fallbackPrefs.lifeStage,
      priorityGoal: fallbackPrefs.priorityGoal,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return fallbackPrefs;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveUserPreferencesToFirestore(
  user: AuthUser,
  prefs: UserPreferences
): Promise<void> {
  const path = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await ensureUserAccountDoc(user, prefs);
      return;
    }
    const existingData = snap.data();
    await setDoc(ref, {
      uid: user.uid,
      displayName: user.displayName.slice(0, 100) || 'Cat Parent',
      email: user.email.slice(0, 160),
      catName: (prefs.catName.trim() || 'Miso').slice(0, 60),
      lifeStage: prefs.lifeStage,
      priorityGoal: prefs.priorityGoal,
      createdAt: existingData.createdAt,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function fetchCartFromFirestore(uid: string): Promise<CartItem[]> {
  const path = `users/${uid}/cart`;
  try {
    const q = query(collection(db, 'users', uid, 'cart'), where('userId', '==', uid));
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map((d) => {
        const data = d.data();
        return {
          productId: String(data.productId || d.id),
          quantity: Math.min(20, Math.max(1, Number(data.quantity || 1))),
        };
      })
      .filter((item) => item.quantity > 0);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function syncCartItemsToFirestore(uid: string, items: CartItem[]): Promise<void> {
  const path = `users/${uid}/cart`;
  try {
    const q = query(collection(db, 'users', uid, 'cart'), where('userId', '==', uid));
    const existingSnap = await getDocs(q);
    const nextIds = new Set(items.map((item) => item.productId));

    // Delete removed lines
    await Promise.all(
      existingSnap.docs
        .filter((d) => !nextIds.has(d.id))
        .map((d) => deleteDoc(doc(db, 'users', uid, 'cart', d.id)))
    );

    // Upsert active lines
    await Promise.all(
      items.map((item) =>
        setDoc(doc(db, 'users', uid, 'cart', item.productId), {
          userId: uid,
          productId: item.productId.slice(0, 64),
          quantity: Math.min(20, Math.max(1, Math.round(item.quantity))),
          updatedAt: serverTimestamp(),
        })
      )
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveOrderToFirestore(uid: string, order: MockOrder): Promise<void> {
  const path = `users/${uid}/orders/${order.orderId}`;
  const summary = order.items
    .map((item) => `${item.sku}x${item.quantity}`)
    .join(', ')
    .slice(0, 500);
  try {
    await setDoc(doc(db, 'users', uid, 'orders', order.orderId), {
      orderId: order.orderId.slice(0, 64),
      userId: uid,
      customerName: order.customerName.trim().slice(0, 100) || 'Cat Parent',
      city: order.city.trim().slice(0, 60) || 'Bengaluru',
      paymentMethod: order.paymentMethod,
      subtotalInr: order.subtotalInr,
      deliveryFeeInr: order.deliveryFeeInr,
      totalInr: order.totalInr,
      itemsSummary: summary || 'Catelicious Pack',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export interface StoredOrderSummary {
  orderId: string;
  city: string;
  paymentMethod: string;
  totalInr: number;
  itemsSummary: string;
}

export async function fetchOrdersFromFirestore(uid: string): Promise<StoredOrderSummary[]> {
  const path = `users/${uid}/orders`;
  try {
    const q = query(collection(db, 'users', uid, 'orders'), where('userId', '==', uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        orderId: String(data.orderId || d.id),
        city: String(data.city || ''),
        paymentMethod: String(data.paymentMethod || 'UPI'),
        totalInr: Number(data.totalInr || 0),
        itemsSummary: String(data.itemsSummary || ''),
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function loadSavedCart(scopeId: string): CartItem[] {
  try {
    const raw = localStorage.getItem(`${USER_CART_PREFIX}${scopeId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartForScope(scopeId: string, items: CartItem[]): void {
  try {
    localStorage.setItem(`${USER_CART_PREFIX}${scopeId}`, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
}

export function loadUserPreferences(uid: string): UserPreferences {
  try {
    const raw = localStorage.getItem(`${USER_PREFS_PREFIX}${uid}`);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function saveUserPreferences(uid: string, prefs: UserPreferences): void {
  try {
    localStorage.setItem(`${USER_PREFS_PREFIX}${uid}`, JSON.stringify(prefs));
  } catch {
    // Ignore storage errors
  }
}
