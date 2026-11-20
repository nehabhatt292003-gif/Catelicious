# Catelicious Firestore Security Specification

## 1. Data Invariants
1. User documents (`/users/{userId}`) may only be read or modified by the verified owner (`request.auth.uid == userId` and `request.auth.token.email_verified == true`).
2. Every `CartLine` (`/users/{userId}/cart/{productId}`) and `OrderRecord` (`/users/{userId}/orders/{orderId}`) must store `userId == request.auth.uid` matching the parent `{userId}` path and valid alphanumeric/hyphen IDs (`^[a-zA-Z0-9_\-]+$`, max 128 chars).
3. Server timestamps (`request.time`) are strictly enforced on `createdAt` (create) and `updatedAt` (create & update); `uid`, `userId`, and `createdAt` are immutable once written.
4. `OrderRecord` documents are append-only receipts; client updates and deletes are rejected.
5. No blanket `isSignedIn()` reads or unbounded list queries exist; every `list` rule enforces `resource.data.userId == request.auth.uid`.

## 2. Dirty Dozen Attack Payloads (All Must Return PERMISSION_DENIED)
1. **Cross-user profile read**: User A calls `get(/users/userB)` -> DENIED (`isOwner(userId)` fails).
2. **Unverified email write**: User with `email_verified: false` creates `/users/{uid}` -> DENIED (`isVerified()` fails).
3. **Privilege / shadow field injection**: Create `/users/{uid}` with extra field `isAdmin: true` -> DENIED (`hasOnly(...)` fails).
4. **UID spoofing on profile create**: User A creates `/users/userA` with `uid: "userB"` -> DENIED (`data.uid == userId`).
5. **Client timestamp forgery**: Create `/users/{uid}` with `createdAt: "2020-01-01"` -> DENIED (`data.createdAt == request.time`).
6. **Immutable UID mutation**: Update `/users/{uid}` changing `uid` -> DENIED (`affectedKeys().hasOnly(...)` excludes `uid`).
7. **Oversized string DoW attack**: Update `/users/{uid}` with `catName` of 5,000 chars -> DENIED (`catName.size() <= 60`).
8. **Invalid lifeStage enum**: Update `/users/{uid}` with `lifeStage: "Dragon"` -> DENIED (enum check fails).
9. **Path ID poisoning**: Write cart item at `/users/{uid}/cart/bad$id!@#` -> DENIED (`isValidId(productId)` fails).
10. **Negative / excessive cart quantity**: Create cart line with `quantity: 0` or `quantity: 999` -> DENIED (`quantity >= 1 && quantity <= 20`).
11. **Order tampering after placement**: User updates `/users/{uid}/orders/{orderId}` to change `totalInr: 1` -> DENIED (`allow update, delete: if false`).
12. **Unauthenticated order list**: Anonymous request lists `/users/{uid}/orders` -> DENIED (`isVerified()` & `resource.data.userId == request.auth.uid`).
