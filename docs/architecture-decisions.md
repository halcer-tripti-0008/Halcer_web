# Architecture Decisions

Short records of non-obvious choices made while setting up the foundation (November 2026). Update this file when a decision changes.

## Decisions

### TypeScript pinned to 6.0.x (not 7.0)

TypeScript 7 (native compiler) is the latest release, but `typescript-eslint` 8.x supports only `<6.1`. Type-aware linting is worth more than the compiler speed-up, so we stay on 6.0.x until typescript-eslint supports 7. Then upgrade all three `typescript` entries together.

### React Router 8 (`react-router`), not `react-router-dom`

Since v7, `react-router-dom` is only a re-export of `react-router`. v8 has been stable for several months. We use **data mode** (`createBrowserRouter`) for route-level `lazy`, error boundaries and future loaders. We don't use framework mode: it would replace Vite's SPA setup with React Router's build pipeline. It remains the natural upgrade path if SSR/prerendering is adopted (see below).

### Route-level `lazy` instead of `React.lazy` + `<Suspense>`

The router fetches page chunks in parallel with navigation and keeps the current page rendered until the next is ready. There's no loader flash between pages, which matters for premium page transitions.

### Express 5, no `asyncHandler`

Express 5 forwards rejected promises and thrown errors from handlers to the error middleware natively, so a wrapper would be dead weight.

### Feature modules on the server instead of top-level `controllers/ services/ models/`

The suggested layout had both layer folders and a `modules/` folder. Having both splits one feature across five directories. We keep **shared infrastructure** at the top level (`config`, `middlewares`, `utils`, `database`) and **everything for one resource** in `modules/<name>/`.

### pino instead of Morgan

pino gives structured JSON logs (for log aggregation), request ids, and redaction of auth headers. Morgan only prints access lines. pino-pretty is a dev dependency, used only when `NODE_ENV=development`.

### Fail fast on database connection

The API connects to MongoDB **before** accepting traffic and exits if it can't. A process manager or orchestrator restarts it. The health endpoint reports 503 if the connection drops later.

### Mongoose `sanitizeFilter` instead of `express-mongo-sanitize`

`express-mongo-sanitize` is incompatible with Express 5 (`req.query` is read-only). Mongoose's built-in `sanitizeFilter` neutralises `$`-operator injection at the query layer.

### No `dotenv`

Node ≥ 22 loads env files natively (`--env-file-if-exists`). Both apps validate their env at startup. The server uses Zod. The client validates by hand, because Zod would add tens of kB to the entry bundle for three variables.

### No JWT/auth yet

No feature needs authentication today. When one does (e.g. an admin panel), add `modules/auth/` with httpOnly-cookie sessions or JWTs, plus `helmet`/CORS adjustments. CORS already has `credentials: true`.

### React 19 metadata instead of react-helmet

React 19 hoists `<title>`, `<meta>` and `<link>` rendered anywhere into `<head>`, so there's no dependency and no provider.

### `LazyMotion` + `m` components

This keeps the Motion runtime (~20 kB gzip) out of the entry bundle. The cost is a convention (`m.div`), enforced at runtime by `strict`.

### Lenis driven by the GSAP ticker

There's one RAF loop for scroll and animation, which removes frame-timing drift between Lenis and ScrollTrigger. Lenis's own `respectReducedMotion` handles accessibility, so it doesn't need to be conditionally mounted.

### Drive-letter casing normalised in the Vite config (Windows)

Production builds sometimes rendered a **blank page** ("Cannot read properties of null (reading 'useEffect')"). Root cause, found on 2026-11-20: Windows drive letters are case-insensitive, but the bundler compares module paths as strings. A build started from a lowercase `c:` working directory (VS Code's terminal often uses one) resolved some modules as `c:…
ode_modules
eact` and others, through the `@` alias, as `C:…
ode_modules
eact`. React was bundled **twice**, and libraries called hooks on the copy react-dom wasn't using. Proof: the same sources built from `c:` → broken (two Reacts, 612 kB), and from `C:` → correct (565 kB), every time.

Fix: `client/vite.config.ts` derives `root`, the env directory and the `@` alias from the config file's location with an uppercase drive letter, so the output is identical from any working directory. Earlier suspects (vendor chunk groups, the Oxc minifier, OneDrive) were wrong; their apparent effects were coincidences of which terminal ran the build.

### No manual vendor chunk groups

Vite 8 also applies `build.rolldownOptions.output.codeSplitting.groups` to the dev dependency pre-bundler. To keep config simple, Rolldown's automatic splitting (one chunk per lazy route / dynamic import) is used. Long-cached vendor chunks could be re-evaluated later now that the duplicate-React cause is fixed. If so, verify the production build in a browser.

### npm workspaces (no Turborepo/Nx)

Two apps don't need a task-graph tool. Revisit if packages (e.g. a shared `types` package) are added.

### Duplicated API envelope types

`ApiSuccessResponse` / `ApiErrorResponse` are mirrored in `client/src/types/api.ts` and `server/src/types/api.ts` instead of creating a shared package for ~20 lines. If shared types grow (DTOs, Zod schemas used on both sides), extract a `packages/shared` workspace.

## Remaining decisions (need product/infra input)

1. **Prerendering / SSR.** A client-rendered SPA is invisible to social-preview scrapers and slower for first paint than static HTML. For a marketing site, prerendering the public routes at build time is strongly recommended once pages exist. The lowest-friction path is React Router framework mode with `prerender`, or a Vite prerender plugin.
2. **Hosting.** Static host/CDN for `client/dist` (e.g. Vercel, Netlify, Cloudflare Pages, S3 + CloudFront) plus a Node host for the API (e.g. Render, Fly.io, Railway, a container platform). Set `TRUST_PROXY`, `CORS_ORIGINS` and an absolute `VITE_API_BASE_URL` accordingly. Configure the static host to serve `index.html` for unknown paths (SPA fallback) and long-term cache headers for `/assets/*`.
3. **MongoDB.** MongoDB Atlas (recommended) or self-hosted. Create a least-privilege database user.
4. **Testing.** No test runner is installed yet (no logic to test). Recommended: Vitest + Testing Library (client), Vitest + Supertest against `createApp()` (server), Playwright for critical flows and animation smoke tests.
5. **CI.** Run `npm ci && npm run check && npm run build` on every PR.
6. **Design tokens and fonts** from Figma → `@theme` in `client/src/styles/index.css`, plus font files and preloads.
7. **Analytics / error monitoring** (e.g. Plausible, Sentry), once privacy requirements are known.
