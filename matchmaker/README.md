# Matchmaker deployment

The Cloudflare Worker only pairs waiting browsers. Game state, moves, and audio continue over the
existing PeerJS connection.

1. Sign in to a Cloudflare account with `npx wrangler login`.
2. Deploy the Worker with `npm run deploy:matchmaker`.
3. Push or manually run the GitHub Pages workflow to rebuild the site.

The production app uses `https://tic-tac-toe-matchmaker.rosen4obg.workers.dev`. Set
`VITE_MATCHMAKER_URL` only to override that endpoint for another environment.

`wrangler.jsonc` allows the production GitHub Pages origin `https://rosenk.github.io`. Add another
origin to `ALLOWED_ORIGINS` if the site moves to a custom domain.

For local development, run the processes in separate terminals:

```sh
npm run dev:matchmaker
VITE_MATCHMAKER_URL=http://localhost:8787 npm run dev
```
