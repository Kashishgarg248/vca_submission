# Wobb Influencer Discovery — Submission

A redesigned and feature-complete influencer search app built on top of the Wobb starter project.

## What Changed

### Bug Fixes
- **Engagement rate calculation**: The original `ProfileDetailPage` multiplied `engagement_rate * 10000` — it's already a decimal (e.g. `0.012` = 1.2%), so the correct multiplier is `100`. Fixed in `formatters.ts`.
- **Username search case sensitivity**: Added `.toLowerCase()` to username matching so searching "CRISTIANO" finds "cristiano".
- **Missing error handling in profile loader**: Added `.catch()` to the async profile load, and replaced the `loaded` boolean flag with separate `loading` / `error` states for clearer UI feedback.
- **Unused `clickCount` state**: Removed pointless `clickCount` / `handleProfileClick` state from `SearchPage` — it had no real purpose and caused an extra render on every card click.
- **`SearchBar` component**: Was defined but never used (the search input lived inside `PlatformFilter`). Removed to reduce dead code.
- **`data-search` attribute on card**: The `ProfileCard` passed the live `searchQuery` as a DOM attribute (`data-search`), which triggered a full re-render of every card on every keystroke. Removed.

### State Management: React Context → Zustand
Replaced the implicit local-state-prop-drilling pattern with a single Zustand store (`src/store/useStore.ts`). The store handles:
- Active platform and search query
- Saved list (with `persist` middleware for localStorage)
- Drawer open/close state

### Add to List Feature
Fully implemented, including:
- **Add / remove** from any profile card or the detail page
- **Duplicate prevention** (guarded by `user_id`)
- **Persistent storage** via Zustand's `persist` middleware (survives page refresh)
- **Saved List drawer**: slides in from the right, shows all saved profiles with platform badge, follower count, and remove button
- **Visual feedback**: saved cards get a left accent bar; the button switches to "Saved" state

### UI / UX Redesign
Full dark-mode redesign with a deep indigo/violet palette:
- CSS custom properties (design tokens) in `index.css` for consistency
- Platform tabs with per-platform accent colors (Instagram pink, YouTube red, TikTok teal)
- Card hover lift + platform-colored shadow
- Stat cards on the profile detail page with green highlight for high engagement rates
- Avatar fallback to `ui-avatars.com` on image load error
- Sticky header with glassmorphism blur
- Staggered card entrance animations (reduced-motion safe)
- Accessible: focus-visible rings, `aria-label`, `aria-pressed`, `role="tab"`, `role="dialog"`

### Code Quality
- Removed `SearchBar.tsx` (dead component)
- `ProfileList` wrapped in `React.memo` to avoid unnecessary re-renders
- `useMemo` for `extractProfiles` and `filterProfiles` in `SearchPage` so they only recompute when platform/query changes
- `useCallback` for add/remove handlers in cards to stabilise references
- Consistent TypeScript types; no implicit `any`
- Cleaner folder layout: `src/store/` for Zustand, `src/components/` for UI, `src/pages/` for routes

## Libraries Added
| Library | Version | Purpose |
|---------|---------|---------|
| `zustand` | ^5.x | Global state management + localStorage persistence |

All other dependencies (React 19, React Router 7, Tailwind 4, Vite 8, TypeScript 6) came from the starter.

## Assumptions
- Profile JSON files are keyed by `username` (e.g. `cristiano.json`). Profiles without a matching file show a "not found" screen.
- `engagement_rate` in the data is a plain decimal fraction (0.012 = 1.2%), not a percentage.
- The "list" is a simple flat array; no folder/campaign grouping was implemented (not in scope).

## Trade-offs
- **No test suite**: Given the deadline I prioritised feature completeness and code quality over test coverage. Adding Vitest + React Testing Library would be the next step.
- **Inline styles over Tailwind**: Tailwind v4's new engine doesn't support many utilities at runtime without the JIT compiler config, and the design system uses CSS variables that don't map 1:1 to Tailwind utilities. Inline styles + CSS variables gave more precision.
- **No data fetching library**: The data is static JSON, so React Query / SWR would add overhead with no benefit here.

## Remaining Improvements
- Add unit tests for `formatters.ts` and `dataHelpers.ts`
- Add keyboard navigation for the platform tab bar
- Implement list export (CSV download)
- Add skeleton loading cards instead of a spinner
- Consider virtual scrolling (react-window) if profile counts grow large

## Commands
```bash
npm install      # install dependencies
npm run dev      # http://localhost:5173
npm run build    # production build
npm run lint     # ESLint
```
