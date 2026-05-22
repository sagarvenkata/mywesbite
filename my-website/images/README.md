# Hero avatar (same for every visitor)

The hero uses **`avatar.png`** in this folder. Use a **square-ish** headshot (PNG or JPEG); keep the filename and `src` in `index.html` in sync (`images/avatar.png` or `images/avatar.jpg`).

**Important:** The file extension must match the real image format. A PNG saved as `.svg` will break in the browser (wrong `Content-Type` on hosts like Netlify).

To switch format:

1. Save your photo as **`avatar.jpg`** or **`avatar.webp`** (or keep **`avatar.png`**).
2. In `index.html`, set the hero `<img>` `src` to match (e.g. `images/avatar.jpg`).
3. Commit and deploy.
