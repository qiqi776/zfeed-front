# zfeed-front

zfeed-front is a React migration of the original static zfeed HTML prototypes.

## Project Structure

- `legacy-html/`: original HTML prototypes kept as visual references.
- `src/`: React application shell and migration utilities.
- `src/legacy/`: HTML parsing and legacy route compatibility helpers.
- `src/styles/`: global Tailwind and compatibility styles.

## Development

```bash
npm install
npm run dev
```

The app keeps legacy URLs such as `/following.html`, `/profile.html?user=me`, and `/detail.html?type=article` working through the React entrypoint.

## Verification

```bash
npm test
npm run build
```
