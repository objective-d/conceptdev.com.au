# Concept Development — website

Static site. No build step, no dependencies, no framework. Open `index.html` in a
browser, or serve the folder:

```bash
cd ~/Desktop/code/Projects/conceptdev.com.au && python3 -m http.server 8765
```

⚠️ **The path above used to read `~/Desktop/ConceptDev`, which does not exist.**
That server is also single-threaded, which is fine for reading a page by hand and
not fine for screenshotting one — see **Sharp edges**.

## Files

| Path | What it is |
|---|---|
| `index.html` | The home page |
| `conversion.html` | Conversion product page — live, linked from the nav, footer and card |
| `mojo.html` | Mojo product page — live, linked from the nav, footer and card |
| `conversion_privacy.html`, `mojo_privacy.html`, `stiction_privacy.html` | Per-app privacy policies |
| `__foodie.html` | Foodie product page — **parked, not linked from anywhere** |
| `assets/css/site.css` | The whole design system — tokens at the top |
| `assets/js/site.js` | Sticky-header hairline, nav current-page, scroll reveal. Progressive enhancement only; the site works without it. |
| `assets/img/logo/mark.svg` | The company mark, redrawn as vector |
| `assets/img/foodie/` | Screenshots from `~/Desktop/code/Projects/Foodie4/screenshots` |
| `assets/img/conversion/` | One shot per category, named for it — see **Screenshots** below |
| `assets/img/mojo/` | Nine Mac window captures, numbered in page order — see **Screenshots** below |

## The mark

The original was a small raster with a bevel, a gloss highlight and a drop
shadow. It is redrawn here as flat geometry in an SVG — a disc split on the
vertical axis, ink on the left, gold on the right, with a "D" counter cut out of
the left half. It is resolution-independent, and it swaps to a light ink half in
dark mode.

Colours: `#1c1c20` / `#9c8a34` in light, `#f2f2f4` / `#c9b45c` in dark. The site
accent is the same gold darkened to `#6b5f1c` so it can legally carry text
(5.9:1); the undarkened gold is used for fills only.

## Design notes

- **Type and space are fluid** (`clamp()` throughout), so there are very few
  breakpoints. Layout breakpoints are 640, 700, 800, 900 and 1000px.
- **Dark mode** follows `prefers-color-scheme`, with a `prefers-contrast: more`
  branch that collapses muted text to full ink.
- **Reduced motion** disables every transition and the scroll reveal.
- **Accessibility**: skip link, one `h1` per page, semantic landmarks, visible
  focus rings, 44px minimum button height, alt text on every screenshot, and the
  wide comparison table scrolls inside its own container rather than the page.
- No web fonts — system stack only, so there is no flash and nothing to download.

## Copy

Modelled on how small Apple-platform studios actually write — Panic, Tapbots,
Rogue Amoeba, Red Sweater, Iconfactory, Shiny Frog, Sindre Sorhus, Bear, Things,
Mela, Pestle, Paprika were surveyed. The conventions of that genre:

- **Short headline, often a fragment.** "Be iconic." · "Robots for iOS & Mac" ·
  "Quality Crafted Apps" · "Uncommonly Great Apps for Your Mac" · "Strange name.
  Great software."
- **One sentence of self-description, specific about place and people.** "Tapbots
  has been crafting fine apps since 2008. We are 3 humans living in North Texas
  and Canada."
- **Each app gets a one-line tagline**, two to five words — "Any audio,
  everywhere", "Record any audio". Never a paragraph before the reader knows what
  the app is.
- **Feature blocks are a short heading plus one or two sentences**, and the
  heading is usually the thing you do: "Save a recipe while browsing", "Scan a
  recipe from a book", "Full screen cook mode".
- **Nobody writes a process manifesto.** Craft is signalled by a single adjective
  in the tagline and then demonstrated in screenshots.

Written for customers, not developers. Four rules:

- **Describe features, not qualities.** "Search covers ingredients as well as
  names", not "quick to open" or "easy to read". If a sentence would still be
  true of a different app, it is not earning its place.
- **State it, do not perform it.** No jokes, no winks, no scene-setting about
  wooden spoons and kettles, no "honestly" or "genuinely". Short declarative
  sentences.
- **No implementation detail.** No framework names, no file formats, no contrast
  ratios. Where a technical fact earns its place, state the outcome instead.
- **Nothing about earlier versions.** No rewrites, no legacy apps, no migrating
  from an older release.

Copy should also be scale-free: nothing that counts the apps ("both", "two
apps"), so a third product needs no rewrite.

If you edit, keep all of it. Jargon and self-congratulation both creep back
easily.

## Screenshots

`assets/img/foodie/` holds more captures than the (parked) Foodie page uses,
kept as a swap pool. Source: `~/Desktop/code/Projects/Foodie4/screenshots`.

`assets/img/conversion/` is one shot per category, named for it, all captured in
the same run so the status bars match: 9:41, full bars, full battery, no carrier
text — the same override the app's `fastlane/Snapfile` uses for the store. They
are 257 × 560 JPEGs, sized for the tile gallery rather than full-width display.

`assets/img/mojo/` is nine captures of the Mac app, numbered in the order they
appear on the page. **Duncan took them; there is no capture script.** They are
full-resolution PNGs with the window's own rounded corners and a transparent
surround, which is what `.shot--mac` is drawn for — it removes the border and
background the base rule adds and uses `drop-shadow`, which follows the alpha
rather than the border box.

They come in at nine different aspect ratios, from 714 × 1488 to 3224 × 2074.
The page does not fight that: each one is centred on a panel of a fixed shape.
Replacing a shot needs no CSS change as long as it keeps a transparent surround.

To reshoot Conversion, build the app from `~/Desktop/code/Projects/Conversion4` for a
booted simulator and drive it with the launch arguments its UI tests use:

```bash
xcrun simctl launch <sim> com.conceptdev.Converter -converter.category volume -converter.fromUnit none -converter.toUnit none
```

`none` falls back to that category's own defaults, which is what a fresh install
shows. The amount has to be tapped in on the keypad — there is no launch
argument for it, and the app does not take hardware keyboard input. Apply the
status bar override *after* launching; launching resets it.

## Current state

**Mojo has a page**, added 2026-08-25. It leads the card grid on the home page and
is first in the header nav and the footer. The card carries a **"Coming soon"
badge** — Duncan's call on 2026-08-25; Mojo is not on sale. Take the badge off when
it ships.

That card is the one place on the site that is both badged and clickable, and that
is deliberate: it does **not** carry `product-card--soon`. That modifier exists to
remove the hover lift from a card with nothing to click, and this card links to
`mojo.html`, so it keeps its hover.

`mojo.html` is nine screenshots with the words under each one, two to a row, the
lead shot full width and the two portrait captures sharing an upright row. It was
side-by-side text and image down a single column first, which made a page that
was thin and very tall; the two-up grid is the fix and should not be undone
without a reason. Clicking a shot opens it full size (see `.lightbox` in
`site.js`); the two menu captures carry `shot--nozoom` because they are already
full size.

**Conversion has launched.** It sits second in the card grid, behind Mojo, has no
"Coming soon" badge, and links to `conversion.html`, which is also in the header
nav and the footer. Foodie, Stiction and DarkFrame follow the two of them and are
still `product-card--soon`.

`conversion.html` is deliberately short: hero, ten small screenshots, three
numbers, availability. Conversion is a simple app, so the page does not explain
it at length — the screenshots carry it, one per category, so the range of units
and the twelve colours are the argument. The earlier long version is in git
history if any of it is ever wanted back.

There is **no support page**. It was removed deliberately; do not add one back
without being asked.

`__foodie.html` is complete and still on disk, but nothing links to it, so it
will not be crawled. Un-parking it means renaming it to `foodie.html`, restoring
its nav entry, its footer entry, and the card's `product-card__link`, and
dropping `product-card--soon` from that card.

Contact address is **info@conceptdev.com.au**; the domain is conceptdev.com.au.

## Sharp edges

Three things that cost time on 2026-08-25 and will cost it again:

- **`python3 -m http.server` is single-threaded.** Pointing headless Chrome at it
  and taking a screenshot silently produced a page with every image missing —
  the boxes were the right size, from the `width`/`height` attributes, and
  nothing was painted in them. It looks exactly like a CSS bug and is not. Serve
  with `ThreadingHTTPServer`, and pass a generous `--virtual-time-budget`.
- **The browser caches `site.css` and `site.js` hard.** Reloading a preview after
  an edit re-fetches the HTML and keeps the old CSS, so a change appears not to
  have worked. Append `?v=<something>` to both links while previewing, and take
  it off before committing.
- **Do not size a panel and fit the image to it.** `aspect-ratio` on the figure
  with `height: 100%` on the image inside is circular — the image's own height
  feeds back into the panel's, and depending on which way the browser resolves it
  either a tall capture pushes its panel past its neighbour's or the image
  collapses to nothing. Put the `aspect-ratio` on the **image** and let the panel
  take its height from that. This is why `.point .shot img` carries the ratio and
  `.point .shot` carries only padding.

## Known gaps

- The App Store needs a support URL, and there is no support page. It will have
  to be the contact address, or a page written when one is asked for.
- Foodie's pricing copy ("one-time purchase", "uncapped free tier") describes the
  recommended model from `Foodie4/docs/recipe-manager-research.md`, not something
  the app implements yet.
- The competitor table on `__foodie.html` carries an August 2026 date in its
  caption. Re-check the prices before publishing.
- `og:image` is not set on any page.
- **`assets/img/mojo/` is 6.7 MB of PNGs**, the largest 1.7 MB. Everything below
  the lead shot is `loading="lazy"`, so the first paint is not 6.7 MB, but the
  page is still far heavier than any other. Downsampling to the widths actually
  displayed, or moving to WebP, is the obvious fix and has not been done.
- `assets/img/foodie/` is 5.4 MB of JPEGs for a page that is not published.
