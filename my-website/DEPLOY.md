# Put this site on the web

This folder is a **static site** (HTML, CSS, JavaScript). No server code is required. You only need **hosting** that serves these files over HTTPS.

**Important:** Whatever you deploy, the **root** of the live site should contain `index.html`, `style.css`, `script.js`, and your `images/` folder (same layout as this folder). If you use GitHub Pages from the repo root, either move these files to the repo root or use a host that lets you set the **publish directory** to `my-website`.

---

## Option 1 — Netlify (fast, free)

### Drag and drop (no Git required)

1. On your computer, open the `my-website` folder and add your photo as `images/avatar.jpg` (see `images/README.md`).
2. Zip **the contents** of `my-website` (so the zip opens to `index.html` at the top level, not a single nested `my-website` folder).
3. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop) and sign up / log in.
4. Drag the zip onto the page. Netlify gives you a URL like `https://random-name.netlify.app`.
5. In Netlify: **Site settings → Domain management** to rename the subdomain or add a custom domain later.

### From Git (updates on every push)

1. Put the project in a GitHub repository (you can keep `my-website` as a subfolder).
2. In Netlify: **Add new site → Import an existing project** → pick the repo.
3. Build settings: **Base directory** = `my-website` (if the repo root is not the site). **Build command** = leave empty. **Publish directory** = `.` (if base is `my-website`) or `my-website` (if base is repo root and Netlify expects publish dir relative to root — check Netlify UI: publish directory is usually relative to repo root, e.g. `my-website`).
4. Deploy. Your site URL is on the dashboard.

---

## Option 2 — GitHub Pages

GitHub Pages serves either the repo root, the `/docs` folder on `main`, or a `gh-pages` branch.

**Easiest structure for Pages:** copy (or move) everything inside `my-website` into a `docs` folder at the **repository root**, then enable Pages from `/docs`.

1. Repository on GitHub with `docs/index.html`, `docs/style.css`, etc.
2. Repo **Settings → Pages**.
3. **Build and deployment**: Source = **Deploy from a branch**, Branch = `main`, Folder = **`/docs`**.
4. Save. The site will be at `https://<username>.github.io/<repo-name>/` (note the subpath — asset paths like `images/avatar.jpg` still work if they are relative).

If the site must live at the **root** of `username.github.io` (user site), the files must be in a repo named `<username>.github.io` at the **root** of that repo (not in `my-website`).

---

## Option 3 — Cloudflare Pages

1. Sign in at [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → Connect Git.
2. Select the repo; set **Root directory** to `my-website` if the site is not at the repo root.
3. Build command: none (or `exit 0`). Output directory: `/` or `.` depending on the UI (same folder as `index.html`).
4. Deploy and use the provided `*.pages.dev` URL.

---

## Option 4 — Vercel

1. [vercel.com](https://vercel.com) → New Project → import Git repo.
2. **Root Directory**: set to `my-website` if needed.
3. Framework preset: **Other**; leave build command empty; output is the static root.
4. Deploy.

---

## Checklist before you share the link

- [ ] `images/avatar.jpg` is in the repo (or zip) if you want the headshot for **everyone** (not only your browser).
- [ ] Open the live URL in an **incognito/private** window to confirm it looks right (no reliance on your own `localStorage`).
- [ ] Click through sections and the theme toggle once on the live URL.

---

## Custom domain (optional)

Buy a domain (Google Domains, Namecheap, Cloudflare Registrar, etc.), then in Netlify / Cloudflare / Vercel use their **Custom domains** UI and follow their DNS instructions (usually a `CNAME` or `A` record). HTTPS is usually automatic.

---

## Summary

| Approach | Best for |
|----------|----------|
| **Netlify Drop** | Fastest first publish, no Git |
| **Netlify / Vercel / Cloudflare + Git** | Automatic deploys when you push |
| **GitHub Pages** | Already using GitHub; okay with `docs/` or root layout |

All of these give you a public HTTPS URL you can send to anyone.
