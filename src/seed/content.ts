/*
 * EVERYTHING THE SEED WRITES. Generated once from the old runtime constants
 * (src/constants/streams.ts, built.ts, crew.ts, partners.ts, photos.ts) on
 * 5 November 2026, then those were deleted: the database is the source of truth
 * from here, and this file is how an empty database gets to the launch state.
 *
 * ⚠ ONCE THE ADMIN HAS BEEN USED, EDIT THERE, NOT HERE. The seed refuses to
 * overwrite a row edited in the admin since it last wrote it (guard.ts).
 *
 * ASSETS are keyed by their path under src/seed/assets/, without the
 * extension. One file is one media document, however many fields use it:
 * built/nug is both the Nug card's screenshot and one of the venue sites.
 *
 * What is NOT here, on purpose:
 *   - Any stock portrait. Craig, Simon and Ronan have their real portraits
 *     from Mik's shoot (hero-rebuild). Tom has none, permanently.
 *   - Any stock photograph. The last three went in hero-rebuild, replaced by
 *     the shoot's (they are in `retired.media`).
 *   - The Websites stock photos. The row shows our own Nug site, cropped
 *     for its slot (hero-polish §3).
 *   - STREAM_COMMON, landings, contact and the headline words, which stay in
 *     code (CLAUDE.md, CMS).
 *
 * Content rules still apply to every word below (CLAUDE.md): no "Class A",
 * nobody is an engineer, `pending`/`placeholder` stay until the words are
 * confirmed.
 */
import type { SeedContent } from './types'

const content: SeedContent = {
  assets: {
    'websites/nug-row': {
      file: 'websites/nug-row.jpg',
      alt: 'The Nug General Store homepage: the NUG. wordmark above a photograph of the shopfront window with “Handmade pasta” in gold, beside a green panel with Book a table and See the pasta buttons.',
    },
    'built/huntsman-walk': {
      file: 'built/huntsman-walk.mp4',
      alt: 'The Huntsman, an eight-legged black robot, walking across a timber floor under a single light.',
    },
    'built/huntsman-walk-poster': {
      file: 'built/huntsman-walk-poster.jpg',
      alt: 'A still from the walking clip: The Huntsman, an eight-legged black robot, on a timber floor under a single light.',
    },
    'built/nug': {
      file: 'built/nug.jpg',
      alt: 'The Nug General Store website: the NUG. wordmark over a photograph of the shopfront window, its gold lettering reading “Handmade pasta”, beside a sage panel reading “Ben makes everything himself. Ruxi looks after everyone.”',
    },
    'built/snug': {
      file: 'built/snug.jpg',
      alt: 'The Snug site: a cream wordmark on an olive bar above a dark photograph of the room at night, seen through the window, captioned “a tiny café, a neighbourhood wine bar”.',
    },
    'built/janes-deli': {
      file: 'built/janes-deli.jpg',
      alt: 'The Jane’s Deli site: a scalloped olive badge logo on warm paper, a photograph of three iced drinks on a pale green table, and an olive panel reading “brunch. sandwiches. filter & matcha.”',
    },
    'built/bar-coopers': {
      file: 'built/bar-coopers.jpg',
      alt: 'The Bar Cooper’s site: the name set large in brick-red on near-black beside a photograph of the restored wood-fired oven, lit, in its tiled surround.',
    },
    'built/don-gino': {
      file: 'built/don-gino.jpg',
      alt: 'The Don Gino site: the name set large in yellow on black under a gold script logo, with three circular Italian tile motifs labelled Famiglia, Menu and Hours.',
    },
    'photos/robotics/huntsman-studio': {
      file: 'photos/robotics/huntsman-studio.jpg',
      alt: 'The Huntsman from the side, legs raised mid-step, on a workbench.',
    },
    'crew/asuka-hirai': {
      file: 'crew/asuka-hirai.jpg',
      alt: 'Asuka Hirai',
    },
    'logos/partners/aptium': {
      file: 'logos/partners/aptium.png',
      alt: 'Aptium logo',
    },
    'logos/partners/qut': {
      file: 'logos/partners/qut.png',
      alt: 'QUT logo',
    },
    'logos/partners/training-professionals': {
      file: 'logos/partners/training-professionals.png',
      alt: 'Training Professionals logo',
    },
    'built/venues-montage': {
      file: 'built/venues-montage.jpg',
      alt: 'Five venue websites side by side: Nug General Store, Snug, Jane’s Deli, Bar Cooper’s and Don Gino.',
    },
    'built/training-professionals': {
      file: 'built/training-professionals.jpg',
      alt: 'Two screens from the Training Professionals platform: the live assessment editor, and a marking view comparing a candidate’s answers with the answer guide.',
    },
    'built/sauce': {
      file: 'built/sauce.jpg',
      alt: 'A sheet of SAUCE components — inputs, buttons, a table and a dropdown — on a dark theme.',
    },
    'crew/simon-hanmer': {
      file: 'crew/simon-hanmer.jpg',
      alt: 'Simon Hanmer',
    },
    'crew/ronan-donahoe': {
      file: 'crew/ronan-donahoe.jpg',
      alt: 'Ronan Donahoe',
    },
    'crew/craig-schneider': {
      file: 'crew/craig-schneider.jpg',
      alt: 'Craig Schneider',
    },
    'photos/team-group': {
      file: 'photos/team-group.jpg',
      alt: 'Simon, Craig and Ronan in V Source shirts against a wall of jasmine.',
    },
    'photos/at-the-desk': {
      file: 'photos/at-the-desk.jpg',
      alt: 'Craig talks through code on a monitor while Simon types at the keyboard.',
    },
    'photos/pointing': {
      file: 'photos/pointing.jpg',
      alt: 'Craig points to a line of code on a monitor while Simon looks on.',
    },
    'hero/hero-software-stage': {
      file: 'hero/hero-software-stage.jpg',
      alt: 'A hand points to code on a monitor.',
    },
    'hero/hero-software-band': {
      file: 'hero/hero-software-band.jpg',
      alt: 'A hand points to code on a monitor.',
    },
    'hero/hero-robotics-stage': {
      file: 'hero/hero-robotics-stage.jpg',
      alt: 'The Huntsman, an eight-legged robot, on a stone bench.',
    },
    'hero/hero-robotics-band': {
      file: 'hero/hero-robotics-band.jpg',
      alt: 'The Huntsman, an eight-legged robot, on a stone bench.',
    },
    'hero/hero-websites-stage': {
      file: 'hero/hero-websites-stage.jpg',
      alt: 'Inside Snug at night, through the window: table lamps, glasses and plates on the counter.',
    },
    'hero/hero-websites-band': {
      file: 'hero/hero-websites-band.jpg',
      alt: 'Inside Snug at night, through the window: table lamps, glasses and plates on the counter.',
    },
    'hero/hero-software': {
      file: 'hero/hero-software.jpg',
      alt: 'A hand points to a line of code on a monitor while Simon looks on.',
    },
    'hero/hero-websites': {
      file: 'hero/hero-websites.jpg',
      alt: 'The Snug website: its wordmark over a dark photograph of the room at night.',
    },
    'robotics/huntsman-model': {
      file: 'robotics/huntsman-model.jpg',
      alt: 'A CAD render of The Huntsman showing its eight legs, servos and central payload bay.',
    },
    'robotics/huntsman-sim-controls': {
      file: 'robotics/huntsman-sim-controls.mp4',
      alt: 'The Huntsman walking forward in a MuJoCo simulation, with its operator controls for walk, trot, rubble and crouch gaits on screen.',
    },
    'robotics/huntsman-sim-controls-poster': {
      file: 'robotics/huntsman-sim-controls-poster.jpg',
      alt: 'A still from the simulation clip: The Huntsman in MuJoCo, with its operator controls on screen.',
    },
  },
  streams: [
    {
      slug: 'software',
      name: 'Software',
      order: 10,
      problem: 'Your process lives in a spreadsheet and three people’s heads.',
      instead: 'One system, built around how you actually work.',
      solution:
        'Off-the-shelf platforms make you work their way. We build to the process you already run, so nothing lives in a side spreadsheet, and when someone asks what happened, the system can show them.',
      stepPhoto: 'photos/pointing',
      promise:
        'The thing your business actually does, instead of the nearest platform that almost does it.',
      pageLede:
        'We build the system your work already implies, rather than reshaping how you work to fit something that nearly fits. Next.js, React and TypeScript on the front, Node and MySQL behind it, and a design system built for your industry instead of assembled from a component shop.',
      pagePhoto: 'hero/hero-software',
      sections: [
        {
          slug: 'custom-software',
          title: 'Built to your process',
          body: [
            'Most software work fails at the boundaries — between front end and back end, between build and handover, between the people who designed it and the people who maintain it. We do not have those boundaries, because the same small team does all of it.',
            'That is also why the price works. Genuinely custom software has been out of reach for most organisations, which is why so many end up bending their operation around a platform that nearly fits. Owning our own tools and running our own hardware is what changes that arithmetic.',
          ],
          includes: [
            'Discovery and scoping, priced before we start',
            'Front end, API and database',
            'A design system specific to your product',
            'Documentation written as we build, not afterwards',
          ],
          link: {
            href: null,
            label: null,
          },
          pending: false,
          media: {
            upload: 'built/training-professionals',
            poster: null,
            alt: 'Two screens from the Training Professionals platform: the live assessment editor, and a marking view comparing a candidate’s answers with the answer guide.',
          },
        },
        {
          slug: 'regulated',
          title: 'Regulated and safety-critical work',
          body: [
            'We build medical device software to IEC 62304, and regulation is mostly an evidence problem: it is not enough that the software works, you have to be able to demonstrate you knew it worked before you shipped it.',
            'There is a longer piece on how we do that, and on what the standard actually requires.',
          ],
          includes: [
            'Documentation maintained as a deliverable',
            'Test coverage as audit evidence',
            'Traceable change history',
            'Handover packs that survive staff turnover',
          ],
          link: {
            href: '/regulated',
            label: 'What regulated work involves',
          },
          pending: false,
          media: {
            upload: 'built/sauce',
            poster: null,
            alt: 'A sheet of SAUCE components — inputs, buttons, a table and a dropdown — on a dark theme.',
          },
        },
      ],
      lede: 'The thing your business actually does — not the nearest platform that almost does it.',
      caps: [
        'Business systems, portals and internal tools, built to your process rather than around someone else’s',
        'Regulated work with the evidence to prove it: IEC 62304 for medical device software',
        'WCAG 2.2 AA accessibility as a floor, not an afterthought',
        'Hosted on hardware we own, in Australia, with no licence fee that grows every year',
      ],
      who: 'For organisations whose work does not fit a platform.',
      proof: {
        label: 'Current work',
        body: 'A TGA-regulated medical device portal for Aptium — front end, API, design system and hosting, built to IEC 62304. Training Professionals, and CurbHire starting now.',
        pending: false,
      },
      pricing: {
        value: 'Priced per project',
        note: 'Nothing here can be honestly priced before it is scoped. Discovery is quoted first and separately, so you find out what it costs before you commit to building it.',
      },
    },
    {
      slug: 'robotics',
      name: 'Robotics',
      order: 20,
      problem: 'The places survivors are trapped are the places rescuers can’t safely go.',
      instead: 'Robots that walk where wheels stop.',
      solution:
        'Each foot picks its own ground, so the robot can step over debris, keep its footing on loose material and carry its sensors into gaps people can’t safely reach.',
      stepPhoto: 'built/huntsman-walk-poster',
      stepClip: 'built/huntsman-walk',
      promise: 'Robots that go where people can’t, so rescuers don’t have to.',
      pageLede:
        'After an earthquake, a building collapse or a landslide, the first hours matter most. We build legged robots to put eyes, sensors and eventually supplies into the places rescuers can’t safely reach.',
      pagePhoto: 'photos/robotics/huntsman-studio',
      sections: [
        {
          slug: 'why-legs',
          title: 'Why legs, not wheels',
          body: [
            'Wheels and tracks work well on roads and open ground. Disaster zones offer neither. Debris fields are broken and uneven, with gaps, steps and loose material that can stop a wheeled platform outright.',
            'Legged robots move differently, and go where wheels and rotors can’t. Each foot picks its own contact point, so the robot can step over obstacles, keep its footing on uneven ground and spread its weight across many points of support. An eight-legged design adds redundancy: the robot always has several feet planted, which keeps it stable while carrying a load, and it can hold its position on very little power, so it can stop, wait and listen.',
          ],
          includes: [],
          link: {
            href: null,
            label: null,
          },
          pending: false,
          media: {
            upload: 'built/huntsman-walk',
            poster: 'built/huntsman-walk-poster',
            alt: 'The Huntsman, an eight-legged black robot, walking across a timber floor.',
          },
        },
        {
          slug: 'by-evolution',
          title: 'Designed by evolution',
          body: [
            'Rather than invent locomotion from scratch, we look to the most successful walkers on Earth. Arthropods — insects, spiders and their relatives — have refined their movement over more than 380 million years, and today thrive almost everywhere, from rainforest canopies and desert sand to caves, cliff faces and the gaps beneath fallen debris. Their gaits, body proportions and reflexes are field-tested solutions to the same problems our robots face.',
          ],
          includes: [
            'Carries a payload at its centre, built to hold sensors, cameras and onboard computers',
            'Senses what is ahead, with room for environmental sensor packages',
            'Climbs using a dedicated wave gait that lifts the body over obstacles',
            'Operates wirelessly, with live diagnostics and over-the-air software updates',
          ],
          link: {
            href: null,
            label: null,
          },
          pending: false,
          media: {
            upload: 'robotics/huntsman-model',
            poster: null,
            alt: 'A CAD render of The Huntsman showing its eight legs, servos and central payload bay.',
          },
        },
        {
          slug: 'next',
          title: 'Where we’re heading',
          body: [
            'The Huntsman has completed its first prototype stage. The second generation, now in development, is built toward a robot that can enter a disaster zone, move through it on its own and send back what it finds — giving rescuers the information they need without putting more lives at risk.',
          ],
          includes: [
            'Stronger joints for heavier payloads',
            'Pressure-sensing feet, so the robot can feel the ground beneath it',
            'Body-orientation sensing, so it can keep its balance on unstable terrain',
            'Simulated playgrounds for machine learning, so it can choose its own path over rough ground',
            'An onboard mesh network to reconnect communications in a blackout',
          ],
          link: {
            href: null,
            label: null,
          },
          pending: false,
          media: {
            upload: 'robotics/huntsman-sim-controls',
            poster: 'robotics/huntsman-sim-controls-poster',
            alt: 'The Huntsman walking forward in a MuJoCo simulation, with its operator controls for walk, trot, rubble and crouch gaits on screen.',
          },
        },
      ],
      lede: 'Bio-inspired legged robots for terrain too dangerous, too unstable or too confined for people or conventional machines.',
      caps: [
        'Eight-legged platforms with a gait that keeps the body supported at all times',
        'Sensor, camera and compute payloads carried at the centre',
        'Wireless control with live diagnostics and over-the-air updates',
        'Simulated training environments for machine-learned gaits',
      ],
      who: 'For search and rescue, emergency services, and anyone who needs to see inside places people can’t safely enter.',
      proof: {
        label: 'Current work',
        body: 'Project Arachnid: The Huntsman, our first eight-legged prototype, stands, walks, turns, detects obstacles and climbs.',
        pending: false,
      },
      pricing: {
        value: 'Scoped per project',
        note: 'Robotics work is research-led. We scope it with you against what the robot has to reach and what it has to bring back.',
      },
    },
    {
      slug: 'websites',
      name: 'Websites',
      order: 30,
      // Off the site while Simon shows Craig two streams (hide-websites).
      // Untick in /admin to bring it back; its content and media are kept.
      hidden: true,
      problem: 'Every change to your site is a quote and a fortnight.',
      instead: 'A site you can change yourself, the afternoon you decide to.',
      solution:
        'Fast, accessible and built for the people who use it. When the menu or the hours change, you change them, without a quote or a fortnight’s wait.',
      stepPhoto: 'websites/nug-row',
      promise: 'A site that loads fast, reads well, and that you can change yourself.',
      pageLede:
        'Designed and built here, on the same stack and the same hardware as everything else we run. Not a theme with your logo on it, and not something you have to ring us about every time a price changes.',
      pagePhoto: 'hero/hero-websites',
      sections: [
        {
          slug: 'accessibility',
          title: 'Accessible, and measured rather than asserted',
          body: [
            'WCAG 2.2 AA is the level most Australian organisations are now expected to meet, and it covers considerably more than people expect. We build to it from the start, because retrofitting costs several times what designing for it does.',
            'The national firms audit but do not remediate. We do both, in one team.',
          ],
          includes: [
            'WCAG 2.2 AA as a floor, not a finishing task',
            'Audit and remediation by the same team',
            'Real assistive-technology testing, not an overlay widget',
            'Performance measured on the hardware people actually use',
          ],
          link: {
            href: '/accessibility',
            label: 'Audits that come with the fix',
          },
          pending: false,
          media: {
            upload: 'websites/nug-row',
            poster: null,
            alt: 'The Nug General Store homepage: the NUG. wordmark above a photograph of the shopfront window with “Handmade pasta” in gold, beside a green panel with Book a table and See the pasta buttons.',
          },
        },
        {
          slug: 'yours-to-edit',
          title: 'Yours to edit',
          body: [
            'A site nobody but us can change is a site that quietly goes out of date. You get the ability to change copy, prices, people and pages yourself, without a per-seat licence and without a ticket.',
            'We are still here when you want more than that — but wanting a new paragraph on a Tuesday should not be a project.',
          ],
          includes: [
            'Content you can change yourself',
            'No licence per seat, no per-edit charge',
            'Designed and built in house, not from a template',
            'Australian hosting on the same hardware as everything else we run',
          ],
          link: {
            href: null,
            label: null,
          },
          pending: false,
          media: {
            upload: 'built/janes-deli',
            poster: null,
            alt: 'The Jane’s Deli site: a scalloped olive badge logo on warm paper, a photograph of three iced drinks on a pale green table, and an olive panel reading “brunch. sandwiches. filter & matcha.”',
          },
        },
      ],
      lede: 'A site that loads fast, reads well, and that you can actually edit without calling us.',
      caps: [
        'Marketing sites and web applications, designed and built in house',
        'Accessible and fast by default — measured, not asserted',
        'Content you can change yourself, without a licence per seat',
        'Australian hosting on the same hardware as everything else we run',
      ],
      who: 'For businesses whose site is doing less than it should.',
      proof: {
        label: 'Current work',
        body: 'This site, and five hospitality sites across Brisbane, all on the Built page. Each one built the way yours would be.',
        pending: false,
      },
      pricing: {
        value: 'From $150 a month',
        note: 'On a 12-month term, for a straightforward business site: design, build, hosting, and changes you can make yourself — no setup fee and no per-edit charge. That is the floor, not the average. Anything with the complexity of this site is quoted.',
      },
    },
  ],
  projects: [
    {
      slug: 'project-arachnid',
      title: 'Project Arachnid',
      order: 10,
      featured: true,
      placeholder: false,
      client: 'V Source',
      stream: 'robotics',
      year: '2026',
      status: 'building',
      line: 'Bio-inspired legged robots for places people can’t go.',
      lede: 'After an earthquake, a building collapse or a landslide, the first hours matter most — and they are the hours when rescue teams face the most danger. Project Arachnid builds legged robots to go where people can’t.',
      body: [
        'Collapsed structures, unstable rubble, smoke and confined voids make many of the places survivors are trapped too dangerous for people to enter. Project Arachnid builds legged robots for these human-denied environments: terrain too dangerous, too unstable or too confined for people or conventional machines.',
        'The aim is to put eyes, sensors and eventually supplies into the spaces between the rubble, so rescue teams can find survivors sooner and with less risk.',
        'Our flagship platform, The Huntsman, takes its cues from the huntsman spider and its distant cousin the wolf spider — fast, low-slung and agile hunters. It walks on eight legs using an alternating gait drawn from arthropod locomotion, so its body stays supported at all times.',
        'The first prototype stands, walks, turns, detects obstacles and climbs. The second generation, now in development, adds stronger joints for heavier payloads, pressure-sensing feet, body-orientation sensing, simulated training environments for machine learning, and an onboard mesh network to restore communications in a blackout.',
      ],
      facts: [
        {
          label: 'Stream',
          value: 'Robotics',
        },
        {
          label: 'Platform',
          value: 'The Huntsman, eight legs',
        },
        {
          label: 'Stage',
          value: 'First prototype complete',
        },
        {
          label: 'Next',
          value: 'Second generation in development',
        },
      ],
      url: null,
      media: {
        kind: 'video',
        fit: 'cover',
        upload: 'built/huntsman-walk',
        poster: 'built/huntsman-walk-poster',
        markId: null,
        alt: 'The Huntsman, an eight-legged black robot, walking across a timber floor under a single light.',
        long: {
          href: null,
          label: null,
        },
      },
      draft: false,
      sites: [],
    },
    {
      slug: 'aptium-portal',
      title: 'A TGA-regulated medical device portal',
      order: 20,
      featured: false,
      placeholder: false,
      client: 'Aptium',
      stream: 'software',
      year: '2025–',
      status: 'building',
      line: 'Front end, API, design system and hosting for a regulated device, built to IEC 62304.',
      lede: 'A clinic-facing portal for a TGA-regulated medical device, built by one small team from the interface down to the hardware it runs on.',
      body: [
        'Clinics use it to manage their scanners, review results and run their own users. Behind it sits an API that handles device communication, scan processing, document generation and notifications, and under both sits infrastructure we own and operate. The same people built every layer, so nothing was handed across a boundary where the reasoning got lost.',
        'Because the software is part of a regulated device, the evidence matters as much as the code. It is built to IEC 62304: documentation versioned with the code and true at every commit, tests that stand as evidence rather than reassurance, and a change history that will survive an audit years from now.',
        'There are no screenshots here, and there will not be. Aptium can be named; what is on its screens cannot be shown.',
      ],
      facts: [
        {
          label: 'Stream',
          value: 'Software',
        },
        {
          label: 'Standard',
          value: 'IEC 62304',
        },
        {
          label: 'Accessibility',
          value: 'WCAG 2.2 AA',
        },
        {
          label: 'Hosting',
          value: 'Our own hardware, AU',
        },
      ],
      url: null,
      media: {
        kind: 'logo',
        fit: 'cover',
        upload: 'logos/partners/aptium',
        poster: null,
        markId: null,
        alt: 'Aptium logo',
        long: {
          href: null,
          label: null,
        },
      },
      draft: false,
      sites: [],
    },
    {
      slug: 'training-professionals',
      title: 'Training Professionals',
      order: 30,
      featured: false,
      placeholder: false,
      client: 'Training Professionals',
      stream: 'software',
      year: '2026',
      status: 'live',
      line: 'A ten-year-old training platform, rebuilt, with AI marking that runs on hardware we own.',
      lede: 'Training Professionals had a platform that had grown for a decade. We rebuilt it, then added AI-assisted marking.',
      body: [
        'We rebuilt a ten-year-old training platform from the ground up.',
        'On top of it sits an AI marking pipeline: student work is read with OCR and assessed by an open-weight model running on hardware we own in Australia, so it never goes to a third-party AI service. The marking shipped as an MVP and is in use.',
      ],
      facts: [
        {
          label: 'Stream',
          value: 'Software',
        },
        {
          label: 'Work',
          value: 'Platform rebuild',
        },
        {
          label: 'AI',
          value: 'OCR and marking, open-weight model',
        },
        {
          label: 'Hosting',
          value: 'Our own hardware, AU',
        },
      ],
      url: null,
      media: {
        kind: 'image',
        fit: 'contain',
        upload: 'built/training-professionals',
        poster: null,
        markId: null,
        alt: 'Two screens from the Training Professionals platform: the live assessment editor, and a marking view comparing a candidate’s answers with the answer guide.',
        long: {
          href: null,
          label: null,
        },
      },
      draft: false,
      sites: [],
    },
    {
      slug: 'sauce',
      title: 'SAUCE',
      order: 40,
      featured: false,
      placeholder: false,
      client: 'V Source',
      stream: 'software',
      year: '2025–',
      status: 'live',
      line: 'Our own component library, and the reason nothing on this page looks like a template.',
      lede: 'SAUCE is the component library our interfaces are built from — written by us, documented, tested, and themed through tokens.',
      body: [
        'Every input, table, modal and control in it is ours, documented in Storybook and covered by tests. A token system sits underneath, so one set of components can carry a different brand per client, or per tenant at runtime, without being forked.',
        'We built it instead of reaching for Tailwind, Material UI or a bought template because those optimise for getting something on screen fast, and the cost is that everything built with them looks and behaves alike. A tool for a clinic should not feel like a marketing dashboard. Owning the kit also means a breaking change, a vulnerability or an abandoned package is our problem on our schedule, not someone else’s on theirs.',
      ],
      facts: [
        {
          label: 'Stream',
          value: 'Software',
        },
        {
          label: 'Kind',
          value: 'Our own tooling',
        },
        {
          label: 'Theming',
          value: 'Tokens, per tenant at runtime',
        },
        {
          label: 'Documented',
          value: 'Storybook',
        },
      ],
      url: null,
      media: {
        kind: 'image',
        fit: 'contain',
        upload: 'built/sauce',
        poster: null,
        markId: null,
        alt: 'A sheet of SAUCE components — inputs, buttons, a table and a dropdown — on a dark theme.',
        long: {
          href: null,
          label: null,
        },
      },
      draft: false,
      sites: [],
    },
    {
      slug: 'brisbane-venues',
      title: 'Five Brisbane venues',
      order: 50,
      featured: false,
      placeholder: false,
      client: 'Hospitality group',
      stream: 'websites',
      year: '2026',
      status: 'live',
      line: 'Five venue sites, each with its own brand, all edited by the people who run the room.',
      lede: 'A pasta bar, a café and wine bar, a deli, a wood-fired bistro and a trattoria — five venues across Brisbane, each needing to look like nobody else.',
      body: [
        'Each site starts from the room rather than a swatch: the palette comes from the signage, the bar and the light the menu sits in, which is why each one looks like the place rather than like a template.',
        'The menu changes, the hours change, and a site that needs a quote and a fortnight for either quietly goes out of date. These are edited by the people who run the venues, copy and photographs, from an admin with a preview, without a developer in the loop.',
      ],
      facts: [
        {
          label: 'Stream',
          value: 'Websites',
        },
      ],
      url: null,
      media: {
        kind: 'image',
        fit: 'contain',
        upload: 'built/venues-montage',
        poster: null,
        markId: null,
        alt: 'Five venue websites side by side: Nug General Store, Snug, Jane’s Deli, Bar Cooper’s and Don Gino.',
        long: {
          href: null,
          label: null,
        },
      },
      sites: [
        {
          name: 'Nug General Store',
          url: 'https://nuggeneralstore.com/',
          where: 'Bakery Lane, Fortitude Valley',
          screenshot: 'built/nug',
        },
        {
          name: 'Snug',
          url: 'https://goodsnug.com/',
          where: 'Coorparoo, Brisbane',
          screenshot: 'built/snug',
        },
        {
          name: 'Jane’s Deli',
          url: 'https://janes-deli.com/',
          where: 'Coorparoo, Brisbane',
          screenshot: 'built/janes-deli',
        },
        {
          name: 'Bar Cooper’s',
          url: 'https://barcoopers.com/',
          where: 'Shop 4, 321 Chatsworth Rd, Coorparoo',
          screenshot: 'built/bar-coopers',
        },
        {
          name: 'Don Gino',
          url: 'https://dongino.com.au/',
          where: '65 Hardgrave Rd, West End',
          screenshot: 'built/don-gino',
        },
      ],
      draft: false,
    },
  ],
  crew: [
    {
      slug: 'craig-schneider',
      name: 'Craig Schneider',
      order: 10,
      pending: false,
      role: 'Founder & Technical Director',
      summary: 'Computer science, engineering, and two decades on site. Runs the shop.',
      bio: [
        'Craig runs V Source. He holds a computer science degree from QUT and is completing an engineering degree in computer and software systems, alongside two decades in residential construction, communications infrastructure and site supervision. That range is why we can talk about the hardware a system runs on and the site it is installed on, not only the code — and why, when an install has to pass inspection, someone here has already been the person accountable for that.',
      ],
      portrait: 'crew/craig-schneider',
    },
    {
      slug: 'simon-hanmer',
      name: 'Simon Hanmer',
      order: 20,
      pending: false,
      role: 'Lead Developer & UX',
      summary: 'Designs it and builds it. Twenty years in kitchens before the degree.',
      bio: [
        'Simon designs and builds the part clients actually use — the interface, the system behind it, and often the brand around it. He holds a computer science degree from QUT, and before it spent twenty-odd years running kitchens — launching restaurants, and running services where a hundred covers arrive inside ninety minutes and nothing is permitted to fail quietly. Consistency under load, working to a deadline that does not move, and knowing precisely how much can go wrong at once: that turns out to be most of what shipping software actually is.',
      ],
      portrait: 'crew/simon-hanmer',
    },
    {
      slug: 'ronan-donahoe',
      name: 'Ronan Donahoe',
      order: 30,
      pending: false,
      role: 'Testing & Robotics',
      summary: 'Finds it before the auditor does.',
      bio: [
        'Ronan tests what we build and writes the documentation that proves how it behaves. This is the kind of behind-the-scenes work that can make or break a product’s release or a compliance audit.',
        'He’s drawn to problems without an obvious answer, which is exactly the right instinct for the job: good testing requires someone who can look at the system from a different angle than the people who designed it.',
        'There is more to Ronan than just testing and documentation though. He is currently studying a double degree in Mechatronics Engineering and Computational & Applied Mathematics: hardware, software, and the maths that ties them together. He uses this range to find solutions that are practical and elegant, which usually means finding a smarter way to make something work rather than a more complicated one.',
        'Ronan is another V Source team member with a background in hospitality (by coincidence, not by design). While Simon’s background was in the kitchen, Ronan looked after the front of house, where staying calm under pressure and solving problems on the fly is an indispensable skill. People are unpredictable, and understanding that is invaluable.',
      ],
      portrait: 'crew/ronan-donahoe',
    },
    {
      slug: 'asuka-hirai',
      name: 'Asuka Hirai',
      order: 40,
      pending: false,
      role: 'Testing & Machine Learning',
      summary:
        'Tests it until he knows why it works — computer science, with a background in machine learning.',
      bio: [
        'Asuka holds a Bachelor of Information Technology, majoring in Computer Science, from QUT, with an academic background in machine learning, computer vision, and software development. At V Source, he focuses on software testing and quality assurance, identifying issues that might otherwise go unnoticed and ensuring the final product works as intended. With a particular interest in artificial intelligence and problem-solving, he brings an analytical approach to his work and a curiosity for understanding not just whether something works, but why it works — or why it doesn’t.',
      ],
      portrait: 'crew/asuka-hirai',
    },
    {
      slug: 'tom-lee',
      name: 'Tom Lee',
      order: 50,
      pending: false,
      role: 'Backend & Platform Developer',
      summary: 'Backend, and the platform under it. Knows why it broke at 2am.',
      bio: [
        'Tom writes the code behind the interface — the services, the data and the integrations that make the visible part work. He has worked backend and full-stack since 2018, starting from a Diploma in Web Development and building the rest of the stack himself, which is how most of the people who are good at this actually learned it. On a system that has to keep running unattended, the code is only half the job; the other half is the platform under it, and Tom owns that too, from the servers and networks up to the pipeline that carries a build to a live site. If something breaks at two in the morning, he is the one who already knows why.',
      ],
      portrait: null,
    },
  ],
  partners: [
    {
      slug: 'aptium',
      name: 'Aptium',
      order: 10,
      pending: false,
      kind: 'Client',
      logo: 'logos/partners/aptium',
      body: 'A TGA-regulated medical device portal — front end, API, design system and hosting, built to IEC 62304.',
    },
    {
      slug: 'qut',
      name: 'QUT',
      order: 20,
      pending: false,
      kind: 'Industry partner',
      logo: 'logos/partners/qut',
      body: 'Full industry partner with QUT, with student capstone teams working on live projects with us.',
    },
    {
      slug: 'training-professionals',
      name: 'Training Professionals',
      order: 30,
      pending: false,
      kind: 'Client',
      logo: 'logos/partners/training-professionals',
      body: 'Rebuilt a ten-year-old training platform, then added AI marking that runs on hardware we own in Australia, so student work never goes to a third-party AI service.',
    },
  ],
  site: {
    heroPhotos: {
      software: { photo: 'hero/hero-software-stage', band: 'hero/hero-software-band' },
      robotics: { photo: 'hero/hero-robotics-stage', band: 'hero/hero-robotics-band' },
      websites: { photo: 'hero/hero-websites-stage', band: 'hero/hero-websites-band' },
    },
    workingPhoto: 'photos/at-the-desk',
    groupPhoto: 'photos/team-group',
    comingSoon: [
      {
        name: 'CurbHire',
        stream: 'software',
      },
      {
        name: 'Remy',
        stream: 'software',
      },
      {
        name: 'Paw Connect',
        stream: 'software',
      },
    ],
  },
  retired: {
    projects: [
      'vsource-site',
      'qut-capstones',
      'nug',
      'snug',
      'janes-deli',
      'bar-coopers',
      'don-gino',
    ],
    media: [
      'software-door.jpg',
      'software-step.jpg',
      'working.jpg',
      'placeholder-site.jpg',
      'snug-door.jpg',
      'huntsman-top.jpg',
      'huntsman-terrain-trials.jpg',
      'hero-robotics.jpg',
      'hero-team.jpg',
    ],
  },
}

export default content
