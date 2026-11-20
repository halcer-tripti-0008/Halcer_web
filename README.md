# Halcer Website

Production foundation for the Halcer company website: a TypeScript MERN monorepo with a React (Vite) client and an Express + MongoDB API.

> **Status:** architecture and infrastructure only. No pages, sections or visual design are implemented yet. The UI will be built from the Figma design.

---

## Contents

- [Technology stack](#technology-stack)
- [Architecture overview](#architecture-overview)
- [Folder structure](#folder-structure)
- [Getting started](#getting-started)
- [Commands](#commands)
- [Environment variables](#environment-variables)
- [Frontend architecture](#frontend-architecture)
- [Animation architecture](#animation-architecture)
- [API architecture](#api-architecture)
- [Performance & SEO](#performance--seo)
- [Code quality](#code-quality)
- [Further docs](#further-docs)

---

## Technology stack

| Area         | Choice                                                                     |
| ------------ | -------------------------------------------------------------------------- |
| Runtime      | Node.js ≥ 22.22 (developed on Node 26), npm workspaces                     |
| Language     | TypeScript 6.0 (strict), everywhere                                        |
| Client       | React 19, Vite 8 (Rolldown), React Router 8 (data mode)                    |
| Styling      | Tailwind CSS 4 (`@tailwindcss/vite`), `clsx` + `tailwind-merge` via `cn()` |
| Animation    | GSAP 3 + ScrollTrigger + CustomEase, `@gsap/react`, Motion 14, Lenis       |
| Server state | TanStack Query 5                                                           |
| Client state | Zustand 5 (installed; use only when genuinely needed)                      |
| Forms        | React Hook Form + Zod 4 (`@hookform/resolvers`)                            |
| HTTP         | Axios (single configured instance)                                         |
| Icons        | Lucide React                                                               |
| API          | Express 5, Mongoose 9, Zod 4                                               |
| Security     | Helmet, CORS allow-list, express-rate-limit, Mongoose `sanitizeFilter`     |
| Logging      | pino + pino-http (JSON in production, pretty in development)               |
| Tooling      | ESLint 10 (flat, type-aware), Prettier 3, Husky + lint-staged              |

## Architecture overview

```
Browser ──► Vite-built SPA (client/) ──► /api/v1/* ──► Express API (server/) ──► MongoDB
```

- **Monorepo, two apps.** `client/` and `server/` are independent npm workspaces with their own `package.json`, `tsconfig` and `.env`. Tooling (ESLint, Prettier, Husky) lives once at the root.
- **In development,** Vite proxies `/api` to the API, so the browser sees a single origin. **In production,** the client is static files (any CDN/static host) and the API runs as a Node process. `VITE_API_BASE_URL` points the client at it.
- **Shared contract.** Every API response uses one envelope (`{ success, message, data }` or `{ success: false, error }`), mirrored in `server/src/types/api.ts` and `client/src/types/api.ts`.

## Folder structure

```
halcer-web/
├── client/                         React SPA
│   ├── build/seoFiles.ts           Vite plugin: emits robots.txt + sitemap.xml at build
│   ├── public/                     Copied verbatim (favicons, OG images, static files)
│   ├── src/
│   │   ├── animations/             Animation INFRASTRUCTURE (non-visual)
│   │   │   ├── tokens.ts           Shared durations/easings/staggers for GSAP + Motion
│   │   │   ├── gsap/               Plugin registration, CustomEases, responsive helper
│   │   │   ├── motion/             MotionProvider, variants, transitions
│   │   │   └── lenis/              Lenis singleton, provider, useLenis, scrollToTarget
│   │   ├── assets/                 Imported assets (images/, fonts/, icons/), hashed by Vite
│   │   ├── components/
│   │   │   ├── ui/                 Design-system primitives (Button, Container, …)
│   │   │   ├── common/             Cross-cutting app components (Seo, PageLoader, errors)
│   │   │   ├── layout/             Header, Footer, Navigation
│   │   │   └── animations/         Reusable animated wrappers (Reveal, SplitText, …)
│   │   ├── config/env.ts           Validated public env
│   │   ├── constants/              routes.ts (route registry), navigation.ts, company.ts, breakpoints.ts
│   │   ├── content/                Page copy and data (home.ts), kept out of components
│   │   ├── hooks/                  Reusable hooks
│   │   ├── layouts/                Route layouts (RootLayout)
│   │   ├── lib/                    Configured clients: apiClient, queryClient, ApiClientError
│   │   ├── pages/                  Route entry points (one lazy chunk each; default export)
│   │   ├── providers/              AppProviders (composition root)
│   │   ├── router/                 Route table + RouteScrollManager
│   │   ├── sections/               Page sections composed by pages (Hero, Services, …)
│   │   ├── services/               API calls per domain + their TanStack Query hooks
│   │   ├── store/                  Zustand stores (only for true global client state)
│   │   ├── styles/index.css        Tailwind entry + @theme design tokens + base layer
│   │   ├── types/                  Shared TS types (API envelope, …)
│   │   ├── utils/                  Pure helpers (cn, formatters)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   └── vite.config.ts
├── server/                         Express API
│   └── src/
│       ├── config/                 env (validated), logger, cors
│       ├── constants/              HTTP status codes, API prefix
│       ├── database/               Mongoose connection lifecycle
│       ├── middlewares/            requestLogger, rateLimiter, validate, notFound, errorHandler
│       ├── modules/                Feature modules (routes + controller + service + model + schema)
│       │   └── health/
│       ├── routes/v1.ts            Mounts every module under /api/v1
│       ├── types/                  API envelope types
│       ├── utils/                  ApiError, sendSuccess
│       ├── app.ts                  Builds the Express app (no port binding, testable)
│       └── server.ts               Bootstrap: DB connect → listen → graceful shutdown
├── docs/                           Architecture & animation guides
├── eslint.config.js                One flat config for both apps
├── .prettierrc / .editorconfig / .gitattributes
└── package.json                    Workspaces + root scripts
```

**Where does new code go?**

| You are adding…                  | Put it in                                                      |
| -------------------------------- | -------------------------------------------------------------- |
| A new page/route                 | `pages/XPage.tsx` + `router/index.tsx` + `constants/routes.ts` |
| A block of a page from Figma     | `sections/<page>/XSection.tsx`                                 |
| A button, input, card, container | `components/ui/`                                               |
| Header/footer/nav                | `components/layout/`                                           |
| A reusable animated wrapper      | `components/animations/`                                       |
| A GSAP/Motion preset or utility  | `animations/gsap/` or `animations/motion/`                     |
| An API call                      | `services/<domain>.service.ts` (+ query hooks)                 |
| A new API resource               | `server/src/modules/<name>/` + register in `routes/v1.ts`      |

Folders that are still empty hold a `.gitkeep`. Delete it once real files exist.

## Getting started

Prerequisites: **Node.js ≥ 22.22**, **npm ≥ 10**, and a **MongoDB** instance: local `mongod`, Docker (`docker run -d -p 27017:27017 mongo:8`), or a MongoDB Atlas cluster.

```bash
npm install                                # installs both workspaces + sets up Husky hooks
cp client/.env.example client/.env         # then adjust values
cp server/.env.example server/.env         # set MONGODB_URI
npm run dev                                # API on :5000, client on :5173
```

Open http://localhost:5173. API health: http://localhost:5173/api/v1/health (proxied) or http://localhost:5000/api/v1/health.

> npm 11 blocks dependency install scripts by default. None are needed for this project (esbuild's postinstall only validates its binary). If a future dependency needs one, review it with `npm install-scripts ls`.

## Commands

All commands run from the repository root.

| Command                | What it does                                              |
| ---------------------- | --------------------------------------------------------- |
| `npm run dev`          | API (tsx watch) + client (Vite HMR) together              |
| `npm run dev:client`   | Client only                                               |
| `npm run dev:server`   | API only                                                  |
| `npm run build`        | Type-check + production build of both apps                |
| `npm run build:client` | → `client/dist/` (static files)                           |
| `npm run build:server` | → `server/dist/` (compiled JS)                            |
| `npm run typecheck`    | `tsc` for both apps, no output                            |
| `npm run lint`         | ESLint, zero warnings allowed                             |
| `npm run lint:fix`     | ESLint with autofix                                       |
| `npm run format`       | Prettier write                                            |
| `npm run format:check` | Prettier check (CI)                                       |
| `npm run check`        | typecheck + lint + format check (run before pushing / CI) |

Production run: `npm run build`, then `npm run start --workspace server` for the API, and serve `client/dist/` from a static host. Preview the client build with `npm run preview --workspace client`.

**Pre-commit:** Husky runs lint-staged, which runs ESLint `--fix` and Prettier on staged files only.

## Environment variables

`.env` files are git-ignored. Only `.env.example` files are committed. Both apps **validate configuration at startup and refuse to run** if it is invalid.

### `server/.env`

| Variable               | Default       | Notes                                                          |
| ---------------------- | ------------- | -------------------------------------------------------------- |
| `NODE_ENV`             | `development` | `development` \| `production` \| `test`                        |
| `PORT`                 | `5000`        |                                                                |
| `MONGODB_URI`          | (required)    | `mongodb://` or `mongodb+srv://`. Least-privilege user in prod |
| `CORS_ORIGINS`         | (required)    | Comma-separated allow-list of exact origins                    |
| `LOG_LEVEL`            | `info`        | pino level                                                     |
| `TRUST_PROXY`          | `0`           | Proxy hops to trust (set `1` behind a load balancer/CDN)       |
| `RATE_LIMIT_WINDOW_MS` | `900000`      | Global limiter window                                          |
| `RATE_LIMIT_MAX`       | `300`         | Requests per IP per window                                     |

Loaded with Node's built-in `--env-file-if-exists` (no `dotenv` dependency). In production, inject real environment variables through the platform. A `.env` file is optional there.

### `client/.env`

| Variable             | Notes                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL`  | `/api/v1` in dev (proxied). Absolute API URL in production if hosted on another origin |
| `VITE_SITE_URL`      | Canonical origin, used for canonical/OG URLs and the sitemap                           |
| `VITE_SITE_NAME`     | Used in `<title>` and Open Graph                                                       |
| `API_PROXY_TARGET`   | Dev only, not exposed to the browser                                                   |
| `SEO_ALLOW_INDEXING` | Build only. `true` **only** for production. Otherwise robots.txt blocks all crawlers   |

⚠️ Every `VITE_*` value is embedded in the public JavaScript bundle. Never put secrets in the client env.

Use `.env.production` / `.env.staging` files (Vite modes) or CI variables for per-environment values.

## Frontend architecture

- **Composition root:** `main.tsx` → `App.tsx` → `AppProviders` (TanStack Query → Motion → Lenis) → `RouterProvider`.
- **Routing:** `createBrowserRouter` (data mode). Pages load through React Router's route-level `lazy`, so each page is its own chunk, fetched in parallel with navigation. The current page stays visible until the next is ready (no loader flash). `HydrateFallback` covers only the very first load. `RouteErrorBoundary` catches render errors and failed chunk loads (e.g. stale tabs after a deploy). Route paths come from `constants/routes.ts`, never string literals.
- **Data fetching:** components → `services/*` (TanStack Query hooks) → `lib/apiClient.ts` (`apiRequest<T>()`). The API client unwraps the response envelope and normalizes every failure into `ApiClientError` (`status`, `code`, `details`, `requestId`). Query defaults: 5-minute `staleTime`, no refetch on focus, and retries only for network/5xx errors.
- **State:** server data lives in TanStack Query. Local UI state stays in components. Zustand is reserved for genuinely global client state (e.g. menu open, cursor state shared across distant components). Don't mirror server data into it.
- **Forms:** React Hook Form + `zodResolver(schema)`. Keep schemas next to the form (or in `services/` when shared with the API payload).
- **Styling:** Tailwind utilities. Design tokens from Figma go in the `@theme` block of `styles/index.css`. Compose classes with `cn()`.
- **Conventions:** components `PascalCase.tsx` with named exports. Pages default-export (required by `lazy`). Hooks `useX.ts`. Everything else `camelCase.ts`. Import through the `@/` alias across folders, and relatively within a folder.

## Animation architecture

Three libraries, each with one clear responsibility, sharing **one animation loop** and **one set of motion tokens**:

| Library    | Owns                                                                                |
| ---------- | ----------------------------------------------------------------------------------- |
| **Lenis**  | Smooth scrolling of the native window (single instance)                             |
| **GSAP**   | Scroll-driven animation (ScrollTrigger), timelines, pinning, scrubbing, text splits |
| **Motion** | Component-state animation: enter/exit, hover/tap, presence, page transitions        |

How they're wired:

1. `animations/gsap/setup.ts` registers `ScrollTrigger`, `CustomEase` and `useGSAP` **once**, creates `halcer.out` / `halcer.inOut` / `halcer.in` eases from `tokens.ts`, and sets GSAP defaults.
2. `animations/lenis/smoothScroll.ts` creates the **only** Lenis instance with `autoRaf: false`, drives it from `gsap.ticker` (one RAF loop), and calls `ScrollTrigger.update()` on every Lenis scroll. Lenis scrolls the real window, so ScrollTrigger and Motion's `useScroll` need no `scrollerProxy`.
3. `MotionProvider` wraps the app in `LazyMotion` (features loaded asynchronously, `strict`) and `MotionConfig reducedMotion="user"`.
4. Reduced motion is respected at every layer: Lenis (`respectReducedMotion`), Motion (`reducedMotion="user"`), GSAP (`createResponsiveAnimation` → `reduceMotion` condition), and CSS (global media query).

**The golden rules** (details and examples in [docs/animation-architecture.md](docs/animation-architecture.md)):

- Import GSAP **only** from `@/animations/gsap`, and write GSAP in React **only** inside `useGSAP(() => …, { scope })`.
- Use `m.div` (from `motion/react`), not `motion.div`. `strict` mode will throw otherwise.
- Never animate the **same property of the same element** with both GSAP and Motion.
- Never create another Lenis instance, never call `requestAnimationFrame` loops for scroll, never set `scroll-behavior: smooth`. Scroll programmatically with `scrollToTarget()`.
- Take durations/eases from `tokens.ts` (`GSAP_EASE`, `transitions`) so everything feels like one system.

## API architecture

- **Versioned REST:** everything under `/api/v1`, aggregated in `server/src/routes/v1.ts`. Plural resource nouns and standard verbs/status codes (`GET /api/v1/inquiries`, `POST` → `201`).
- **Feature modules:** `modules/<name>/` holds `<name>.routes.ts`, `.controller.ts` (HTTP only), `.service.ts` (business logic), `.model.ts` (Mongoose) and `.schema.ts` (Zod). Controllers stay thin. Services hold no `req`/`res`.
- **Middleware order:** request logger (request id) → Helmet → CORS → body parsers (100 kB limit) → rate limiter (on `/api/v1`) → routes → 404 → error handler.
- **Validation:** `validate({ body, query, params })` parses with Zod and replaces the request values with the parsed, stripped result.
- **Errors:** throw `new ApiError(HTTP_STATUS.X, message, CODE, details?)`. Express 5 forwards async rejections automatically, so there's no `try/catch` or `asyncHandler`. The central error handler maps `ApiError`, `ZodError`, Mongoose validation/cast errors, duplicate keys and body-parser errors into the envelope. Unknown errors become a 500 with no internals leaked (stack only outside production).
- **Responses:** `sendSuccess(res, { data, message?, statusCode?, meta? })`.
- **Observability:** every request gets an `X-Request-Id` (reused from a load balancer if present), logged and returned in error bodies. Auth headers and cookies are redacted from logs.
- **Lifecycle:** connect to MongoDB **before** listening (fail fast). Graceful shutdown on SIGTERM/SIGINT drains connections and closes Mongo, with a 10 s forced exit. `unhandledRejection` → graceful shutdown. `uncaughtException` → immediate exit for the process manager to restart.
- **Health:** `GET /api/v1/health` returns 200 when the DB is connected and 503 otherwise. Use it for load-balancer readiness checks.

Example module skeleton:

```ts
// modules/inquiries/inquiry.routes.ts
inquiryRouter.post('/', contactLimiter, validate({ body: createInquirySchema }), createInquiry);

// modules/inquiries/inquiry.controller.ts
export const createInquiry: RequestHandler = async (req, res) => {
  const inquiry = await inquiryService.create(req.body as CreateInquiryInput);
  sendSuccess(res, { data: inquiry, statusCode: HTTP_STATUS.CREATED, message: 'Inquiry received' });
};
```

## Performance & SEO

- **Code splitting:** one chunk per page, and Motion features plus the contact form (React Hook Form + Zod) load on demand. Core libraries ship in the entry chunk (~190 kB gzip). On Windows the Vite config normalises the drive-letter casing; without it, a build started from a lowercase `c:` directory bundles React twice and renders a blank page (see `docs/architecture-decisions.md`).
- **Metadata:** `<Seo title description image? noIndex? />` renders title, description, canonical, Open Graph and Twitter tags through React 19's native `<head>` hoisting (no helmet dependency). Render one per page. Don't add these tags to `index.html` or they will duplicate.
- **robots.txt / sitemap.xml:** generated at build by `client/build/seoFiles.ts` from `INDEXABLE_ROUTES` and `VITE_SITE_URL`, so they can't drift from the real routes or domain. Indexing is opt-in (`SEO_ALLOW_INDEXING=true`), so staging can never be indexed by accident.
- **Images:** keep sources in `src/assets/images` (hashed, cacheable). Export AVIF/WebP at 1×/2×, always set `width`/`height` (prevents CLS), use `loading="lazy"` + `decoding="async"` below the fold, and `fetchpriority="high"` on the LCP image. Add an image-optimisation plugin only when real assets arrive.
- **Fonts:** self-host WOFF2 in `src/assets/fonts` (or `public/fonts` for preloading), declare `@font-face` with `font-display: swap`, subset to the needed glyphs, and `<link rel="preload">` only the 1–2 above-the-fold faces in `index.html`.
- **Accessibility:** semantic landmarks (`<main id="main-content">` + skip link in `RootLayout`), visible `:focus-visible` outline, `role="status"` loaders, and reduced-motion support at every layer.
- **Full-screen sections (desktop ≥1024px):** every home section is at least one viewport tall (`screen-fit` utility, the `<Section>` default), with content vertically centered, so each background fills the screen. Taller content makes the section grow. Typography, spacing and images are never scaled to fit.
- **Rendering:** this is a client-rendered SPA. Major crawlers execute JavaScript, but social-preview scrapers (LinkedIn, Slack, X) don't, so they only see `index.html`. See _Remaining decisions_ in [docs/architecture-decisions.md](docs/architecture-decisions.md) about prerendering.

## Code quality

- TypeScript `strict` plus `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` (server), `noUnusedLocals/Parameters`, `verbatimModuleSyntax` and `erasableSyntaxOnly` (client).
- ESLint: `strictTypeChecked` + `stylisticTypeChecked`, React Hooks (including the React Compiler-aware rules), React Refresh and `consistent-type-imports`. Warnings fail the lint.
- Prettier with Tailwind class sorting (including inside `cn()`).
- `npm run check` must pass before merging.

## Further docs

- [docs/animation-architecture.md](docs/animation-architecture.md): how to write GSAP, Motion and Lenis code without conflicts
- [docs/architecture-decisions.md](docs/architecture-decisions.md): why each technical choice was made, plus open decisions
