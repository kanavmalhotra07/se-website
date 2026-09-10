# Sanchi Enterprises — email signature

Kanav Malhotra · Second Generation Leader

The current design (**v2**) is a **solid navy block, 600px wide**, with a cream
reverse logo on the left and light type on the right. It is not a
light-background signature — that was v1, kept as a rollback point.

| File | Purpose |
|---|---|
| `signature.html` | The signature. This is what gets copied into Gmail/Yahoo. |
| `signature-plain.html` | Fallback: light background, no logo, no navy block, single column. Use if Yahoo mangles the table version. |
| `signature-mobile.txt` | Plain-text fallback. URLs are visible here because there is no markup to hide them behind. |
| `preview.html` | Local test harness, seven render states. **Not shipped, never pasted anywhere.** |
| `assets/se-sig-logo-reverse-plate-v1.png` | **The live asset.** Cream reverse mark on a baked-in `#1B2A6B` plate, 240×150, **no transparency**, displayed at 120×75. |
| `assets/se-sig-logo-reverse-v1.png` | Transparent cream reverse mark from the first v2 build. **Deployed but no longer referenced — retained deliberately. Do not delete.** |
| `assets/se-monogram-alpha.png` | Untouched transparent master. Both logos derive from this. |
| `assets/se-sig-logo-v1.png` | Navy mark from v1. **Deployed but no longer referenced — retained deliberately. Do not delete.** |

## Permanent asset URL

```
https://www.sanchienterprises.com/images/email/se-sig-logo-reverse-plate-v1.png
```

Hardcoded in `signature.html` and baked into every email sent from this
signature. `se-sig-logo-reverse-plate-v1.png` is **permanent** — never rename,
move, or delete it. Any future change ships under a new filename with a new URL.

The **www** host matches the website link, so neither takes a redirect hop.

### The superseded assets

```
https://www.sanchienterprises.com/images/email/se-sig-logo-reverse-v1.png
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

1. Copy `assets/se-sig-logo-reverse-plate-v1.png` into the website repo at
   `public/images/email/se-sig-logo-reverse-plate-v1.png`. Commit and **push** —
   the deploy is what publishes it.

2. Verify `https://www.sanchienterprises.com/images/email/se-sig-logo-reverse-plate-v1.png`
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
   and the type is darkened, but the `<img>` is left alone. This is the case the
   navy plate exists for. See below.

### Panel 6 is the known weakness

If a client strips the container's `bgcolor` and `background-color`, the navy
ground disappears and the light type is left on white:

| Element | Contrast on white |
|---|---|
| Name `#FFFFFF` | **1:1 — invisible** |
| `SANCHI ENTERPRISES` and alt text `#F7F6F3` | **1.08:1 — invisible** |
| Contact values `#DCE0EE` | Barely perceptible |
| LinkedIn `#D4B563`, gold rule, hairline | Readable |

The recipient's name and the company name vanish. This is structural to any
light-on-dark design and has no fallback — unlike v1, where losing the logo
still left navy text on white. Some corporate Outlook/Exchange configurations
and a few aggressive webmail sanitisers do strip background colours. If that
turns out to matter in testing, `email-signature-v1` is the rollback.

Note that the **logo itself survives panel 6** now that it carries its own navy
plate — losing the container background no longer takes the mark with it.

### Why the logo is a plate, not a transparent PNG

The Gmail mobile app applies a *partial* inversion: it lightens the container's
navy and darkens the type, but leaves images untouched. A transparent cream mark
has no ground of its own, so it inherited the lightened container and washed out
to near-invisible — cream on lavender.

Baking `#1B2A6B` into the PNG makes the image self-sufficient: the mark always
sits on its own navy regardless of what the client does to the surrounding
cell. In normal rendering the plate is pixel-identical to the block behind it
(both `#1B2A6B`) so there is no visible seam; under partial inversion it reads
as a deliberate navy tile rather than an empty gap.

The cost is that under a **full** inversion (panel 3) the plate inverts along
with everything else instead of staying navy. That is the correct tradeoff:
full inversion still leaves the mark legible, whereas partial inversion did not.

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
| `email-signature-v2` | `20395fc` | 600px navy block, cream reverse logo on a transparent PNG |
| `email-signature-v1` | `d3d90cd` | Light background, navy logo. Rollback point. |
