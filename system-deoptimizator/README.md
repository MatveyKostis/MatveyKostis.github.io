# System Deoptimizator 2009 PRO

**Your PC is too fast. We can fix that.**

System Deoptimizator is a satire of 2009-era PC-optimizer bloatware: the snake-oil
registry cleaners, game boosters, and driver updaters that promised to make your
computer fly and instead bolted on toolbars, tray icons, and background services
until the poor machine begged for a reinstall.

Instead of speeding anything up, System Deoptimizator "scans" your PC for
performance issues, finds them everywhere (a machine that is *suspiciously fast*
is critically ill), and fixes them the only way a 2009 optimizer knows how:
by installing more slop.

## What it does

1. **Scan** — audits your installed software and finds an "issue" in every single
   app. Too small? *Too lean.* Too big? *Needs more bloat to feel at home.*
   Runs fine? *Suspiciously fast — CRITICAL.* A healthy machine can never pass
   this audit.
2. **Optimize** — "fixes" each finding by installing classic slop from the
   2009 download.com experience: Yandex Browser, Amigo, Mail.ru Sputnik, World
   of Tanks Launcher, Ask Toolbar, driver updaters, registry cleaners, weather
   widgets — with a satisfying progress bar and a "+25% FPS!" claim on every box.
3. **Show the wins** — fake metrics that move the wrong way are displayed as
   victories: RAM usage climbs (*more RAM actively working for you!*), CPU load
   rises, FPS drops (*FPS stabilized!*), and every run demands another reboot.
4. **Never clean up** — nothing is ever removed or optimized back. The gunk
   ledger only grows. As tradition demands.

Every "optimization" also leaves behind a fake startup entry
(`HKCU\Run\<slop> Helper (always)`) and a fake tray icon, because what is a
2009 optimizer without those.

## The catch (please read this)

**No real software is downloaded or installed. Nothing touches your registry.
Nothing is deleted.** Every scan result, download, and installation is fully
simulated in-app. The only file the app ever writes is `gunk_ledger.json`, a
local JSON record of your fake slop collection (created in the app's working
directory, never cleaned — that is the joke, but it is also just a small JSON
file you can delete). Fake download URLs like
`http://download.example.com/...` are never fetched. This is a joke app. Its
only real output is mild disappointment in 2009 software culture.

## Screens

- **Home** — a giant glossy "SCAN MY PC NOW (FREE)" button. The star blinks.
  The star always blinks.
- **Scan** — animated progress with joke findings pouring in.
- **Optimize** — the slop catalog: pick your poison, watch each install bar
  crawl to INSTALLED while claiming FPS gains.
- **Results** — your worsening metrics, framed as wins.

## Stack

- **Windows** (the natural habitat of 2009 bloatware), built with **Rust + Tauri 2**.
- Backend: Rust (`src-tauri/src/`) — scanner, slop catalog/installer, fake
  metrics. On Windows it reads the real installed-app list from the registry
  (read-only) to find "issues" in; everywhere else a mocked scanner keeps
  builds compiling.
- Frontend: plain HTML/CSS/JS (`index.html`, `src/`) with the full
  2009-download.com aesthetic — glossy bevels, gradients, Comic Sans, blinking
  FREE! star, XP-style window chrome.

## Running

Prerequisites: the usual [Tauri 2 prerequisites](https://tauri.app/start/prerequisites/)
for your platform, including Rust and the Tauri CLI:

```sh
cargo install tauri-cli --version "^2"
```

Then, from the repo root:

```sh
cargo tauri dev
```

No bundler/dev-server config: the app loads the static frontend straight from
the repo root (`frontendDist: "../"` in `src-tauri/tauri.conf.json`).

Tip: the UI also runs standalone in a plain browser (open `index.html`) with
built-in demo data, so you can admire the blinking star without building
anything.

## Building the Windows bundle

```sh
cargo tauri build
```

produces the installers/bundles under `src-tauri/target/release/bundle/`.
(Build on Windows for Windows targets.)

Note: `src-tauri/icons/` currently contains only a 32x32 placeholder
(`icon.png`), while `tauri.conf.json` references the full Tauri icon bundle
(32x32, 128x128, @2x, `.icns`, `.ico`). Generate the rest first with
`cargo tauri icon <source-image>` — until then builds fail at the icon step,
which is cosmetic damage only and very much in the spirit of the project.

## Project layout

```
index.html            # the UI, all four screens
src/style.css         # 2009 aesthetic: bevels, gradients, blink
src/app.js            # screen flow, Tauri invoke calls, demo fallback
src-tauri/src/main.rs # entry point
src-tauri/src/lib.rs  # command wiring
src-tauri/src/scanner.rs # the "audit" that nothing passes
src-tauri/src/slop.rs # slop catalog + simulated installer + gunk ledger
src-tauri/src/metrics.rs # fake metrics that only get worse
```
