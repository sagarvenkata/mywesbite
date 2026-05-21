# Profile photo (visible to everyone on the web)

The hero avatar loads from **avatar.jpg** in this folder.

1. Export a square-ish headshot (at least 400x400 pixels is plenty).
2. Save it here as **avatar.jpg** (JPEG). You can also use **avatar.webp**; if you do, change `data-default-src` on the `img` with id `intro-avatar-img` in `index.html` to `images/avatar.webp`.
3. Commit the image with your site and deploy as usual.

Why: "Upload photo" in the browser only saves to that visitor's device (localStorage). For anyone on the web to see your picture, the image file must live in the project (or on a CDN) and be referenced from the page.
