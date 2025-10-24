# WADS Summer Quest — Splash Package

This zip contains a ready-to-use splash screen featuring your turkey in a vintage swimsuit.
Tapping the splash opens your app.

## Files
- `index.html` — the splash screen (orange background, big title, turkey image). On tap, it redirects to `app.html`.
- `app.html` — placeholder for your current app. Replace this with your actual app page.
- `assets/turkey_swimsuit.png` — the edited turkey image.

## Setup
1. Put your existing app HTML into `app.html` (or rename your current `index.html` to `app.html` here).
2. Deploy these files (e.g., GitHub Pages, Vercel, or your current host).
3. Open `index.html` — tap anywhere to launch the app.

## Options
- To embed the app under the splash (instead of redirect), open `index.html` and set:
  `const REDIRECT_URL = null;`
