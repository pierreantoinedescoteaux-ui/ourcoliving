# Co-living Portfolio — Pierre-Antoine Descoteaux

A no-build static portfolio. **Content and design are separate layers** so you can
re-skin the look later without ever touching the writing.

## See it
Double-click `index.html`. That's it — no install, no toolchain.

## The three files you might touch
| File | What it holds | When you edit it |
|---|---|---|
| `data.js` | **All the words and which photos go where.** | Every content change. |
| `styles.css` | **The entire look** (colors, fonts, spacing). | When we re-skin. |
| `app.js` | Turns content into the page. | Almost never. |

## How to add your content
Open `data.js` in any text editor.
1. Rewrite anything marked `[edit]`.
2. For each image, drop the photo file into an `images/` folder next to these files,
   then set `src: "images/your-photo.jpg"`. Leave `src: ""` and the page shows a
   labeled placeholder telling you exactly what photo is missing.

## Your photo-gathering checklist (the placeholders on the live page)
Each grey hatched box on the site = one photo to find. Current list:
- **Montreal:** hero shot, a before/after room, a focused-work space, a connection space, a coworking area, a signature event (pitch night / music jam), a full-house moment.
- **Dunbar (Growth Hub):** exterior or standout architectural detail, a unique element of the house, the coworking space, the ad/listing creative you made, a strong event photo.
- **Shaughnessy:** exterior showing scale, an impressive interior, the grounds or guest house.

## Deploy later (free)
Drag this folder onto [Netlify Drop](https://app.netlify.com/drop) → instant live URL.
Re-drag to update. No account math, no servers.

## Parked (don't lose these)
- **Old business plan** from your studies on the co-living business — save as a resource even though it's dated; mine later for anything reusable.
- House **names** — confirm the Montreal house name; confirm years for the Vancouver houses.
- Decide whether the **Shaughnessy** project stays (you managed it only briefly).
