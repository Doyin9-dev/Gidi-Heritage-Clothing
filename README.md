# Gidi Heritage Clothing

A Lagos-inspired fashion storefront for The Lagos Edit. It includes a filterable collection, product search, front-and-back photos, and a shopping bag that stays on the visitor’s device.

## Run locally

Requires Node.js 22.12 or later.

```sh
npm ci
npm run dev
```

## Checks and deployment

```sh
npm test           # Catalog, search, and bag logic
npm run build      # Outputs a static site in dist/
npm run preview    # Serves the built site locally
```

Deploy the contents of `dist/` to a static host. No server or environment variables are required for this preview.

### GitHub Pages

A repository admin must set **Settings → Pages → Source** to **GitHub Actions** once. The **Publish storefront** workflow builds and deploys from `arena/4c302fdf-gidi-heritage-clothing` on a push to that branch. If the `github-pages` environment restricts deployment branches, allow that branch. The workflow’s deployment summary shows the public URL after a successful run.

## Storefront content

- `src/catalog.js` contains four separate GH listings at ₦20,000 each: black and white tank tops and black and white ringer tees. Sizing and fabric details are left unpublished until confirmed.
- The order review is a demo: it does not take payments or create orders. The newsletter form does not store or send email addresses.

For a public shop, add confirmed sizing, product care, contact information and store policies, and connect inventory, checkout, and any mailing-list provider.

## Add your own photos and logo

The site uses only your uploaded logo and photos. If there is no logo file, it shows the business name as text. Photo slots remain open until you add the matching files.

Add your own files to `src/uploads/`, with one file per slot. Use a lowercase `.jpg`, `.jpeg`, `.png`, `.webp`, or `.avif` extension. The logo can also be `.svg`.

| Filename before the extension | Where it appears |
| --- | --- |
| `logo` | Site header and browser tab icon |
| `lagos-campaign` | Homepage campaign panel (landscape) |
| `atelier` | Our Story panel (landscape) |
| `gh-tank-white` | White GH Tank Top (front and back) |
| `gh-tank-black` | Black GH Tank Top (front and back) |
| `gh-ringer-white` | White GH Ringer Tee (front and back) |
| `gh-ringer-black` | Black GH Ringer Tee (front and back) |

The site picks up these files when you restart the dev preview or rebuild for deployment. Only add files you want to publish.
