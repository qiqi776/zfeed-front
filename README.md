# zfeed-front

zfeed-front is a React implementation of the zfeed prototype pages.

## Project Structure

- `src/pages/`: page-level TSX components.
- `src/routes/`: route helpers for the app's modern URL paths.
- `src/runtime/`: shared page shell behavior such as document metadata, page styles, and delegated interactions.
- `src/styles/`: global Tailwind styles.

## Development

```bash
npm install
npm run dev
```

The app opens the session gateway at `/`. A valid local session is restored with `GET /v1/users/me` and enters `/home`; an unauthenticated first visit redirects to `/login`, where the login and register entries share the frosted-home backdrop. The recommend feed lives at `/home`, with product routes such as `/following`, `/me`, `/user/:userId`, `/content/:contentId`, `/me/edit`, `/search`, `/compose`, and `/settings`.

## Verification

```bash
npm test
npm run lint
npm run build
npm run test:e2e
```
