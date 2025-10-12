# ✅ Developer Task List – Multi-Stop Route Planner

## 🧱 Phase 1: Project Setup

- [x] Initialize React project (Vite or CRA)
- [x] Install Material UI and configure theme
- [x] Install react-router-dom and set up routing
- [x] Initialize Firebase project (Auth, Firestore, Hosting)
- [x] Set up Firebase Functions (Node.js)

## 🔐 Phase 2: Authentication & User Flow

- [x] Implement Google Login via Firebase Auth
- [x] Redirect to dashboard after login
- [x] Save user profile to Firestore on first login
- [x] Set up auth state context or Redux
- [x] Protect routes using private route wrappers

## 🗂️ Phase 3: Address Book

- [x] Create Address form with Google Places autocomplete
- [x] Save addresses to Firestore under /users/{uid}/addresses
- [x] List addresses in table or card view
- [ ] Implement edit and delete actions
- [ ] Add support for tagging and filters
- [ ] Add search bar for address filtering

## 🛣️ Phase 4: Route Planner

- [ ] UI to select saved or new addresses
- [ ] Drag-and-drop stops list using react-beautiful-dnd
- [ ] Implement Optimize Route button
- [ ] Create Firebase Function to call Google Directions API
- [ ] Return optimized stop order and total duration
- [ ] Display updated order in UI

## 🗺️ Phase 5: Map Integration

- [ ] Integrate Google Maps with @react-google-maps/api
- [ ] Plot route using Polyline
- [ ] Auto-fit map bounds to all stops
- [ ] Add map controls (zoom, map type)

## 💾 Phase 6: Route Management

- [ ] Save routes to Firestore with name, address IDs, and order
- [ ] List saved routes on dashboard
- [ ] View saved route (read-only)
- [ ] Add edit, delete, and duplicate actions

## 🔗 Phase 7: Route Sharing

- [ ] Generate shareable route link (e.g., /share/{routeId})
- [ ] Mark route as public (`shareable: true`)
- [ ] Build public route page (read-only)
- [ ] Embed route map and stops
- [ ] Add "Open in Google Maps" button

## 📲 Phase 8: Google Maps Navigation Integration

- [ ] Build Google Maps deep link with waypoints
- [ ] Open in new tab or default maps app

## ⚙️ Phase 9: Settings & Privacy

- [ ] Create Settings page
- [ ] Export user data to JSON file
- [ ] Delete user account and data
- [ ] Show name/email/account info
- [ ] Implement GDPR cookie consent banner
- [ ] Store consent state

## 🚀 Phase 10: Finalize & Deploy

- [ ] Lazy-load Google Maps component
- [ ] Debounce address autocomplete
- [ ] Optimize Firestore queries with indexes
- [ ] Add unit tests for core features
- [ ] Manually test on desktop and mobile browsers
- [ ] Deploy frontend to Firebase Hosting or Vercel
- [ ] Deploy Firebase Functions
- [ ] Set up logging and error monitoring (e.g., Sentry)
