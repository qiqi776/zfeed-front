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

The app opens the homepage at `/` and uses modern routes such as `/following`, `/profile?user=me`, and `/detail?type=article`.

## Verification

```bash
npm test
npm run lint
npm run build
npm run test:e2e
```
