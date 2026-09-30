# Birdman UI

The repository uses npm workspaces. The existing Vite application lives in
`apps/birdman-admin`; the root package provides commands that delegate to it.

## Development

```sh
npm ci
npm run dev
```

## Build and verification

```sh
npm run build
npm run lint
npm run test:e2e
```

Playwright starts the Birdman Admin Vite app automatically. The end-to-end
tests mock the Bird Engine API and cover the existing admin navigation and
Habitat and Species CRUD flows.
