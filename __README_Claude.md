# Concept Development — website

Static site. No build step, no dependencies, no framework. Open `index.html` in a
browser, or serve the folder:

```bash
cd ~/Desktop/ConceptDev && python3 -m http.server 8765
```

## Files

| Path | What it is |
|---|---|
| `index.html` | The home page |
| `conversion.html` | Conversion product page — live, linked from the nav, footer and card |
| `conversion_privacy.html`, `stiction_privacy.html` | Per-app privacy policies |
| `__foodie.html` | Foodie product page — **parked, not linked from anywhere** |
| `assets/css/site.css` | The whole design system — tokens at the top |
| `assets/js/site.js` | Sticky-header hairline, nav current-page, scroll reveal. Progressive enhancement only; the site works without it. |
| `assets/img/logo/mark.svg` | The company mark, redrawn as vector |
| `assets/img/foodie/` | Screenshots from `~/Desktop/code/Projects/Foodie4/screenshots` |
| `assets/img/conversion/` | One shot per category, named for it — see **Screenshots** below |

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

To reshoot, build the app from `~/Desktop/code/Projects/Conversion4` for a
booted simulator and drive it with the launch arguments its UI tests use:

```bash
xcrun simctl launch <sim> com.conceptdev.Converter -converter.category volume -converter.fromUnit none -converter.toUnit none
```

`none` falls back to that category's own defaults, which is what a fresh install
shows. The amount has to be tapped in on the keypad — there is no launch
argument for it, and the app does not take hardware keyboard input. Apply the
status bar override *after* launching; launching resets it.

## Current state

**Conversion has launched.** It leads the card grid on the home page, has no
"Coming soon" badge, and links to `conversion.html`, which is also in the header
nav and the footer. Foodie, Stiction and DarkFrame follow it and are still
`product-card--soon`.

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

## Known gaps

- The App Store needs a support URL, and there is no support page. It will have
  to be the contact address, or a page written when one is asked for.
- Foodie's pricing copy ("one-time purchase", "uncapped free tier") describes the
  recommended model from `Foodie4/docs/recipe-manager-research.md`, not something
  the app implements yet.
- The competitor table on `__foodie.html` carries an August 2026 date in its
  caption. Re-check the prices before publishing.
- `og:image` is not set on any page.
- `assets/img/foodie/` is 5.4 MB of JPEGs for a page that is not published.
