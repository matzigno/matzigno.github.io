# Matteo Zignani — Academic Website

Static personal academic website designed for GitHub Pages.

## Local build

```bash
npm run build
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Update content

Edit `content/site.json`, then run:

```bash
npm run build
```

The build script generates `index.html`. Commit the generated file so GitHub Pages can serve the repository root directly.

## GitHub Pages

In the repository settings, enable Pages with **Deploy from a branch**, select the default branch, and use the root directory.
