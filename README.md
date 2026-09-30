# Birdman UI

The repository uses npm workspaces. The existing Vite application lives in
`apps/birdman-admin`; shared API contracts and error types live in
`packages/shared-types`. The root package provides commands that delegate to
the admin app.

## Development

```sh
npm ci
cp apps/birdman-admin/.env.example apps/birdman-admin/.env.local
npm run dev
```

Set `VITE_API_BASE_URL` in `apps/birdman-admin/.env.local` to configure the
Bird Engine API URL. It defaults to `http://localhost:3000` to preserve the
existing local development setup. The API client accepts an app-provided
authentication header callback when an authentication strategy is selected;
no authentication headers are sent by default.

## Build and verification

```sh
npm run build
npm run lint
npm run test:e2e
```

Playwright starts the Birdman Admin Vite app automatically. The end-to-end
tests mock the Bird Engine API and cover the existing admin navigation and
Habitat and Species CRUD flows.
