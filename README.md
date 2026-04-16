# hmnm

A Ferrari F1 themed React app that tracks a couple's relationship milestones.

**Live site:** [https://minh1609.github.io/hmnm/](https://minh1609.github.io/hmnm/)

## Stack

- React 19 + TypeScript 5.9
- Vite 8
- MUI v7
- Firebase (Firestore + Auth + Analytics)

## Dev

```bash
npm install
npm run dev      # Start dev server
npm run build    # Production build
npm run deploy   # Build + deploy to GitHub Pages
```

## Firebase

**Project ID:** `pet1609-cf0d7`  
**Firestore location:** `us-east1`

### Web app config (`src/firebase.ts`)

```ts
const firebaseConfig = {
    apiKey: 'AIzaSyClmCNiFmAOZT3KSe8sqZOTQV5lFR1-j7M',
    authDomain: 'pet1609-cf0d7.firebaseapp.com',
    projectId: 'pet1609-cf0d7',
    storageBucket: 'pet1609-cf0d7.firebasestorage.app',
    messagingSenderId: '628143755763',
    appId: '1:628143755763:web:997d3b8c16095d4b61c286',
    measurementId: 'G-TZ6WH7J1HS',
};
```

### CLI setup (first time on a new machine)

```bash
npm install -g firebase-tools
firebase login
firebase use pet1609-cf0d7
```

### Deploy Firestore rules & indexes

```bash
firebase deploy --only firestore
```

### Run migrations (seed Firestore data)

Requires `migrations/service-account.json` (Admin SDK key — keep this file private, do not commit).  
Download it from the [Firebase Console → Project Settings → Service accounts](https://console.firebase.google.com/project/pet1609-cf0d7/settings/serviceaccounts/adminsdk).

```bash
npm run migrate   # runs tsx migrations/seed-firestore.ts
```

### Set user roles manually (Firestore Console)

In the `users` collection, create a document with the user's UID and set:

```json
{ "role": "admin" } // or "gf"
```
