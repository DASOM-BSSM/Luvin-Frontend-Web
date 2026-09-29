# AGENTS.md

Luvin is a mobile-based bread-themed AI dating simulation app. The core concept is **"Love is all about timing"** — users' romantic tendencies are analyzed and expressed as bread types, and an AI avatar ("분신") that mirrors the user's personality participates in a dating simulation.

This repository is `luvin-frontend-v2` — a fresh Expo SDK 57 rewrite. Most of the app is not implemented yet, so **follow the conventions in this file when creating new files rather than inferring them from the (nearly empty) codebase.**

---

> ## ALWAYS READ FIRST BEFORE STARTING ANY TASK
>
> 1. **Read the Directory Architecture section** in this file before writing any code
> 2. **Read the Figma design** before implementing any UI — do NOT assume or hardcode design values
> 3. **Check `package.json`** for exact dependency versions before installing anything
> 4. **Use `pnpm`** — this project is not npm/yarn/bun based
> 5. **Before reporting a task done**, run the quality gate (§5): typecheck + lint must pass

---

# 1. Platform Principles

- **Target platforms**: iOS and Android
- Ensure identical UX, interface, and behavior on both platforms
- Avoid platform-specific styles or logic that cause visual inconsistencies unless strictly necessary (e.g. SafeArea padding)
- This project uses **`expo-dev-client` with native code** — not Expo Go
  - Run with `pnpm ios` / `pnpm android` (`expo run:*`), which prebuild (if needed) and build the native app
  - `pnpm start` only starts the bundler; it requires an already-installed dev client build
- **`ios/` and `android/` are gitignored generated output** (see `.gitignore`) — they are recreated by `npx expo prebuild`
  - Any hand-edit to those folders is lost on the next prebuild — **never edit them**
  - All native configuration belongs in `app.json` or a config plugin
  - Adding a library with native code requires a rebuild — say so when you add one

---

# 2. Tech Stack

> Always verify exact versions in `package.json` before use. Do not upgrade packages without confirmation.

| Category         | Library                               | Notes                                            |
| ---------------- | ------------------------------------- | ------------------------------------------------ |
| Framework        | `expo` (SDK 57)                       | Dev client + prebuilt native projects            |
| Routing          | `expo-router`                         | File-based routing under `src/app/`              |
| Runtime          | `react-native`, `react`, `typescript` | RN 0.86 / React 19 / TS 6 — check `package.json` |
| Styling          | `nativewind` (NativeWind v4)          | Tailwind CSS v3 compatible                       |
| State Management | `zustand`                             | Global in-memory state                           |
| Async State      | `@tanstack/react-query`               | Data fetching and caching (see §11)              |
| Local Storage    | `react-native-mmkv`                   | **Non-sensitive** persisted key-value only (§12) |
| Animation        | `react-native-reanimated` v4          | Requires `react-native-worklets`                 |
| Native UI        | `@expo/ui`, `expo-glass-effect`       | Prefer these over reimplementing native looks    |
| Deep Linking     | `expo-linking`                        | Scheme `luvinfrontendv2` (§13)                   |
| Auth             | Google OAuth only                     | No separate sign-up flow (§12)                   |

## Not installed yet — ask before adding

Do NOT assume any of these exist, and do NOT install them on your own initiative. Each one is a decision the user has to make; several also require a native rebuild.

| Need                  | Intended choice                                                     | Section |
| --------------------- | ------------------------------------------------------------------- | ------- |
| HTTP client           | `axios` or plain `fetch` — undecided                                | §11     |
| Lint / format / hooks | `eslint` + `eslint-config-expo`, `prettier`, `husky`, `lint-staged` | §5      |
| Unit / e2e tests      | `jest-expo` + `@testing-library/react-native`, Maestro              | §6      |
| Secure token storage  | `expo-secure-store`                                                 | §12     |
| Push notifications    | `expo-notifications`                                                | §13     |
| Crash reporting       | `@sentry/react-native`                                              | §14     |
| Analytics             | none chosen                                                         | §14     |
| Toast / snackbar      | in-house component preferred over a new dependency                  | §11     |

`prettier-plugin-tailwindcss` is in `devDependencies`, but **`prettier` itself is not installed and there is no Prettier config** — the plugin currently does nothing. See §5.

`app.json` enables `experiments.typedRoutes` and `experiments.reactCompiler`:

- Route paths are type-checked — use typed hrefs, do not cast to `any`
- The React Compiler handles memoization — do NOT add `useMemo` / `useCallback` / `memo` for performance unless there is a measured reason

---

# 3. Package & Dependency Rules

- **Package manager: `pnpm`** — do NOT use `npm`, `yarn`, or `bun` (the lockfile is `pnpm-lock.yaml`)
- Use the following command when adding new packages to ensure Expo SDK compatibility:
  ```bash
  pnpm expo install <package-name>
  ```
- Do not upgrade any package version without explicit confirmation from the user
- Do not add a dependency that is not already in `package.json` or listed in §2 without asking first
- Adding a package with native code requires a rebuild (`pnpm ios` / `pnpm android`) — say so when you add one
- If a package is missing or version conflicts arise, report it and ask before resolving

---

# 4. Environment Variables

- Files: `.env.example` (committed template), `.env.local`, `.env.development` — never commit real secrets (`.gitignore` excludes `.env*` except `.env.example`)
- Expo only exposes variables prefixed with **`EXPO_PUBLIC_`** to the client; read them via `process.env.EXPO_PUBLIC_*`
- **`EXPO_PUBLIC_` values are embedded in the app bundle and are readable by anyone** — never put a secret, private key, or OAuth client secret there
- `.env.example` currently contains a stale `VITE_API_URL` key — this is a leftover and is NOT used; ask before renaming or repurposing it
- Add any new key to `.env.example` (with an empty or placeholder value) in the same change

---

# 5. Code Quality Gate: Lint, Format, Typecheck

> The rules in §8 and §9 (`any` ban, no inline styles, no manual memoization, …) are **not currently machine-enforced**. Until the tooling below exists, they hold by review only — so follow them deliberately.

**Status: ESLint, Prettier, and pre-commit hooks are NOT set up yet.** `pnpm lint` runs `expo lint`, which on first run in an unconfigured project offers to install and scaffold an ESLint config — that installs packages, so **ask the user before running it**.

## What every task must do now

Run this before reporting any code change as done, and report the result honestly:

```bash
pnpm tsc --noEmit
```

`tsconfig.json` has `strict: true`, so a clean typecheck is the minimum bar. If a `typecheck` / `lint` script exists by the time you read this, run those instead.

## Target setup (do this when the user approves)

1. Install: `eslint`, `eslint-config-expo`, `prettier` (`prettier-plugin-tailwindcss` is already present)
2. `eslint.config.js` — flat config extending `eslint-config-expo`, plus rules that mirror this document:
   - `@typescript-eslint/no-explicit-any: "error"`
   - `no-console: "warn"`
   - `no-restricted-imports` — ban `Animated` from `react-native` (use Reanimated), ban `Image` from `react-native` (use `expo-image`), ban `react-native-mmkv` outside `src/lib/`
3. `.prettierrc` — `plugins: ["prettier-plugin-tailwindcss"]`, and match the files already in `src/`: **single quotes**, semicolons, 2-space indent, `printWidth: 100`
4. `package.json` scripts: `typecheck` (`tsc --noEmit`), `lint:fix`, `format`, `format:check`
5. `husky` + `lint-staged` pre-commit hook: `tsc --noEmit` on the project, `eslint --fix` + `prettier --write` on staged files
6. Do not use `git commit --no-verify` to bypass the hook

`.vscode/settings.json` already enables `source.fixAll` on save — it does nothing until an ESLint config exists.

---

# 6. Testing Strategy

**Explicit decision for v2 MVP: there is no automated test suite, and that is deliberate — not an oversight.**

Rationale: pre-launch, every screen is still being derived from Figma and churns constantly, so UI tests would be rewritten more often than they would catch anything. The safety net is instead: `strict` TypeScript + lint (§5) + manual verification on both platforms.

- Do NOT add `jest`, `jest-expo`, `@testing-library/react-native`, Detox, or Maestro without explicit approval — adding a test framework is a project decision, not a task detail
- **Manual verification is mandatory**: check any UI change on both iOS and Android before calling it done, and say which platforms you actually verified. If you could not run the app, say so plainly instead of implying it was verified

## Write testable code now, so tests are cheap later

Even without a test runner, keep pure logic out of components — this is required, not optional:

- Survey scoring, bread-type calculation, compatibility/matching rules, date and text formatting → pure functions in `src/features/<feature>/utils/` or `src/lib/`
- No business logic inside JSX or inside a `useEffect`
- These functions take plain inputs and return plain outputs — no hooks, no navigation, no storage access

## When testing is turned on (the intended shape)

| Layer | Tool                                          | Scope                                                                        |
| ----- | --------------------------------------------- | ---------------------------------------------------------------------------- |
| Unit  | `jest-expo` + `@testing-library/react-native` | Pure logic first (scoring, matching), then shared UI in `src/components/ui/` |
| E2E   | Maestro (YAML flows in `.maestro/`)           | Onboarding → Google OAuth → survey → result                                  |

Unit tests live next to the code under test in a `__tests__/` folder. Do not aim for a coverage number; cover the scoring/matching rules and the auth flow.

---

# 7. CI

**Status: there is no CI yet — no `.github/` directory exists.** The branch and commit conventions in §17 are currently enforced by review only.

## Target setup (do this when the user approves)

- `.github/workflows/ci.yml`, triggered on pull requests targeting `main`:
  1. `pnpm install --frozen-lockfile`
  2. `pnpm typecheck`
  3. `pnpm lint`
  4. `pnpm format:check`
- Pin the Node and pnpm versions to what the team uses locally; `--frozen-lockfile` means `pnpm-lock.yaml` must always be committed together with `package.json`
- No test job until §6 changes
- Do NOT add native builds or EAS Build to PR CI without asking — they are slow and metered
- Ask the user to require the CI check before merge in branch protection; the pre-commit hook (§5) is a convenience, CI is the actual gate

---

# 8. Design System

> **All design values (colors, spacing, typography, border radius, etc.) must be read from Figma.**
> Do NOT hardcode or assume any design tokens.
>
> - **Token values (hex, px) live only in `src/constants/colors.ts` and `src/constants/typography.ts`.** `tailwind.config.js` just `require`s them and wires them into `theme.extend` — do not put a literal value in the Tailwind config
> - `src/constants/theme.ts` re-exports both as a single `theme` object, for the rare places that need a JS style value instead of a `className`
> - If a token is missing, read it from Figma and add it to the constants file first, then use it
> - Source of truth in Figma: file **"Luvin-Design"** — `Color system` variable collection, and the `Heading/*` / `Body/*` text styles
> - **Figma File Key**: Do NOT hardcode anywhere. Ask the user for the file key before querying Figma.

## Light mode only

`src/app/_layout.tsx` pins NativeWind to light with `colorScheme.set('light')`, because the Figma `Color system` collection has a single mode and no dark palette. Do NOT add `dark:` variants or a theme toggle unless a dark palette lands in Figma first.

## Figma MCP Rules

- Always read the Figma design before implementing any screen or component
- If the Figma MCP returns a localhost URL for an image or SVG, find the same asset from `src/assets/images`
- Do NOT add new icon packages — all icon assets come from Figma
- Do NOT create placeholder assets — use the actual Figma assets
- If Figma design is unavailable for a component, **ask before proceeding**

## Typography

Three fonts are used in Luvin:

| Font           | Registered family   | Usage                                                                             |
| -------------- | ------------------- | --------------------------------------------------------------------------------- |
| `Yde street B` | `YdestreetB`        | Headlines, brand elements, display text                                           |
| `Yde street L` | `YdestreetL`        | Body text, descriptions, subtext                                                  |
| `Ok Mallang B` | `OkMallangBRegular` | 러빈지옥 titles and emphasis copy (episode titles, mission banners, key callouts) |

Do NOT use any other font. All font usage details are defined in Figma.

- The three `.ttf` files live in `src/assets/fonts/` and are loaded with `useFonts` in `src/app/_layout.tsx`. The Ok Mallang B file is `OkMallangB-Regular.ttf`, renamed from its original `Ok Mallang B.ttf` — a space in the filename broke Metro's font asset resolution on Android (the font silently fell back to the system font while every other style still applied). Never reintroduce a space in a font filename
- **One invariant, everywhere the registered family is referenced**: the `useFonts` key and `fontFamily` in `src/constants/typography.ts` (which feeds Tailwind) must be the same string. Changing one without the other silently falls back to the system font. For Ok Mallang B this registered string is `OkMallangBRegular` — deliberately **not** the same as the `.ttf`'s actual PostScript name (`OkMallangB-Regular`, verified via the `name` table). They don't need to match: expo-font's Android font registry looks fonts up by whatever key you pass to `useFonts`, not by the file's internal PostScript name
- **Verified on-device bug: never apply Ok Mallang B via the `font-ok-mallang-b` Tailwind class.** NativeWind v4's CSS-to-RN-style pipeline silently drops this font family on the `className` path — confirmed on a real Android device, reproduced with and without a hyphen in the registered name (so it isn't a hyphen-parsing issue, just a NativeWind limitation with this font) — while the exact same string applied as a raw `style={{ fontFamily: fontFamily.okMallangB }}` renders correctly every time. Always apply this font via a `style` prop, never `font-ok-mallang-b` — this is a deliberate, measured exception to the inline-style ban (§16), on the same footing as the Reanimated exception
- RN cannot synthesize weight across static font files, so weight is expressed by **switching family** (`YdestreetB` / `YdestreetL` / `OkMallangBRegular`) — never with `fontWeight` or `font-bold`
- Use the Tailwind `fontSize`/`fontFamily` tokens generated from `typography.ts` (Figma `Heading/H1`–`H5`, `Body/XL`–`XXS`, all at a 160% line-height ratio) — do not set a raw `fontSize`

### Exception: `OK Mallang B` has no registered font-size scale, and carries a text stroke

Unlike `YdestreetB`/`YdestreetL`, `OK Mallang B` is **not** covered by the `Heading/*` / `Body/*` text styles in Figma — there is no size token for it in `typography.ts`. Every Figma instance of it so far also has a **stroke (outline)** painted on the text itself — Figma's own codegen does not expose text-stroke as CSS/props, so it is invisible unless you open a screenshot of that specific node and inspect it (get_design_context's extracted code will look like plain, strokeless text even when Figma clearly renders one — do not trust it for this).

- Every time `OK Mallang B` is used, **check the exact font size AND stroke (present or not, color, width) in Figma for that specific instance** — never reuse another instance's size or stroke without checking, since both can differ per instance. Confirmed so far: `display.title` (Ready?/Game Over, 40px) uses a thin pink-200 stroke; `display.score` (HUD record counter, 28px) uses a much heavier black (`default/black` `#1D1D1D`) stroke; the two one-off logo/title texts (`Choose Your Mode` 50px, `Luvin's Inferno` 24px) use a very thin pink-200 stroke
- RN's `Text` has no stroke property, and this codebase's chosen way to fake one is `src/components/ui/ok-mallang-b-text.tsx` (`OkMallangBText`) — it layers 8 direction-offset copies of the text in the stroke color underneath one copy in the fill color, which naturally supports the same multi-line wrapping as a plain `Text` (an `react-native-svg` `Text` was considered too, since it has real `stroke`/`strokeWidth` props, but multi-line text there needs manual `tspan` layout, so the layered-copy approach was chosen instead — reconsider `react-native-svg` if a future instance needs pixel-exact stroke joins that the layered approach can't approximate well)
- This is the one place a raw `fontSize`/stroke value pair is allowed inline, since no token exists to reference. If the same size+stroke combination is reused across 2+ places, add it to `typography.ts`'s `display` object as a named token (with `fill`/`stroke.color`/`stroke.width`) at that point, the way `display.title`/`display.score` already are — don't leave duplicated raw values scattered across components
- The `Text` component's `display-title`/`display-score` variants already route through `OkMallangBText` and the `display.*` tokens — use those variants instead of calling `OkMallangBText` directly whenever the text matches one of those two tokens exactly

---

# 9. Directory Architecture

> **Read this section before writing any code for every single task.**
> Place files exactly as described. Do not create new top-level directories without confirmation.

Note: unlike v1, **all source lives under `src/`, including the Expo Router routes (`src/app/`)**. Static app assets (icon, splash, logo) stay in the root-level `assets/`.

```
luvin-frontend-v2/
├── src/
│   ├── app/                      # Expo Router routes (file-based)
│   │   ├── _layout.tsx           # Root layout: providers + `export function ErrorBoundary`
│   │   ├── index.tsx             # Entry screen
│   │   └── (tabs)/               # Tab navigator group
│   │       ├── _layout.tsx
│   │       └── index.tsx
│   │
│   ├── assets/
│   │   ├── fonts/                # YdestreetB.ttf, YdestreetL.ttf
│   │   ├── icons/                # SVG icon components from Figma only
│   │   └── images/               # Image assets from Figma only
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable domain-agnostic UI components
│   │   │                         # Button, Input, TemperatureGauge, StatusTag,
│   │   │                         # Skeleton, ErrorState, EmptyState, Toast (§11)
│   │   └── ...                   # Domain-specific shared components
│   │
│   ├── constants/                # Design tokens + app-wide constants
│   │   ├── colors.ts             # Figma `Color system` — the only place hex values live
│   │   ├── typography.ts         # Figma text styles — the only place font sizes live
│   │   ├── theme.ts              # Aggregated `theme` export (colors + typography)
│   │   └── error-messages.ts     # User-facing error copy (§11)
│   ├── hooks/                    # Common custom hooks
│   │
│   ├── features/                 # Feature-based modules
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── lib/token-storage.ts   # ONLY module touching SecureStore (§12)
│   │   │   ├── store/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   ├── notifications/        # Push + deep link handling (§13)
│   │   └── <feature>/            # Same subfolder shape as auth/
│   │
│   ├── lib/                      # query-client.ts, storage.ts (MMKV wrapper), sentry.ts
│   ├── providers/                # ONLY providers with real logic (query, toast) — see note
│   └── types/                    # Global TypeScript types
│
├── assets/                       # App icon / splash / logo (referenced by app.json)
├── .github/workflows/ci.yml      # CI (§7) — not created yet
├── .husky/                       # pre-commit hook (§5) — not created yet
├── eslint.config.js              # (§5) — not created yet
├── .prettierrc                   # (§5) — not created yet
├── AGENTS.md                     # This file
├── CLAUDE.md                     # Includes AGENTS.md
├── CONTRIBUTING.md               # Commit / branch conventions
├── app.json
├── global.css                    # Tailwind entry (root level, per metro.config.js)
├── tailwind.config.js            # Contains design tokens
├── package.json
└── tsconfig.json
```

Font loading and `colorScheme` setup already live directly in `src/app/_layout.tsx`, and a `src/providers/` directory was **deliberately removed** in favour of that — so do not reintroduce a theme or font provider. Add a file under `src/providers/` only for a provider that carries real logic (the TanStack Query client, the toast host), and mount it in `_layout.tsx`.

`src/app/`, `src/assets/fonts`, `src/components/ui`, `src/constants`, and `src/hooks` already exist. `ios/` and `android/` exist locally but are gitignored build output (§1). Everything else above is the convention to follow when the directory is first needed — create it in place, do not invent an alternative layout.

## Import Alias

`tsconfig.json` maps `@/*` to the **project root**, not to `src/`:

```ts
import "@/global.css";
import Button from "@/src/components/ui/button";
```

Always use `@/`-prefixed absolute imports — no `../../` relative climbing out of a directory.

### Component Placement Rules

| Situation                                        | Location                             |
| ------------------------------------------------ | ------------------------------------ |
| Reusable across any domain (Button, Input, etc.) | `src/components/ui/`                 |
| Shared but domain-specific                       | `src/components/`                    |
| Used only in one feature                         | `src/features/<feature>/components/` |
| API calls for a feature                          | `src/features/<feature>/api/`        |
| Zustand store for a feature                      | `src/features/<feature>/store/`      |
| TypeScript types for a feature                   | `src/features/<feature>/types/`      |
| Pure business logic (testable)                   | `src/features/<feature>/utils/`      |
| Common hooks                                     | `src/hooks/`                         |
| Color tokens                                     | `src/constants/colors.ts`            |
| Typography tokens                                | `src/constants/typography.ts`        |

---

# 10. Component-First Development Rules

> **Read this before implementing any page.**

## Before developing any page, you MUST:

1. **Identify all reusable UI elements** that appear across multiple pages (buttons, inputs, cards, tags, gauges, etc.) and implement them as shared components in `src/components/ui/` first
2. **Identify all image/illustration assets** used in the page and implement each as a dedicated component before use
3. **Check if the component already exists** in `src/components/ui/` or `src/features/<feature>/components/` before creating a new one — never duplicate

## Image & Asset Components

- **Every image, illustration, and SVG asset must be implemented as a React component**
- Copy SVG code from Figma and wrap it as a component in `src/assets/icons/`
- Do NOT use raw `<Image>` with a file path directly in a page — always wrap in a component
- Use `expo-image`'s `<Image>` for bitmap assets (not `react-native`'s)
- Naming convention: `<BreadCharacter type="salt" />`, `<OvenIllustration state="baking" />`, etc.

## Component Checklist (run through this before writing any page code)

- [ ] All shared UI components used in this page exist in `src/components/ui/`
- [ ] All image/SVG assets used in this page are wrapped as components
- [ ] All feature-specific components are defined in `src/features/<feature>/components/`
- [ ] Loading, error, and empty states are all handled (§11)
- [ ] No design values are hardcoded — all tokens come from `src/constants/` via Tailwind classes
- [ ] No duplicate components — always reuse existing ones

---

# 11. Data Fetching, Loading & Error States

> Every screen must handle **loading, error, and empty** explicitly. A screen that only handles the success path is incomplete.

## Query layer

- One `QueryClient` in `src/lib/query-client.ts`, mounted through `src/providers/query-provider.tsx` in `src/app/_layout.tsx` — never create a `QueryClient` inside a component
- Set global defaults there (staleTime, `retry: 1`, no window-focus refetching on native) instead of repeating options per call
- Query keys come from a per-feature factory in `src/features/<feature>/api/query-keys.ts` — no inline string arrays scattered across components
- All server access goes through `src/features/<feature>/api/` — components never call the HTTP layer directly
- TanStack Query v5 naming: mutations expose `isPending`, not `isLoading`

## The three states

| State       | Pattern                                                                                                                                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Loading** | Skeleton that mirrors the real layout — `<Skeleton />` from `src/components/ui/`, composed into a screen-level `<HomeSkeleton />` in the feature folder. No full-screen spinners, no layout shift when data arrives. |
| **Error**   | Inline `<ErrorState message onRetry />` wired to the query's `refetch` — the user must always have a way to retry.                                                                                                   |
| **Empty**   | `<EmptyState />` with the Figma illustration and copy — never an empty scroll view.                                                                                                                                  |

## Mutations and feedback

- Pending state lives on the triggering control: disable it and show its own in-button indicator — do not block the whole screen
- Success / failure feedback → **toast**, via `src/providers/toast-provider.tsx` and a `useToast()` hook
- `Alert.alert` is only for destructive confirmations ("정말 삭제할까요?"), never for validation errors or success messages
- Build the toast in-house from Reanimated primitives; ask before adding a toast library

## Error boundaries and error copy

- Unexpected render errors are caught by `export function ErrorBoundary({ error, retry })` in `src/app/_layout.tsx` (expo-router's built-in) — add one per route group when a group needs its own fallback
- **Never render a raw server message, stack trace, or HTTP status to the user.** Map failures to Korean copy in `src/constants/error-messages.ts`, with one generic fallback
- Log the raw error to crash reporting instead (§14) — not to `console.log` in committed code

---

# 12. Auth & Token Storage

Google OAuth only; the first login auto-creates the account, so there is no separate sign-up flow.

## Where tokens go — this split is mandatory

| Data                                                       | Storage                                                        |
| ---------------------------------------------------------- | -------------------------------------------------------------- |
| Access token, refresh token, OAuth code                    | **`expo-secure-store` only** (iOS Keychain / Android Keystore) |
| Session status, user profile, bread type                   | In-memory Zustand store (`src/features/auth/store/`)           |
| Non-sensitive prefs (onboarding seen, survey draft, theme) | MMKV wrapper in `src/lib/storage.ts`                           |

- **Never** put a token in MMKV, in a Zustand `persist` store, in the query cache, in an `.env` file, in a log, or in a URL / query parameter
- `src/features/auth/lib/token-storage.ts` is the **only** module that touches SecureStore — everything else calls it. Do not read SecureStore from a component
- One refresh path in the HTTP layer (single-flight — concurrent 401s must not trigger parallel refreshes)
- On refresh failure: clear SecureStore, reset the auth store and query cache, and route back to onboarding
- Redact tokens from crash reports and never include them in analytics events (§14)
- Build OAuth redirect URIs with `expo-linking`'s `createURL()` — do not hardcode them (§13)

**`expo-secure-store` is not installed.** When auth work starts: `pnpm expo install expo-secure-store` (native rebuild required) — ask first.

---

# 13. Deep Links & Push Notifications

Matching and message alerts are core to the product, so keep the routing surface ready for them even before push is implemented.

## Deep links

- URL scheme is **`luvinfrontendv2`** (`app.json` → `scheme`); `expo-linking` is installed
- expo-router derives link paths from the route tree, so **route paths under `src/app/` are a public contract** — renaming a route breaks existing links and notification payloads. Say so when a rename is needed
- Always build URLs with `Linking.createURL()` and navigate with typed hrefs — never assemble a path from raw strings
- Universal links / App Links (associated domains, intent filters) require `app.json` config plus a rebuild — ask before adding

## Push notifications

**Status: `expo-notifications` is not installed, and no push work should start without approval.** The dev client (§1) does support push, unlike Expo Go.

Reserved location: `src/features/notifications/` — permission requests, token registration, and tap handling all live there, not in a screen.

When it is implemented, follow these:

- Request permission at a meaningful moment (after signup or first match), **never on the first app launch**
- Register the push token only after login, send it to the server keyed to the user, and clear it on logout
- Handle both cold start (app opened by a notification) and foreground receipt; route through expo-router with a typed href derived from the payload
- Treat payload contents as untrusted input — validate before using it to navigate; never navigate to an arbitrary URL from a payload
- Notification copy is product copy — it comes from Figma or the user, not invented in code

---

# 14. Crash Reporting & Analytics

**Status: nothing is installed. Decision: the MVP may ship internally without it, but crash reporting must be added before the first external build (TestFlight / Play internal testing).**

## Crash reporting (intended: `@sentry/react-native`)

- Requires a native rebuild and a config plugin entry in `app.json` — ask before installing
- DSN goes in `EXPO_PUBLIC_SENTRY_DSN`; the source-map upload auth token is a **CI secret**, never committed (§4, §7)
- Initialize once in `src/lib/sentry.ts`, called from `src/app/_layout.tsx`
- **No PII in events or breadcrumbs**: no email, tokens, OAuth codes, or survey answers. Identify users by server-side id only
- Report handled-but-unexpected failures here instead of leaving `console.log` in committed code (§11)

## Analytics

- No analytics SDK has been chosen. Do NOT add one, or start hand-rolling event logging, without asking
- When it lands, event names and properties get defined in one place (`src/constants/`), not inlined at call sites

---

# 15. Coding Rules

- Use functional components, hooks, and explicit TypeScript types/interfaces (`strict: true` is on)
- **Component declaration**: always use `export default function Name() {}` form
  - Exception: `forwardRef` wrapping — use `const Name = forwardRef(...)` + separate export
  - Small internal helper components — `const` arrow functions allowed
- Use **NativeWind `className`** for styling — avoid `style={{}}` and `StyleSheet.create`
- NativeWind v4 (Tailwind CSS v3): wire custom styles through `tailwind.config.js`, with the values themselves in `src/constants/` (§8)
- Ensure `babel.config.js` and `metro.config.js` maintain NativeWind v4 config (`jsxImportSource: "nativewind"`, `withNativeWind({ input: "./global.css" })`)
- Async state: manage with **TanStack Query** (`useQuery`, `useMutation`) — no manual `useEffect` + `useState` fetching
- Persisted local state: **MMKV** via the single wrapper in `src/lib/storage.ts` — do not call MMKV directly from components, and never store secrets in it (§12)
- Animations: `react-native-reanimated` v4 — never `Animated` from `react-native`
- Keep business logic in pure functions outside components (§6)
- Preserve all existing comments and docstrings — do not remove them
- Run `pnpm tsc --noEmit` before reporting a change as done (§5)

---

# 16. Avoid Patterns

- Do not use `any` type — write `[feature]/types.ts` and export proper interfaces
- Avoid `margin`/`padding` — use `gap` or empty `h-{}` spacer views instead
- If a component exceeds 150 lines, split into separate hook or component files
- Do not use `React.[module]` — import directly: `import { useState } from 'react'`
- Do not use inline functions — use named handlers: `handle{Target}{Event}` (e.g. `handleCTAButtonPress`)
- Do not use inline styles
- Do not use `relative`/`absolute` layout — use flex Tailwind classes instead
- Do not create custom asset files — copy SVG from Figma and convert to SVG component
- Do not install new icon packages — all icons come from Figma
- Do not hardcode design values — use the tokens in `src/constants/`, or read the value from Figma and add it there first
- Do not write a hex or px literal in `tailwind.config.js`, a component, or a style object
- Do not use `dark:` variants or `fontWeight` / `font-bold` (§8)
- Do not add `useMemo`/`useCallback`/`memo` by default — React Compiler is enabled
- Do not put routes anywhere but `src/app/` — no screen files under `src/features/`
- Do not leave `console.log` in committed code — use crash reporting (§14)
- Do not ship a screen that handles only the success path (§11)
- Do not use `Alert.alert` for validation or success feedback — use a toast (§11)
- Do not surface raw server errors, stack traces, or status codes to the user (§11)
- Do not store tokens or secrets in MMKV, `persist`ed Zustand, `.env`, or logs (§12)
- Do not edit `ios/` or `android/` by hand — they are regenerated by prebuild (§1)
- Do not install lint / test / crash-reporting / notification packages on your own initiative (§2)
- Do not claim a change was verified on device if you did not run it (§6)

---

# 17. Git Conventions

See `CONTRIBUTING.md` for the full table. Summary:

- Branch: `<type>/<jira-number>` → `feat/LUV-26`
- Commit: `<type>(<jira-number>) :: 변경 사항 요약` → `chore(LUV-26) :: 커밋 컨벤션 추가`
- Types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `delete`, `build`
- Subject within 50 characters; body optional, wrap at 72
- Ask before committing or pushing, and never commit directly to `main`
- Commit `pnpm-lock.yaml` alongside any `package.json` change — CI installs with `--frozen-lockfile` (§7)
- Once the pre-commit hook exists (§5), do not bypass it with `--no-verify`

---

# 18. MCP Configuration Notes

- **Figma MCP requires authorization** — if it is unauthenticated, tell the user to authorize it (claude.ai connector settings, or `claude mcp` / `/mcp` in an interactive session) instead of guessing design values
- **Required flag**: `--stdio` (default HTTP mode is incompatible with Claude Code)
- **API token**: expires every 90 days — verify before use, never commit to repository
- **Figma File Key**: ask the user before querying — never hardcode in any file
- When querying Figma: specify `fileKey` and `node-id` separately for reliability

---

# 19. API Integration (OpenAPI Spec + Axios)

> Draft, pending review against the actual backend `openapi.json` structure.

## HTTP Client

- **`axios` is the confirmed choice.** This supersedes the "HTTP client: axios or fetch — undecided" entry in §2
- Create exactly one axios instance in `src/lib/api-client.ts` — never call `axios.create()` from a component or feature file
- `baseURL` comes from the `EXPO_PUBLIC_API_URL` environment variable (add the key to `.env.example` per §4)
- The auth header is attached automatically in a request interceptor, but the token value itself must only be read through `src/features/auth/lib/token-storage.ts` — no exception for interceptor code (§12)
- On a 401, follow the single-flight refresh rule already defined in §12; implement it inside the interceptor

## OpenAPI Spec → Generated Types

- Save the OpenAPI 3.1 spec (JSON) received from the backend at **`docs/api/openapi.json`** — this file is the source of truth for the API surface; do not browse the backend repo to infer endpoints
- Generate TypeScript types from this spec with `openapi-typescript` into **`src/types/api-generated.ts`**
  - Mark the file as auto-generated in a header comment; never hand-edit it
  - Add a `pnpm generate:api-types` script to `package.json`
  - Installing `openapi-typescript` requires user approval first, per §3
- **Whenever a new spec arrives**, follow this sequence:
  1. Replace `docs/api/openapi.json`
  2. Re-run `pnpm generate:api-types`
  3. Run `pnpm tsc --noEmit` to surface any type errors in existing API functions/components
  4. Fix any errors and report a summary of what changed

## API Functions & Query Integration

- Write request functions per feature in `src/features/<feature>/api/`, using the types from `api-generated.ts` directly — no `any` on request or response types (§16)
- Query keys stay in `src/features/<feature>/api/query-keys.ts`, per the existing convention
- Components never call axios or an API function directly — always go through `useQuery`/`useMutation` (§11)

## Workflow

- On receiving a new `openapi.json`, summarize which endpoints were added or changed before starting work
- Never guess at an endpoint that isn't in the spec — ask the user if something expected is missing
