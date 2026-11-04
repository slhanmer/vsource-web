# Brief — robotics-content

**Run after `cms` is committed and seeded.** This is content, not structure.
Where it can go in through the seed (`src/seed/`), put it there so preview and
production both get it from `pnpm seed`. Do not hand-edit the database.

**Repo:** `V Souce Development` · **Branch:** `development` · **Push:**
`development` only. One commit.
**Read `CLAUDE.md` first.**

Simon supplied the Robotics copy, photos and video on 4 November. The media is
already processed and is in `media-inbox/robotics/`: colour-graded, cropped,
H.264 MP4s under 10 s, muted, each with a poster. Copy below is final. Use it
verbatim, curly apostrophes included.

Where the brief does not match the code, stop and log it.

---

## 1. The project: `spider-drones` becomes `project-arachnid`

Replace the seeded `spider-drones` project with **`project-arachnid`**,
**published**, and make it the lead (`featured: true`). Don Gino goes back to an
ordinary card. Remove `placeholder`. Delete the old `placeholder-drone.*` files
and their media documents if nothing else uses them.

- `title`: `Project Arachnid`
- `client`: `V Source`
- `stream`: `robotics`
- `year`: `2026`
- `status`: `building`
- `line`: `Bio-inspired legged robots for places people can’t go.`
- `lede`: `After an earthquake, a building collapse or a landslide, the first hours matter most — and they are the hours when rescue teams face the most danger. Project Arachnid builds legged robots to go where people can’t.`
- `body`:
  1. `Collapsed structures, unstable rubble, smoke and confined voids make many of the places survivors are trapped too dangerous for people to enter. Project Arachnid builds legged robots for these human-denied environments: terrain too dangerous, too unstable or too confined for people or conventional machines.`
  2. `The aim is to put eyes, sensors and eventually supplies into the spaces between the rubble, so rescue teams can find survivors sooner and with less risk.`
  3. `Our flagship platform, The Huntsman, takes its cues from the huntsman spider and its distant cousin the wolf spider — fast, low-slung and agile hunters. It walks on eight legs using an alternating gait drawn from arthropod locomotion, so its body stays supported at all times.`
  4. `The first prototype stands, walks, turns, detects obstacles and climbs. The second generation, now in development, adds stronger joints for heavier payloads, pressure-sensing feet, body-orientation sensing, simulated training environments for machine learning, and an onboard mesh network to restore communications in a blackout.`
- `facts`:
  - `{ label: 'Stream', value: 'Robotics' }`
  - `{ label: 'Platform', value: 'The Huntsman, eight legs' }`
  - `{ label: 'Stage', value: 'First prototype complete' }`
  - `{ label: 'Next', value: 'Second generation in development' }`
- `media`: video `huntsman-walk.mp4`, poster `huntsman-walk-poster.jpg`, 1280×720,
  alt `The Huntsman, an eight-legged black robot, walking across a timber floor under a single light.`

If the project page template supports additional media below the body, add,
in this order: `huntsman-studio.jpg` (alt `The Huntsman from the side, legs raised mid-step, on a workbench.`),
`huntsman-terrain-trials.jpg` (alt `Four simulation runs of The Huntsman: 3.5 m on a 15° slope, 2.9 m over mixed ground, stalling at 50 mm steps after 0.8 m, and snagging on 80 mm rubble after 0.6 m.`),
then `huntsman-sim-controls.mp4` with its poster (alt `The Huntsman in simulation, driven from an on-screen operator panel through walk, rubble and emergency-stop modes.`).
**If the template has no such slot, do not build one.** Log it, and Simon will
decide.

`huntsman-sim-steps.mp4` and `huntsman-sim-rubble.mp4` are not used yet. Leave
them in `media-inbox/`.

## 2. The Robotics stream

Set these fields on the `robotics` stream. Remove every `pending` flag on it.

- `door`: `Legged robots for places people can’t go.`
- `problem`, `instead` and `solution` are already set by `moves-flip`. Leave them.
- `lede`: `Bio-inspired legged robots for terrain too dangerous, too unstable or too confined for people or conventional machines.`
- `promise`: `Robots that go where people can’t, so rescuers don’t have to.`
- `pageLede`: `After an earthquake, a building collapse or a landslide, the first hours matter most. We build legged robots to put eyes, sensors and eventually supplies into the places rescuers can’t safely reach.`
- `who`: `For search and rescue, emergency services, and anyone who needs to see inside places people can’t safely enter.`
- `caps`:
  1. `Eight-legged platforms with a gait that keeps the body supported at all times`
  2. `Sensor, camera and compute payloads carried at the centre`
  3. `Wireless control with live diagnostics and over-the-air updates`
  4. `Simulated training environments for machine-learned gaits`
- `proof`: label `Current work`, body `Project Arachnid: The Huntsman, our first eight-legged prototype, stands, walks, turns, detects obstacles and climbs.`
- `pricing`: value `Scoped per project`, note `Robotics work is research-led. We scope it with you against what the robot has to reach and what it has to bring back.`
- `doorPhoto`: `huntsman-top.jpg`, alt `The Huntsman from above on a stone bench, its controller board and battery mounted at the centre.`
- `stepPhoto`: `huntsman-studio.jpg`, alt as in §1.

**`sections`** replaces the old `scope` and `proof` sections entirely:

1. `id: 'why-legs'`, title `Why legs, not wheels`, body:
   1. `Wheels and tracks work well on roads and open ground. Disaster zones offer neither. Debris fields are broken and uneven, with gaps, steps and loose material that can stop a wheeled platform outright.`
   2. `Legged robots move differently, and go where wheels and rotors can’t. Each foot picks its own contact point, so the robot can step over obstacles, keep its footing on uneven ground and spread its weight across many points of support. An eight-legged design adds redundancy: the robot always has several feet planted, which keeps it stable while carrying a load, and it can hold its position on very little power, so it can stop, wait and listen.`
2. `id: 'by-evolution'`, title `Designed by evolution`, body:
   1. `Rather than invent locomotion from scratch, we look to the most successful walkers on Earth. Arthropods — insects, spiders and their relatives — have refined their movement over more than 380 million years, and today thrive almost everywhere, from rainforest canopies and desert sand to caves, cliff faces and the gaps beneath fallen debris. Their gaits, body proportions and reflexes are field-tested solutions to the same problems our robots face.`
   `includes`:
   - `Carries a payload at its centre, built to hold sensors, cameras and onboard computers`
   - `Senses what is ahead, with room for environmental sensor packages`
   - `Climbs using a dedicated wave gait that lifts the body over obstacles`
   - `Operates wirelessly, with live diagnostics and over-the-air software updates`
3. `id: 'next'`, title `Where we’re heading`, body:
   1. `The Huntsman has completed its first prototype stage. The second generation, now in development, is built toward a robot that can enter a disaster zone, move through it on its own and send back what it finds — giving rescuers the information they need without putting more lives at risk.`
   `includes`:
   - `Stronger joints for heavier payloads`
   - `Pressure-sensing feet, so the robot can feel the ground beneath it`
   - `Body-orientation sensing, so it can keep its balance on unstable terrain`
   - `Simulated playgrounds for machine learning, so it can choose its own path over rough ground`
   - `An onboard mesh network to reconnect communications in a blackout`

Check the copy against `CLAUDE.md`'s content rules: nobody is called an
engineer, and nothing claims a qualification. Log the result.

## 2b. Websites photos: real work, not stock

The Websites stream shows our own sites rather than stock:

- `doorPhoto`: the existing `don-gino.jpg` media (the venue screenshot), with the
  alt text its `/built` entry uses.
- `stepPhoto`: the existing `nug.jpg` media, with its `/built` alt text.

Reuse the media documents the seed already created for `/built`. Do not upload
duplicates. Remove the `websites-door` and `websites-step` stock photos from
the seed and from `media` if nothing else uses them.

**Software stays on stock for now.** It gets Mik's photo of Simon and Craig at
the PC when the shoot lands, through the admin. Do not use any Aptium portal
screenshot anywhere: those screens are under NDA.

## 3. Tidy

- `media-inbox/robotics/`: once every file used above is in `media`, delete
  the used files from the inbox. Keep the two unused sim clips.
- `CLAUDE.md` → Current state: Robotics copy is in; `/built` placeholders are
  now Training Professionals and QUT capstones only (confirm against the data
  and list what is actually left).

## Verify

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test:ci
pnpm build
```

1. `pnpm seed` is still idempotent: run it twice, and the second run changes
   nothing.
2. `/robotics` shows no `[pending]` or placeholder marker, with the three
   sections in order.
3. `/built` leads with Project Arachnid's video, muted and looping, with a
   pause control, poster-only under reduced motion. `/built/project-arachnid`
   renders and `/built/spider-drones` 404s.
4. The fold door and the "What changes" row for Robotics show the Huntsman
   photos, and Websites shows Don Gino (door) and Nug (row).
5. axe on `/`, `/robotics`, `/built` and `/built/project-arachnid`, light and
   dark: 0 violations.

## The log

Append to `docs/briefs/robotics-content.log.md`. Last line exactly one of
`STATUS: done`, `STATUS: partial`, `STATUS: blocked`.
