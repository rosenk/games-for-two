Commit all requested changes. Fetch `origin` and rebase the current `main` branch onto `origin/main`. If a conflict changes behavior, stop and ask the user before resolving it.

Run `node --check app.js` and verify that `index.html`, `styles.css`, and `app.js` exist. Fix any failure before continuing.

Push `main` to `origin`. Then ensure a remote named `github` points to `https://github.com/rosenk/games-for-two.git`. Fetch `github`. If `github/main` contains commits that are not in local `main`, stop and ask the user instead of force-pushing. Otherwise, push the same `main` commit to `github/main` so GitHub Pages receives the shipped version.

Report the pushed commit and the public site URL. Never force-push. When complete, archive the thread.
