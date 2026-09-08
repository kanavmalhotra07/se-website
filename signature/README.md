# Sanchi Enterprises — email signature

Kanav Malhotra · Second Generation Leader

| File | Purpose |
|---|---|
| `signature.html` | The signature. This is what gets copied into Gmail/Yahoo. |
| `signature-plain.html` | Fallback: no logo, no gold rule, single column. Same content and same type scale as `signature.html`. Use if Yahoo mangles the table version. |
| `preview.html` | Local test harness, five render states. **Not shipped, never pasted anywhere.** |
| `assets/se-sig-logo-v1.png` | The hosted asset. 240×150, fully transparent, displayed at 120×75. |
| `assets/se-monogram-alpha.png` | Untouched transparent master, kept as source for other uses. |

## Permanent asset URL

```
https://www.sanchienterprises.com/images/email/se-sig-logo-v1.png
```

Hardcoded in `signature.html` and baked into every email ever sent from this
signature. `se-sig-logo-v1.png` is **permanent** — never rename, move, or delete
it. Any future change to the logo ships as `-v2` with a new URL.

Note the **www** host: it matches the website link, so neither takes a redirect hop.

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

1. Copy `assets/se-sig-logo-v1.png` into the website repo at
   `public/images/email/se-sig-logo-v1.png`. Deploy.

2. Verify `https://www.sanchienterprises.com/images/email/se-sig-logo-v1.png`
   loads **in an incognito window**. If it 404s or asks for auth, every signature
   is silently broken and you will not see it in your own outbox.

3. Open `signature.html` in Chrome.

4. `Cmd/Ctrl+A`, then `Cmd/Ctrl+C` — this copies the **rendered page**, not the
   source. Never paste raw HTML source into a signature box; both Gmail and Yahoo
   treat it as literal text and you will end up mailing people your markup.

5. **Gmail:** Settings → See all settings → General → Signature → paste.
   Set it to insert *before* quoted text. Turn off the `--` prefix.

6. **Yahoo:** Settings → More Settings → Mailboxes → select account → Signature →
   enable rich text → paste. If it mangles the layout, use `signature-plain.html`
   instead (same steps 3–4).

## Testing before install

Open `preview.html` in Chrome. Five states:

1. White `#FFFFFF`
2. Webmail canvas `#F1F1F1`
3. **Outlook.com forced inversion** — the whole body is inverted, logo included.
   This *flatters* the navy mark; it is not the failure case.
4. **Images blocked** — the `<img>` is still there but points at a broken path.
   `Sanchi Enterprises` must be legible in navy where the logo would be.
5. **Gmail / Apple Mail dark** — text recoloured for dark mode, image left
   untouched. This is the real dark-mode case.

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
- **The `<img>` carries its own type styling** (`font-size:13px`, bold, navy).
  The logo `<td>` is `font-size:0;line-height:0` to kill the descender gap under
  the image — but alt text inherits type from the *image's own box*, so without
  this the alt string draws at 0px and is invisible in every images-blocked
  client. Keep both.
- **The logo is fully transparent — no plate, no keyline, no fill.**
  **Accepted tradeoff:** navy `#1B2A6B` on a dark inbox background is roughly
  1.4:1, so the mark goes low-contrast in Gmail/Apple Mail dark mode (panel 5).
  Deliberate — do *not* compensate with a plate, outline, glow, or
  `prefers-color-scheme` swap. The alt text carries the identity instead.
- **Rules are `bgcolor` cells with `font-size:0;line-height:0`.** Without that,
  Outlook injects a text line-height and a 2px rule becomes a fat bar. A 1px
  full-height vertical divider column is unreliable in the Word engine, so the
  gold rule is horizontal.
