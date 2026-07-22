## Done
- Filter pills (`.filters button`, "Everything / Find communities / Find know-how / Find experts") — bumped to a real 44px tap target (was ~33px: 9px padding + 12.8px text) via padding + min-height + flex-center; font 12.8px→14px for easier tapping. Visible: screen 1 bottom / screen 2 top (row of pill buttons right below the lede).
- Card description text (`.rcard p`) — 15.2px was under the 16px reading floor; now fluid 16→18px. Visible: screen 2 (FIC and GEN card bodies).
- "Visit ___→" CTA link (`.rcard .visit`) — was 11.8px text with almost no vertical hit area (2px padding-bottom only); now 13px with 15px top/bottom padding (~48px tap height). Visible: screen 2, bottom of each card.
- "This directory is young…" reminder box (`.young`) — 14.4px was under the 16px reading floor; now 16px. Visible: screen 3 (dashed box above the footer).
- Shared "↑ back to the tower" pill (`.wback`, injected by site-nav.js) — resources.html's own audit entry in report.json flags it at 9.6px tiny-text; bumped to 14px + more padding, scoped to `html.m-resources` only so no other page is affected even though the element comes from shared JS. Visible: screen 1, over the hero banner.

## Proposed (not done)
- None — everything the audit + screenshot surfaced for this page was fixable with CSS alone.

## Flags
- The hero eyebrow ("COLIVING ATLAS · RESOURCES") sits partly over the still-visible (not-yet-faded) part of the banner image before the `.wveil` gradient goes solid. It reads OK in the screenshot but it's a tight margin — worth a contrast check if this pattern (shared `.wband`/`.wbandwrap`, used on every "commons/atlas"-scene page) gets audited site-wide, since a per-page fix here wouldn't fix the same pattern elsewhere.
- `.tag` font-size was already fixed sitewide in `mobile.css` (round 2, `html.m-resources .tag`) before this pass — left untouched, no duplicate rule added.
- `resources.html` is the shortest page on the site (pageHeight 1949 vs 5000-14000+ elsewhere) — young/seed content, so this pass is necessarily light; expect more mobile work here as `resources-data.js` grows.
