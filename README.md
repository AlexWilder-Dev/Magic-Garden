# The Magic Garden · Battersea

A speculative redesign of the website for The Magic Garden, the pub and live music venue at 231 Battersea Park Road, by Battersea Park. Built as a pitch for the manager.

**Live demo:** https://alexwilder-dev.github.io/magic-garden-battersea/

This is a front-end demo on static data. There's no CMS, database, payments or backend. Booking, party enquiries and the mailing list all finish on a success screen, and ticket buttons go to the real Eventbrite and Tickettailor pages.

## The idea

People call it "a festival in a pub", so the site is set up like one:

- **Tonight at the Garden.** A live strip under the hero, worked out from the opening hours and the line-up in London time. It shows whether the pub's open and when it closes, then tonight's act with its start time and either free entry or a tickets button. With no show on, it shows the garden and the next act. Between midnight and 2am on a Friday or Saturday it still counts as that night.
- **The site changes with the day.** Before 5pm it opens on the garden café: coffee, lunch, armchairs and WiFi, in daylight colours. From 5pm it leads with tonight's act. After closing it shows the next show.
- **The Line-up.** The next 14 nights set as a festival poster. Friday and Saturday headliners are set biggest, weeknight shows mid-size and the quiz smallest. Tap an act for its poster, details, tickets and an "Add to calendar" file. It has genre filters and a plain-list view. Nights past the dated list are filled in from the weekly pattern.
- **Walk the garden.** A swipe-through of the garden: the outside bar, the covered seating and canopy, the outdoor café, the private seating area and the taxi. It ends with a garden table booking.
- **The vine.** The vine from the logo, and from the trees painted on the front of the building, grows between sections as you scroll.

## Try any moment

Add `?at=` to the URL to set the demo clock:

- `?at=fri-21:30`: the next Friday at 9:30pm
- `?at=tue-20:00`: a quiet Tuesday evening
- `?at=2026-10-17T01:15`: 1:15am Saturday, still Friday night
- `?at=mon-11:00`: weekday morning, garden café mode

## Run it

```bash
npm install
npm run dev          # local dev server
npm run build        # production build into dist/
npm run check:meta   # checks the link-preview tags and og.jpg in dist/
```

`npm run images` rebuilds the responsive WebP files in `public/img` from the original venue photos in `media/`, and `npm run og` rebuilds the 1200×630 link-preview image. Both use sharp.

Stack: Vite, React, TypeScript, Framer Motion and HashRouter. GitHub Pages deploys it with GitHub Actions: `.github/workflows/deploy.yml` builds and publishes on every push to the default branch, or when run by hand. The build uses a relative base, so it works whatever the repository is called.

## Photos

Every photo and poster comes from The Magic Garden's own website. There's no stock imagery.

Site by AlexWilder-Dev
