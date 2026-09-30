# Birdman UI

The repository uses npm workspaces. The existing Vite application lives in
`apps/birdman-admin`; shared API contracts and error types live in
`packages/shared-types`. The root package provides commands that delegate to
the apps. The Explorer application lives independently in
`apps/birdman-explorer`; the apps have separate entry points, routers, and
shells. The shared `Card` and `LoadingSpinner` primitives live in
`packages/shared-ui`; admin-specific buttons and form controls remain in the
Admin app.

The Admin app uses file-based TanStack Router routes for `/habitats`,
`/species`, and `/users`. The root route redirects to `/habitats`.

## Development

```sh
npm ci
cp apps/birdman-admin/.env.example apps/birdman-admin/.env.local
npm run dev
```

To run Birdman Explorer instead:

```sh
cp apps/birdman-explorer/.env.example apps/birdman-explorer/.env.local
npm run dev:explorer
```

Set `VITE_API_BASE_URL` in each app's `.env.local` file to configure its Bird
Engine API URL. Both default to `http://localhost:3000`. The shared API client
accepts an app-provided authentication header callback when an authentication
strategy is selected; no authentication headers are sent by default.

## Build and verification

```sh
npm run build
npm run build:explorer
npm run build:all
npm run lint
npm run test:e2e
npm run test:e2e:explorer
```

Playwright starts the Birdman Admin Vite app automatically. The end-to-end
tests mock the Bird Engine API and cover the existing admin navigation and
Habitat and Species CRUD flows.

Explorer has a separate build output and Playwright config; it starts with
public habitat and species browsing, including their detail pages.

The Admin and Explorer builds are written to
`apps/birdman-admin/dist` and `apps/birdman-explorer/dist`, respectively, so
they can be deployed as independent static frontends. Use `npm run preview`
or `npm run preview:explorer` to preview each build.
