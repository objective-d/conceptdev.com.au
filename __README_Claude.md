# Concept Development — website

Static site. No build step, no dependencies, no framework. Open `index.html` in a
browser, or serve the folder:

```bash
cd ~/Desktop/code/Projects/conceptdev.com.au && python3 -m http.server 8765
```

⚠️ **The path above used to read `~/Desktop/ConceptDev`, which does not exist.**
That server is also single-threaded, which is fine for reading a page by hand and
not fine for screenshotting one — see **Sharp edges**.

There is a launch config at `.claude/launch.json` (name: `site`, port 8765) for
`preview_start`.

## Pick up here

Next steps, highest value first. Nothing is half-built: the tree is clean and
everything below is a decision or an addition, not a repair.

1. **Look at `__foodie.html` and the three privacy pages in a browser.** They
   are the only pages changed or newly linked on 2026-08-25 that nobody has
   actually *seen* since. See **Never looked at** below — start there, it is
   the cheapest way to catch a real bug.
2. **Stiction availability wording.** `stiction.html` has the buttons but no
   eyebrow, heading or "what it needs to run" line. Conversion's section is the
   model. Needs Duncan's words — **do not draft them**, see **Copy** above.
3. **Decide on `.product-card*` in `site.css`** — ~21 dead references. Delete,
   or keep as the pattern for un-parking Foodie. A decision, not a bug.
4. **Downsample `assets/img/mojo/`** (6.8 MB). The Stiction folder is the
   worked example — format, not dimensions. See **Screenshots**.
5. **`og:image`** is still unset on every page.

## Never looked at

Built, changed or wired up on 2026-08-25 and **not once opened in a browser**.
None of these is known to be broken; none has been seen either.

- **`__foodie.html`** — edited (nav links removed, `theme-color`, trademarks
  line) and never rendered. Its two internal links point at `foodie.html`,
  which does not exist; that predates the session and is expected while parked.
- **`conversion_privacy.html`, `mojo_privacy.html`, `stiction_privacy.html`** —
  never opened. `stiction.html` now links to the third one, and only its HTTP
  status (200) was checked, never its rendering. They carry their own inline
  `<style>` and do not load `site.css`, so the light switch should not have
  touched them — **assumed, not verified**.
- **The lightbox** — the wrapper buttons and their `aria-label`s were confirmed
  in the DOM, but no screenshot was ever clicked to watch one open. Untouched
  this session, so low risk.
- **`mojo.html` and `conversion.html` below the fold** — the tops were checked
  after the panel change, the bottoms (Mojo's later shots, Conversion's stats
  and availability block) were not.
- **`mojo.html` and `conversion.html` at phone width** — `index.html` and
  `stiction.html` were checked at 390px and had no overflow; these two were not
  checked at any narrow width after the redesign.
- **The 900–1040px band** — `gallery--4` and the shelf's two-column step both
  change there. Verified at 390px and ≥1280px only.
- **`prefers-contrast: more`, `prefers-reduced-motion`, and the print
  stylesheet** — all three still have rules and none was exercised. The print
  block still names `.js .reveal`, which is current, but `.site-footer__legal`
  was deleted this session, so print is worth one look.

## Checking your work

**There are no tests, no test runner, no build step and nothing to lint** — this
is hand-written HTML and one stylesheet. Do not go looking for a test command;
there isn't one, and inventing one is not useful. Verification is these four
moves, all of which were used on 2026-08-25:

```bash
# 1. every page still serves
for p in "" mojo.html conversion.html stiction.html; do \
  curl -s -o /dev/null -w "$p %{http_code}\n" "http://localhost:8765/$p"; done

# 2. the live stylesheet matches the local one (see Sharp edges)
curl -s https://conceptdev.com.au/assets/css/site.css | diff - assets/css/site.css
```

3. **In the page, via JS, not screenshots** — `naturalWidth` for image loading,
   `getComputedStyle()` for colour, `getBoundingClientRect()` for spacing and
   overlap. Read **Sharp edges** before trusting any screenshot.
4. **After changing copy, prove you didn't**: strip the tags from
   `git show HEAD:<file>` and from the working file and diff the text. This is
   how the 2026-08-25 rebuild was shown to have changed no wording — see
   **Copy**, which is a hard rule.

## Files

| Path | What it is |
|---|---|
| `index.html` | The home page |
| `conversion.html` | Conversion product page — live, reachable **only from its card** |
| `stiction.html` | Stiction product page — live, reachable **only from its card** |
| `mojo.html` | Mojo product page — live, reachable **only from its card** |
| `conversion_privacy.html`, `mojo_privacy.html`, `stiction_privacy.html` | Per-app privacy policies, each linked from its product page. Standalone: their own inline `<style>`, they do **not** load `site.css` |
| `__foodie.html` | Foodie product page — **parked, not linked from anywhere** |
| `assets/css/site.css` | The whole design system — tokens at the top |
| `assets/js/site.js` | Sticky-header hairline, nav current-page, scroll reveal. Progressive enhancement only; the site works without it. |
| `assets/img/logo/mark.svg` | The company mark, redrawn as vector |
| `assets/img/foodie/` | Screenshots from `~/Desktop/code/Projects/Foodie4/screenshots` |
| `assets/img/conversion/` | One shot per category, named for it — see **Screenshots** below |
| `assets/img/mojo/` | Nine Mac window captures, numbered in page order — see **Screenshots** below |
| `assets/img/stiction/` | `1.jpg`–`8.jpg`, one per level, in page order — see **Screenshots** below |

## The mark

The original was a small raster with a bevel, a gloss highlight and a drop
shadow. It is redrawn here as flat geometry in an SVG — a disc split on the
vertical axis, ink on the left, gold on the right, with a "D" counter cut out of
the left half. It is resolution-independent.

Colours: `#1c1c20` / `#9c8a34`. The site accent is the same gold darkened to
`#6b5f1c` so it can legally carry text (5.9:1); the undarkened gold is used for
fills only. The mark's two halves are painted from `--ink` and `--gold`, so it
follows the palette rather than carrying its own values.

## Design notes

- **Type and space are fluid** (`clamp()` throughout), so there are very few
  breakpoints. Layout breakpoints are 460, 520, 560, 640, 700, 720, 760, 800,
  820, 900, 1000 and 1040px.
- **There is no dark mode.** ⚠️ This entry used to say dark mode followed
  `prefers-color-scheme`; that was true until 2026-08-25 and is now false. The
  site is light at every system setting, there are no `prefers-color-scheme`
  blocks left in `site.css`, and each page declares a single light
  `theme-color`. An always-dark version was built and rejected the same day —
  it is in the history of commit `a6efcbd` if any of it is ever wanted.
  The `prefers-contrast: more` branch survives and still collapses muted text
  to full ink.
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

`assets/img/stiction/` is eight captures, `1.jpg`–`8.jpg`, one per level, in the
order they appear on the page — the alt text is "Stiction level 1" and so on, so
**the filename number is the level number**; keep that if you reshoot. Duncan
took them and halved them to 603 × 1311, then re-saved them as JPEG. That took
the folder from 12 MB to under 1 MB with no visible change, and it is the
worked example for the Mojo PNGs under **Known gaps**: the win was the format,
not the dimensions — re-encoding one 3.3 MB PNG at the *same* size gave 422 KB.
They show at 259 CSS px wide, so 603 px is 2.32× — above retina, with a little
spare. Full size in the lightbox they are roughly 1:1.

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

Everything below was rewritten on 2026-08-25 after the home page was rebuilt.
⚠️ The previous version of this section said Mojo led the card grid and that
Mojo and Conversion were in the header nav and footer. **Both are now false** —
see below.

**The home page was rebuilt.** The hero is centred over a lead screenshot
(`assets/img/mojo/01-native.png`, the Mojo window) with a soft indigo wash
behind the headline, and the apps are a **shelf**, not the old card grid:
`.shelf` / `.shelf-card`, three across at 1040px, two at 720px, one below that.
All five cards are equal width — an earlier `shelf-card--feature` modifier gave
Mojo a double-width card and was removed, because Mojo had the least to say and
the extra space read as a hole.

**Card order is deliberate and is Duncan's call**: Conversion, Stiction, Mojo,
Foodie, DarkFrame — released apps first. Do not reorder without being asked.

`shelf-card--soon` removes the hover lift from a card with nothing to click. It
is on Foodie and DarkFrame only. Mojo carries a "Coming soon" badge *and* links
to `mojo.html`, so it is badged and clickable at once — deliberate, and it does
not take the modifier.

⚠️ **`.product-card*` in `site.css` is now dead code.** Nothing in any HTML file
uses it — the home page moved to `.shelf-card` and `__foodie.html` never used
it. About 21 references. It was left in place rather than deleted; see
**Known gaps**.

`mojo.html` is nine screenshots with the words under each one, two to a row, the
lead shot full width and the two portrait captures sharing an upright row. It was
side-by-side text and image down a single column first, which made a page that
was thin and very tall; the two-up grid is the fix and should not be undone
without a reason. Clicking a shot opens it full size (see `.lightbox` in
`site.js`); the two menu captures carry `shot--nozoom` because they are already
full size.

**Conversion and Stiction have launched**, so neither carries a badge.

**Stiction has a page**, added 2026-08-25: `stiction.html`, App Store id
**6799792974**. Hero, then the eight level shots as `gallery gallery--tiles
gallery--4` (two rows of four), then a button row — App Store, Email us,
Privacy. It has **no availability wording**: Conversion's matching section opens
with an eyebrow, a heading and a line about what the app needs to run, and
Stiction's has none of that because nobody has written it. The buttons stand on
their own until someone does.

⚠️ **Mojo, Conversion and Stiction are no longer in the header nav or the
footer** — Duncan's call on 2026-08-25. Both navs are now About and Contact
only, and the Contact link is a filled button (`.nav__cta`). The **only** route
to a product page is its card on the home page, which also means there is no
route from one product page to another. The trademarks line was removed from
every footer at the same time, and its `.site-footer__legal` rule was deleted.

`conversion.html` is deliberately short: hero, ten small screenshots, three
numbers, availability. Conversion is a simple app, so the page does not explain
it at length — the screenshots carry it, one per category, so the range of units
and the twelve colours are the argument. The earlier long version is in git
history if any of it is ever wanted back.

There is **no support page**. It was removed deliberately; do not add one back
without being asked.

`__foodie.html` is complete and still on disk, but nothing links to it, so it
will not be crawled. ⚠️ The un-parking instructions here used to name
`product-card__link` and `product-card--soon`; those classes are gone from the
markup. Un-parking now means renaming it to `foodie.html`, then on the Foodie
**shelf card** in `index.html`: add an `<a class="shelf-card__link"
href="foodie.html">` and drop `shelf-card--soon`. There is no nav entry to
restore — no product is in the nav any more. ⚠️ `__foodie.html` was edited on
2026-08-25 (nav, `theme-color`, trademarks line) and **has not been opened in a
browser since**; its two internal links still point at `foodie.html`, which does
not exist.

Contact address is **info@conceptdev.com.au**; the domain is conceptdev.com.au.

## Sharp edges

Things that cost time and will cost it again:

- ⚠️ **The in-app browser's screenshots lag the page badly at tall viewports.**
  This was the single biggest time sink of the 2026-08-25 session, three
  separate times. Setting the viewport to 2000–4000px to capture a whole page
  and screenshotting returns a *stale composite*: whole sections come back pure
  black, pure white, or washed out mid-fade. It is indistinguishable from
  broken CSS, unloaded images, or a stuck `.reveal` — twice it sent me hunting
  a contrast bug that did not exist, and once it made eight vivid green
  screenshots look like empty grey boxes.
  **Never diagnose from a screenshot alone.** Confirm in the DOM first:
  `img.complete && img.naturalWidth > 0` for loading, `getComputedStyle()` for
  colour, `getBoundingClientRect()` for spacing and overlap. Those are reliable
  when the picture is not. Then re-screenshot at a viewport height of ~1000px,
  where compositing keeps up.
- **`python3 -m http.server` is single-threaded.** A previous session found that
  pointing headless Chrome at it and screenshotting silently produced a page
  with every image missing — right-sized boxes, nothing painted. Serve with
  `ThreadingHTTPServer` and a generous `--virtual-time-budget`.
  ⚠️ **Not reproduced on 2026-08-25**: the in-app browser loaded all ten Mojo
  captures and all eight Stiction shots over this same server, confirmed via
  `naturalWidth`. The blank panels seen that day were the compositor lag above,
  not the server. The note is kept because it may still be real for headless
  Chrome specifically — but check the compositor explanation first, it is far
  more likely.
- **The browser caches `site.css` and `site.js` hard.** Reloading a preview after
  an edit re-fetches the HTML and keeps the old CSS, so a change appears not to
  have worked. Append `?v=<something>` to both links while previewing, and take
  it off before committing.
  **This bites on the live site too, and looks much worse there.** On
  2026-08-25 Duncan loaded conceptdev.com.au during a Pages deploy, cached a
  `site.css` that had not published yet, and got a page with *no styling at
  all* — which reads as a catastrophic deploy. It was a stale cache; a hard
  reload fixed it. **Diagnose before touching code**: `curl` the live
  stylesheet and `diff` it against the local one. If they match and the live
  page returns 200, the deploy is fine and the browser is lying. Do not "fix"
  CSS that is already correct.
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
- **`assets/img/mojo/` is 6.8 MB of PNGs**, the largest 1.7 MB. Everything below
  the lead shot is `loading="lazy"`, so the first paint is not 6.8 MB, but the
  page is still far heavier than any other — and `01-native.png` is now the
  home page's lead shot too, so it is on the critical path for the *whole
  site*, not just `mojo.html`. Re-encoding is the fix and has not been done;
  `assets/img/stiction/` is the worked example under **Screenshots**. ⚠️ Mojo's
  captures have a **transparent surround** that `.shot--mac` depends on, so
  they cannot simply become JPEGs the way Stiction's did — WebP or PNG
  re-compression, not JPEG.
- `assets/img/foodie/` is 5.4 MB of JPEGs for a page that is not published.
- **`.product-card*` in `site.css` is dead** — ~21 references, no HTML uses it.
  Kept deliberately for now; see **Pick up here**.
- **No product page links to another product page.** With the apps out of the
  nav, leaving `mojo.html` means going back to the home page first. Duncan's
  call; flagged in case it is not the intent.
- `.DS_Store` files appear in this folder and are **not** in a `.gitignore` —
  there is no `.gitignore` at all. They were kept out of the 2026-08-25 commits
  by staging paths explicitly. Worth adding one.
