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

Rewritten 2026-10-14, the day the Foodie page went live. The tree is clean and
everything is pushed; nothing is half-built.

1. **Delete `__foodie.html` and the 23 pre-release Foodie screenshots.** Duncan
   agreed on 2026-10-14, but the auto-mode safety check blocked `git rm`, so he
   was given the command to run himself. If they are still on disk, ask him
   to run it — do not work around the block:
   `git rm -q __foodie.html $(ls assets/img/foodie/*.jpg | grep -vE "/(ipad|iphone)-")`
   No page references any of them (checked). Then drop the `__foodie.html` row
   from **Files** and the swap-pool sentence under **Screenshots**.
2. **Look at `foodie.html` at phone width and in the 900–1040px band.** See
   **Never looked at** — the page was rebuilt several times after its only
   narrow-width check.
3. **Stiction availability wording.** `stiction.html` has the buttons but no
   eyebrow, heading or "what it needs to run" line. Needs Duncan's words —
   **do not draft them**, see **Copy**.
4. **Mojo still has no App Store button** — its id is unknown. Ask for it.
5. **Decide on `.product-card*` in `site.css`** — ~21 dead references. Nothing
   needs it now that Foodie has its page; deleting is the likely answer.
6. **Downsample `assets/img/mojo/`** (6.8 MB). See **Screenshots**.
7. **`og:image`** is still unset on every page.

## Never looked at

**From 2026-10-14 (the Foodie page):**

- **`foodie.html` at phone width.** The *first* version was checked at 375px
  (no horizontal overflow). It was then rebuilt — new sections, a `features--3`
  block, a heading-less `.langs` list — and never looked at narrow again.
- **`foodie.html` between 700 and 1040px.** Only 1280px (and 1024px for the
  hero gap) was checked.
- **The home page hero at phone width.** It is now a plain iPad JPEG with a
  border and radius, and `.hero-shot` takes back the gutter below 700px so it
  runs edge to edge. That rule was written for the Mojo window with its
  transparent surround; how the radius and border look edge to edge was not
  checked. Desktop was checked by `naturalWidth` only (2000 px, shown at
  1105 px) — the screenshot taken was a stale composite.
- **The lightbox on Foodie shots** — never clicked.
- **The "A first-class Apple citizen" section.** Its `.langs` list sits in a
  `.point__body` with no `h3`, so it keeps `.point__body .langs`'s top margin.
  Not looked at after the heading moved out.
- **The four simulator shots sit short in their 4:3 panels** (2420×1668 from an
  11-inch iPad, beside 4:3 store shots from a 13-inch). Seen once at 1280px and
  judged acceptable; Duncan approved the page with it.

**From 2026-08-25, still open:**

- **`conversion_privacy.html`, `mojo_privacy.html`, `stiction_privacy.html`** —
  never opened; only HTTP 200 checked.
- **The lightbox** in general — wrapper buttons confirmed in the DOM, never
  clicked open.
- **`mojo.html` and `conversion.html` below the fold and at phone width.**
- **`prefers-contrast: more`, `prefers-reduced-motion`, and the print
  stylesheet** — none exercised. `.site-footer__legal` was deleted, so print is
  worth one look.

## Checking your work

**There are no tests, no test runner, no build step and nothing to lint** — this
is hand-written HTML and one stylesheet. Do not go looking for a test command;
there isn't one, and inventing one is not useful. Verification is these four
moves, all of which were used on 2026-08-25:

```bash
# 1. every page still serves
for p in "" mojo.html conversion.html stiction.html foodie.html; do \
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
| `conversion_privacy.html`, `mojo_privacy.html`, `stiction_privacy.html`, `foodie_privacy.html`, `clive_privacy.html` | Per-app privacy policies, each linked from its product page. Standalone: their own inline `<style>`, they do **not** load `site.css` |
| `foodie.html` | Foodie product page (live since 2026-10-14). Copy is Duncan's, from the old foodiesharing.com, in its three groups. Mojo-style points for landscape iPad, Conversion tile row for portrait iPhone |
| `clive.html` | **Placeholder** for Clive (ZX Spectrum emulator, Mac, not yet released — App Store id 6825200276 per `~/Desktop/Clive` git log, not yet linked). Icon, name, "Coming soon", Duncan's one-line description, Privacy button. Replace with the product page when Clive ships; the home card already links here |
| `__foodie.html` | The old parked Foodie page — **superseded** by `foodie.html`, with wrong copy (roadmap lists shipped features; pricing is not the shipped model). Agreed for deletion — see **Pick up here** |
| `assets/css/site.css` | The whole design system — tokens at the top |
| `assets/js/site.js` | Sticky-header hairline, nav current-page, scroll reveal. Progressive enhancement only; the site works without it. |
| `assets/img/logo/mark.svg` | The company mark, redrawn as vector |
| `assets/img/foodie/` | `ipad-0*.jpg` and `iphone-0*.jpg` are the App Store screenshots from `~/Desktop/Foodie4/fastlane/screenshots/en-AU`. `ipad-scaling/converter/share-menu/dark.jpg` were taken on the Foodie-Dev-iPad simulator, landscape, 2026-10-14. Everything else (23 files, ~5 MB) is pre-release captures, unused, agreed for deletion |
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

`assets/img/foodie/`: the page uses only the `ipad-*` and `iphone-*` files.
⚠️ The Foodie project is at **`~/Desktop/Foodie4`**, not
`~/Desktop/code/Projects/Foodie4` as this used to say. Duncan's rules for these:
**landscape iPad, portrait iPhone, plain screenshots with no device frame, and
as few as will do the job.**

- `ipad-01/03/04/05-*.jpg` and `iphone-0*.jpg` are the App Store pictures,
  `~/Desktop/Foodie4/fastlane/screenshots/en-AU`, scaled to 2000 px (iPad,
  2752×2064 source) and 603 px wide (iPhone, 1320×2868 source), JPEG q80.
  They are raw captures with a 9:41 status bar, not framed marketing images.
  The UI test that makes them is `UITests/AppStoreScreenshots.swift`.
- `ipad-scaling`, `ipad-converter`, `ipad-share-menu` and `ipad-dark` were
  taken by hand on 2026-10-14 on the **Foodie-Dev-iPad** simulator (iPad Pro
  11-inch, iOS 26.5, UDID `719DCBB9-…`), 2420×1668 → 2000×1378. ⚠️ "Foodie-Dev"
  on its own is an **iPhone 17 Pro**, not the iPad.

To take more by hand, build into a scratch derived-data folder, install, and
launch with the same switches the UI tests use — a fresh sample library, the
trial running so Pro features open instead of the paywall, no tips:

```bash
xcrun simctl launch --terminate-running-process <udid> com.conceptdev.foodie.dev \
  -com.apple.TipKit.HideAllTips 1 -AppleLanguages "(en-AU)" -AppleLocale en_AU
# with, in the environment: SIMCTL_CHILD_FOODIE_STORE=ephemeral
#   SIMCTL_CHILD_FOODIE_SHOPPING=ephemeral SIMCTL_CHILD_FOODIE_RESET_LIBRARY=1
#   SIMCTL_CHILD_FOODIE_SYNC=0 SIMCTL_CHILD_FOODIE_HIDE_SYNC_FOOTER=1
#   SIMCTL_CHILD_FOODIE_TRIAL_STARTED_DAYS_AGO=1
```

Things that cost time:

- **Do not build with `CODE_SIGNING_ALLOWED=NO`.** The app then has no
  simulated entitlements, fails on its App Group and CloudKit, and dies with
  SIGTRAP straight after launch — it looks like it never opened. A normal
  simulator build (`-destination 'generic/platform=iOS Simulator'`) works.
- **Landscape** is Simulator's *Device → Rotate Left* (scriptable with
  `osascript` through System Events). There is no `simctl` command for it.
- **Once rotated, the simulator tool's own screenshot is stale and sideways**,
  and its taps take **landscape** points (1210×834 on the 11-inch), not the
  portrait 834×1210 it reports when attaching. Capture with
  `xcrun simctl io <udid> screenshot` instead — that one is real and the right
  way up.
- **Taps during a transition are dropped.** After closing a sheet or opening a
  recipe, the next tap often does nothing; check, then tap again.
- **The simulator's share sheet has no AirDrop or Mail**, so it looks bare.
  The page uses Foodie's own Share Recipe menu (Foodie Recipe / PDF) instead.
- Dark mode: `xcrun simctl ui <udid> appearance dark` (and back to `light`).
- Status bar: `xcrun simctl status_bar <udid> override --time 9:41 …`; clear it
  afterwards. The Foodie-Dev-iPad was left shut down, light, override cleared —
  ⚠️ but **with this session's debug build of Foodie Dev installed over
  whatever Duncan had there**, and possibly still rotated left.

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
(`assets/img/foodie/ipad-01-library.jpg` since 2026-10-14; it was the Mojo
window before) with a soft indigo wash
behind the headline, and the apps are a **shelf**, not the old card grid:
`.shelf` / `.shelf-card`, three across at 1040px, two at 720px, one below that.
All five cards are equal width — an earlier `shelf-card--feature` modifier gave
Mojo a double-width card and was removed, because Mojo had the least to say and
the extra space read as a hole.

**Card order follows a rule, set by Duncan on 2026-09-03: released apps first,
newest release first**, then the unreleased ones. Today that is Foodie (shipped
2026-10-08, page live 2026-10-14), Mojo, Stiction, Conversion, then Clive and
Astronomical (unreleased; Clive first because it has a page). When the next app ships it goes to the front —
that is the rule, so apply it rather than asking.

`shelf-card--soon` removes the hover lift from a card with nothing to click. It
is on Astronomical only — the one app that is not out and has no page. Clive
(added 2026-10-21) is badged **and** clickable, linking to its placeholder, the
way Foodie was from 2026-09-30. ⚠️ This
used to say Foodie too; Foodie lost it on 2026-09-30 and its badge on
2026-10-14.

⚠️ **`.product-card*` in `site.css` is now dead code.** Nothing in any HTML file
uses it — the home page moved to `.shelf-card` and no product page uses it. About 21 references. It was left in place rather than deleted; see
**Known gaps**.

`mojo.html` is nine screenshots with the words under each one, two to a row, the
lead shot full width and the two portrait captures sharing an upright row. It was
side-by-side text and image down a single column first, which made a page that
was thin and very tall; the two-up grid is the fix and should not be undone
without a reason. Clicking a shot opens it full size (see `.lightbox` in
`site.js`); the two menu captures carry `shot--nozoom` because they are already
full size.

**Conversion, Stiction and Mojo have launched**, so none of them carries a
badge. Mojo went on sale 2026-09-02 and its "Coming soon" badge came off the
same day. ⚠️ **`mojo.html` still has no App Store button** — Conversion and
Stiction both lead their button row with one, Mojo's row is Email us and
Privacy only, because nobody has supplied its App Store id yet. Conversion is
`286552073`, Stiction is `6799792974`; Mojo's is unknown.

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

**Foodie has a page**, live 2026-10-14: `foodie.html`, App Store id
**577670082** (an old id — the app dates from 2012; v4.0 is a rewrite). ⚠️ The
older notes here described `foodie.html` as a temporary placeholder and
`__foodie.html` as the real page to rename over it. **Both are now false** —
`foodie.html` was written fresh, and `__foodie.html` is dead.

The copy is **Duncan's own**, from the old foodiesharing.com
(web.archive.org snapshot 2020-08-11), kept in its three groups — *Your
recipes*, *Your cooking companion*, *Share with family and friends* — then
*A first-class Apple citizen* (dark shot + a `.langs` list), *iPhone too!*
(five iPhone tiles, no captions) and the availability row. Every line was
reworded only where the app has changed, and every edit after the first draft
was Duncan's dictation. Treat the wording as his: change it only when asked.

What the app actually is, checked against `~/Desktop/Foodie4` and its App Store
listing on 2026-10-14: **free download**, iOS 26+, iPhone and iPad, no Mac
build (`SUPPORTS_MACCATALYST = NO`). **Foodie Pro** is a one-time in-app
purchase with a 30-day free trial; it covers sharing lists and collections,
importing from websites, sending lists to Reminders, sending recipes, and
printing (`Foodie/Pro/ProFeature.swift`). The page no longer mentions Pro at
all — Duncan cut that line. There is **no "cooking keyboard"** any more; the
old copy's line about it was replaced.

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
  it off before committing. ⚠️ **Exception, deliberate:** `foodie.html` links
  `site.css?v=2`, committed and live. Duncan's browser kept showing old spacing
  after a Cmd+Shift+R, and the query string was what got it through. The other
  pages link plain `site.css`. Bump it if a Foodie-only CSS change "does
  nothing".
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

- **Clive's facts for `clive_privacy.html`** (checked 2026-10-21 in
  `~/Desktop/Clive`): sandboxed, entitlements are user-selected read-write files
  and app-scope bookmarks only — **no network entitlement**, and no URLSession,
  CloudKit or StoreKit in the code. Stores preferences, library folders
  (bookmarks), favourites and recent games in UserDefaults; save slots and
  played-game pictures in Application Support; reads game controllers. Re-check
  these before Clive ships — the policy says "no network requests".
- **Mac app icons** (Mojo, Clive) have a transparent margin, so the
  `box-shadow` on `.app-hero__icon` and `.shelf-card__icon` draws a faint square
  around them. Not fixed; would need `filter: drop-shadow` for Mac icons.
  Clive's icon is an Icon Composer `.icon` bundle; `clive.png` was rendered at
  512 px from the built app with `NSWorkspace.shared.icon(forFile:)`.

- The App Store needs a support URL, and there is no support page. It will have
  to be the contact address, or a page written when one is asked for.
- ⚠️ The two Foodie pricing notes that stood here (an unimplemented pricing
  model, and a competitor table to re-check) were about `__foodie.html` and are
  moot: the live page states no price and has no table.
- **"Sync … across all your devices"** on `foodie.html` is Duncan's wording.
  Today that means iPhone and iPad only — there is no Mac build yet. The page
  also says "iPhone Duo and Mac version coming soon."
- `og:image` is not set on any page.
- **`assets/img/mojo/` is 6.8 MB of PNGs**, the largest 1.7 MB. Everything below
  the lead shot is `loading="lazy"`, so the first paint is not 6.8 MB, but the
  page is still far heavier than any other. (It was also the home page's lead
  shot until 2026-10-14; that is now a Foodie JPEG.) Re-encoding is the fix and has not been done;
  `assets/img/stiction/` is the worked example under **Screenshots**. ⚠️ Mojo's
  captures have a **transparent surround** that `.shot--mac` depends on, so
  they cannot simply become JPEGs the way Stiction's did — WebP or PNG
  re-compression, not JPEG.
- `assets/img/foodie/` is 8.5 MB: ~3.5 MB used by the live page, ~5 MB of
  pre-release captures waiting to be deleted (see **Pick up here**).
- **`.product-card*` in `site.css` is dead** — ~21 references, no HTML uses it.
  Kept deliberately for now; see **Pick up here**.
- **No product page links to another product page.** With the apps out of the
  nav, leaving `mojo.html` means going back to the home page first. Duncan's
  call; flagged in case it is not the intent.
- ⚠️ This used to say there is no `.gitignore`. **There is one** and it lists the
  `.DS_Store` files; nothing to do.
