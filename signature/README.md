# Sanchi Enterprises — email signature

Kanav Malhotra · Second Generation Leader

The current design (**v3**) is a **solid navy block, 600px wide**: cream reverse
logo on the left, a 1px vertical rule, then the type column on the right. It is
not a light-background signature — that was v1, kept as a rollback point.

v3 refines v2: a vertical divider between the two columns, a gold company
eyebrow over a thinned gold rule, an 18px name, and a denser credentials line.

| File | Purpose |
|---|---|
| `signature.html` | The signature. This is what gets copied into Gmail/Yahoo. |
| `signature-plain.html` | Fallback: light background, no logo, no navy block, single column. Use if Yahoo mangles the table version. |
| `signature-mobile.txt` | Plain-text fallback. URLs are visible here because there is no markup to hide them behind. |
| `preview.html` | Local test harness, seven render states. **Not shipped, never pasted anywhere.** |
| `assets/se-sig-logo-reverse-v1.png` | **The live asset.** Cream reverse mark, 240×150, transparent, displayed at 120×75. |
| `assets/se-sig-logo-reverse-plate-v1.png` | Cream mark on a baked-in `#1B2A6B` plate. Built to survive the Gmail app's partial inversion, then **rejected on aesthetics** — a navy tile on a lightened container looks worse than a washed-out mark. **Deployed but no longer referenced — retained deliberately. Do not delete.** |
| `assets/se-monogram-alpha.png` | Untouched transparent master. Both logos derive from this. |
| `assets/se-sig-logo-v1.png` | Navy mark from v1. **Deployed but no longer referenced — retained deliberately. Do not delete.** |

## Permanent asset URL

```
https://www.sanchienterprises.com/images/email/se-sig-logo-reverse-v1.png
```

Hardcoded in `signature.html` and baked into every email sent from this
signature. `se-sig-logo-reverse-v1.png` is **permanent** — never rename, move,
or delete it. Any future change ships under a new filename with a new URL.

The **www** host matches the website link, so neither takes a redirect hop.

### The superseded assets

```
https://www.sanchienterprises.com/images/email/se-sig-logo-reverse-plate-v1.png
https://www.sanchienterprises.com/images/email/se-sig-logo-v1.png
```

Both still deployed and still serving. Nothing references either one, but
**every email already sent still points at whichever was current at the time**.
Deleting them would retroactively break the logo in mail already sitting in
people's inboxes. Leave them in place.

## Links used in the signature

| Field | Visible text | `href` |
|---|---|---|
| Mobile | `+91 99581 32189` | `tel:+919958132189` |
| Email | `sanchi.enterprises@yahoo.com` | `mailto:sanchi.enterprises@yahoo.com` |
| Website | `sanchienterprises.com` | `https://www.sanchienterprises.com` |
| LinkedIn | `LinkedIn` | `https://www.linkedin.com/in/kanavmalhotra07/` |
| LinkedIn | `Company Page` | `https://www.linkedin.com/company/sanchinterprises/` |

The website link resolves to the **www** host while the visible string stays bare
(no protocol, no `www`). Keep those two separate if you ever edit the line.

## Install

1. Copy `assets/se-sig-logo-reverse-v1.png` into the website repo at
   `public/images/email/se-sig-logo-reverse-v1.png`. Commit and **push** —
   the deploy is what publishes it. *(Already deployed — this step only matters
   for a fresh environment.)*

2. Verify `https://www.sanchienterprises.com/images/email/se-sig-logo-reverse-v1.png`
   loads **in an incognito window**. If it 404s or asks for auth, every
   signature is silently broken and you will not see it in your own outbox.

   **Site deploys take roughly 50 seconds.** A freshly pushed asset will 404 on
   the first check or two — that is the build still running, not a failure. Wait
   and retry before concluding anything is wrong.

3. Open `signature.html` in Chrome.

4. `Cmd/Ctrl+A`, then `Cmd/Ctrl+C` — this copies the **rendered page**, not the
   source. Never paste raw HTML source into a signature box; both Gmail and
   Yahoo treat it as literal text and you will end up mailing people your markup.

5. **Gmail:** Settings → See all settings → General → Signature → paste.
   Set it to insert *before* quoted text. Turn off the `--` prefix.

6. **Yahoo:** Settings → More Settings → Mailboxes → select account → Signature →
   enable rich text → paste. If it mangles the layout, use
   `signature-plain.html` instead (same steps 3–4).

## Testing before install

Open `preview.html` in Chrome. Seven states, each stage 620px wide:

1. White `#FFFFFF`
2. Webmail canvas `#F1F1F1`
3. **Outlook.com forced inversion** — the whole body is inverted, logo included.
   This *flatters* the design; it is not the failure case.
4. **Images blocked** — the `<img>` is still there but points at a broken path.
   `Sanchi Enterprises` renders in cream `#F7F6F3` where the logo would be.
5. **Gmail / Apple Mail dark** — image left untouched.
6. **`bgcolor` stripped** — the worst case for the *type*. See below.
7. **Gmail app partial inversion** — the container is lightened toward lavender
   and the type is darkened, but the `<img>` is left alone. See below.

### Panel 6 is the known weakness

If a client strips the container's `bgcolor` and `background-color`, the navy
ground disappears and the light type is left on white:

| Element | Contrast on white |
|---|---|
| Name `#FFFFFF` | **1:1 — invisible** |
| Alt text `#F7F6F3` (images blocked) | **1.08:1 — invisible** |
| Contact values `#DCE0EE` | Barely perceptible |
| `SANCHI ENTERPRISES` `#C9A961` | Readable — improved in v3 |
| LinkedIn `#D4B563`, gold rule, vertical divider, hairline | Readable |

The recipient's name still vanishes. This is structural to any light-on-dark
design and has no fallback — unlike v1, where losing the logo still left navy
text on white. Some corporate Outlook/Exchange configurations and a few
aggressive webmail sanitisers do strip background colours. If that turns out to
matter in testing, `email-signature-v1` is the rollback.

v3 improves this panel twice over: the company eyebrow went gold `#C9A961`,
which is readable on white where cream `#F7F6F3` was not, and the **vertical
divider survives** in navy `#38457F`, so the two-column structure holds even
with no background.

### Panel 7 — the Gmail app, accepted as-is

The Gmail mobile app applies a *partial* inversion: it lightens the container's
navy and darkens the type, but leaves images untouched. The transparent cream
mark has no ground of its own, so it inherits the lightened container and washes
out to a faint ghost.

**This is accepted and deliberately not fixed.** A navy-plated PNG
(`se-sig-logo-reverse-plate-v1.png`) does solve it — the image carries its own
background and stays crisp — but it reads as a hard navy tile sitting on a
lavender block, which was judged worse than a faded mark. The plate is kept in
the repo, unreferenced, if that call is ever revisited.

The type, the gold eyebrow, the gold rule and the vertical divider all survive
this panel, so the signature still reads correctly; only the mark fades.

### The vertical divider

A 1px cell between the logo and type columns, `bgcolor="#38457F"`, with
`font-size:0;line-height:0` so no client injects a text line into it. Gutters
are 18px on each side:

```
120 logo | 18 | 1px divider | 18 | 387 type   = 544
```

The type column narrowed from 406px to 387px to absorb the divider and the
second gutter; the 600px outer width and 28px padding are unchanged.

The cell carries `height="170"` *and* `height:170px`. In table layout a cell
height is a **minimum**, not a fixed value, so this is deliberately belt-and-
braces: the divider stretches to the row height wherever the row is taller than
170px, and where a client renders the type column *shorter* than 170px the
explicit height still holds the rule at full length instead of leaving a stub.
Either way the line is continuous. Measured at 170.4px in Chrome — stretched to
the row, not pinned to the attribute, which is the behaviour being relied on.

**Outlook for Windows is unverified.** The Word engine computes line-height
differently, so the type column's natural height there is not necessarily
170px, and the harness runs in Blink — it cannot answer this. The construction
is the standard faux-column approach and the minimum-height semantics are what
protect it, but the only real test is sending a message to an Outlook/Windows
account and looking at it. If the rule turns out to break there, delete the
divider cell and both 18px gutters and restore the type column to 406px —
degrading to no divider is clean, and that is the documented fallback.

## Why it is built this way

Properties of email clients, not style preferences — each fails silently in some
subset of inboxes if broken:

- **Nested tables only.** Outlook for Windows uses the Word engine: no flexbox,
  grid, float, `position`, or `border-radius`.
- **All CSS inline.** Gmail strips `<style>` blocks, classes and IDs on paste.
- **No web fonts.** Arial/Helvetica everywhere.
- **No base64 images.** Gmail and Outlook strip them, hence the hosted URL.
- **No MSO conditional comments.** Installation pastes *rendered* output, which
  strips HTML comments, so the design cannot depend on them.
- **Images carry both HTML attributes and matching inline styles.** Outlook
  ignores CSS-only sizing.
- **The `<img>` carries its own type styling** (`font-size:13px`, bold,
  `#F7F6F3`). The logo `<td>` is `font-size:0;line-height:0` to kill the
  descender gap — but alt text inherits type from the *image's own box*, so
  without this the alt string draws at 0px and is invisible whenever images are
  blocked. Keep both.
- **Padding is spacer cells only — never inline `padding` as well.** Browsers
  apply both and they stack, which silently doubles the inset. The block is
  600px wide with 28px spacer cells on all four sides, giving a 544px content
  area (120px logo + 18px gutter + 406px text column, all set explicitly).
- **The container carries `bgcolor` *and* inline `background-color`.** Some
  clients honour only one.
- **Width is a fixed 600px — no `width="100%"`, no `max-width`.** The Word
  engine ignores `max-width`, so a percentage width would stretch to the full
  reading pane uncapped. 600px is the standard email content width; iOS Mail
  zooms the message so the widest element fits, which is what makes the block
  read full-bleed on a phone. The tradeoff is that it **does** scroll
  horizontally at a 320px desktop viewport — that is expected, not a defect.
- **Rules are `bgcolor` cells with `font-size:0;line-height:0`.** Without that,
  Outlook injects a text line-height and a 2px rule becomes a fat bar.

## Versions

| Tag | Commit | Design |
|---|---|---|
| `email-signature-v2` | `20395fc` | 600px navy block, cream reverse logo, no divider |
| `email-signature-v1` | `d3d90cd` | Light background, navy logo. Rollback point. |
