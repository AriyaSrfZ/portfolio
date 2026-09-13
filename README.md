# Ariya Sarrafzadeh — Portfolio

An Astro portfolio for a technical product manager working across fintech, data platforms, API products, and operations.

## Local preview

```sh
npm ci
npm run dev
```

## Deploy to Netlify

1. Push this folder to GitHub.
2. In Netlify, choose **Add new site → Import an existing project** and select the repository.
3. Netlify will use `netlify.toml` automatically (`npm run build`, publishing `dist`).
4. After Netlify gives the site a URL, add an environment variable named `SITE_URL` with that full URL (or your future custom domain), then redeploy.

## Updating content

- Update the introduction and contact links in `src/pages/index.astro`.
- Add/edit portfolio case studies in `src/content/blog/`. Each file needs a title, description, category, date, technologies, and optional metric.
- Keep case studies public-safe: do not add customer data, credentials, private keys, internal documents, or confidential technical details.
