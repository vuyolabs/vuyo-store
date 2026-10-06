# Vuyo Store

A premium fashion and lifestyle shopping app built with Expo and React Native. It runs on iOS, Android, and the web.

## Features

- **Onboarding** for first-time users
- **Home**: hero banner, featured collections, category grid, and product rails
- **Shop**: browse by category (Clothing, Shoes, Accessories, Bags, Watches, Lifestyle), with sort and filter sheets
- **Search** with popular search suggestions
- **Product details**: image gallery with pinch-to-zoom viewer, color and size selectors, size guide, ratings, and quick add
- **Wishlist** to save favourite pieces
- **Bag**: quantity stepper, free-delivery progress meter, and promo codes
- **Checkout flow**: delivery address, then payment (UPI, card, or cash on delivery), then review, then success
- **Orders**: order history and a status timeline (confirmed, packed, shipped, delivered)
- **Profile & account**: saved addresses, sizes, notifications, help, and about
- Cart, wishlist, orders, and preferences are saved on the device, so they survive app restarts
- Haptic feedback, skeleton loaders, toasts, and smooth animations

## Tech Stack

| Area        | Library                                                         |
| ----------- | --------------------------------------------------------------- |
| Framework   | Expo SDK 57, React Native 0.86, React 19                        |
| Navigation  | Expo Router (file-based, typed routes)                          |
| State       | Zustand + AsyncStorage persistence                              |
| Animations  | React Native Reanimated, Gesture Handler                        |
| UI          | expo-image, expo-linear-gradient, expo-glass-effect, expo-symbols |
| Fonts       | Fraunces and Inter (Google Fonts)                               |
| Language    | TypeScript (React Compiler enabled)                             |

## Project Structure

```
src/
├── app/              # Screens (Expo Router)
│   ├── (tabs)/       # Home, Shop, Wishlist, Bag, Profile
│   ├── product/      # Product details
│   ├── collection/   # Collection pages
│   ├── checkout/     # Delivery, payment, review, success
│   ├── orders/       # Order list and order details
│   ├── account/      # Addresses, sizes, notifications, help, about
│   ├── search.tsx
│   └── onboarding.tsx
├── components/       # Reusable UI, grouped by feature (home, product, checkout, orders, ui)
├── data/             # Mock catalog: products, categories, banners, orders, store info
├── lib/              # Helpers: catalog queries, pricing, haptics, storage, hooks
├── store/            # Zustand stores: cart, wishlist, checkout, orders, preferences, UI
└── theme/            # Design tokens: colors, spacing, radius, typography
```

## Getting Started

### Prerequisites

- Node.js (LTS)
- The [Expo Go](https://expo.dev/go) app on your phone, or an Android emulator / iOS simulator

### Install and run

```bash
npm install
npx expo start
```

Then press `a` for Android, `i` for iOS, or `w` for web, or scan the QR code with Expo Go.

### Useful scripts

```bash
npm run android     # start on Android
npm run ios         # start on iOS
npm run web         # start on web
npm run lint        # lint the project
npx tsc --noEmit    # typecheck
```

## Building with EAS

The project is set up for [EAS Build](https://docs.expo.dev/build/introduction/) with `development`, `preview`, and `production` profiles (see `eas.json`).

```bash
npx eas-cli@latest build --profile preview --platform android
npx eas-cli@latest build --profile production --platform all
npx eas-cli@latest submit --platform all
```

## Notes

- All product, category, and order data is mock data in `src/data/`. There is no backend yet.
- Prices are in Indian Rupees (₹). Delivery is free on orders over ₹2,999.
- Promo codes you can try: `WELCOME10` and `VUYO15`.
