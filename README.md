# Portfolio site (static)

The live site files live in **`my-website/`**. This repo is wired so **Netlify** can deploy that folder automatically whenever you push to GitHub.

## One-time setup

### 1. Create a GitHub repository

On GitHub: **New repository** → name it (e.g. `portfolio`) → create it **without** adding a README (avoids merge conflicts).

### 2. Push this project from your machine

In a terminal (replace `YOUR_USER` and `YOUR_REPO`):

```bash
cd "/Users/sagarv/Product management ai/test cursor 1"
git init
git add .
git commit -m "Initial site and Netlify config"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

If GitHub shows SSH instead of HTTPS, use your SSH remote URL.

### 3. Connect Netlify (auto-deploy on every push)

1. Log in at [app.netlify.com](https://app.netlify.com).
2. **Add new site** → **Import an existing project** → **GitHub** → authorize → pick this repo.
3. Netlify reads **`netlify.toml`**: **Publish directory** is already `my-website`. Leave **Build command** empty.
4. **Deploy site**. You get a URL like `https://random-name.netlify.app`.

After this, every `git push` to `main` updates the live site in about a minute.

### 4. Optional: custom domain

In Netlify: **Domain settings** → add your domain and follow DNS instructions.

---

## Vercel instead of Netlify

1. [vercel.com](https://vercel.com) → **Add New** → **Project** → import the same GitHub repo.
2. **Root Directory** → **Edit** → set to **`my-website`**.
3. **Framework Preset** → **Other**. Leave build/output as default for static.
4. Deploy. Future pushes redeploy automatically.

---

## More detail

See **`my-website/DEPLOY.md`** (drag-and-drop, GitHub Pages, Cloudflare Pages).
