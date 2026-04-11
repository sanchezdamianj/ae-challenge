# Feedback Explorer

Internal tool for support teams to browse, search, filter, and manage customer feedback.

Built with React 19 + TypeScript + Vite.

## Preview

### Desktop

| Default (20 entries) | Stress test (5,000 entries) |
|---|---|
| ![Desktop default view](docs/desktop-default.png) | ![Desktop stress test](docs/desktop-stress.png) |

### Mobile

| Card list | Detail modal |
|---|---|
| <img src="docs/mobile-list.png" width="260" alt="Mobile card list" /> | <img src="docs/mobile-modal.png" width="260" alt="Mobile detail modal" /> |

## Setup

```bash
pnpm install
pnpm dev
```

Tests:

```bash
pnpm test
```

Requires Node 18+.

## Features

- Search by customer name or message (debounced)
- Filter by category and status
- Sort by date or priority
- Detail panel with full feedback info and status update
- Keyboard navigation: Tab to focus rows, ↑↓ arrows to navigate, Enter/Space to open detail
- Filters persisted in localStorage across sessions
- EN/ES toggle (locale persisted in localStorage)
- Responsive: table on desktop, cards on mobile (≤639px)
- Dark mode via `prefers-color-scheme`
- Stress test mode: toggle to 5,000 generated entries to validate performance

## Architecture

```
src/
  types/         Feedback, FeedbackFilters, and related types
  data/          20 curated mock entries + large dataset generator
  lib/           Pure filtering/sorting functions (framework-free, fully tested)
  hooks/         useDebounce, useFeedbackFilters, useFeedback, usePersistedFilters, useMediaQuery
  components/    FeedbackFilters, FeedbackTable, FeedbackRow, FeedbackCard, FeedbackDetailModal, badges
  contexts/      I18nContext (locale + translations)
  i18n/          EN and ES translation files with strict TypeScript types
  __tests__      Unit tests for all filtering and sorting logic
```

State flows one way: `useFeedback` owns items + filters + selection. Components only render.

## Trade-offs and Assumptions

**Virtualization over pagination**
The table virtualizes rows client-side (renders only what's in the viewport) instead of paginating. This gives a smoother UX for the support team — no page breaks while scanning. For 5,000 entries the frame rate stays solid. The row height is a fixed constant (64px) shared between JS and CSS, which is the only coupling in the approach.

**No external state library**
The dataset is small enough and the state shape simple enough that React's own `useState`/`useCallback`/`useMemo` covers everything without Redux, Zustand, or similar. Adding one would be premature.

**Filtering logic extracted to pure functions**
`lib/filterFeedback.ts` has zero React dependencies. This makes the logic independently testable and reusable outside the hook layer. The hook (`useFeedbackFilters`) only wraps it with debounce and memoization.

**localStorage filters are versioned**
Persisted filters include a schema version (`v: 1`). If the `FeedbackFilters` shape changes in a future iteration, stale stored data is discarded and replaced with defaults instead of crashing.

**Status updates are local only**
There's no backend. Updates apply to in-memory state and are lost on refresh — consistent with the spec's "locally in the UI" requirement. Adding optimistic persistence would mean writing status overrides to localStorage keyed by item ID.

**i18n without a library**
The translation system is a typed context with a `Record<Locale, Translations>` map. No i18next or similar. For two languages and a fixed set of strings this is sufficient and keeps the bundle small. The `Translations` interface enforces at compile time that both locales cover every key.

**Mobile uses cards, not a responsive table**
At 360px a 5-column table becomes unreadable regardless of how much you hide. Cards show all the relevant fields in a vertical layout and are more natural to tap. The switch happens at 639px via `useMediaQuery`.

## GitHub

[github.com/sanchezdamianj](https://github.com/sanchezdamianj)
