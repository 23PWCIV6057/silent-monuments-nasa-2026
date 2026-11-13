# SILENT MONUMENTS: Echoes of Moon, Mars & Deep Space

Built for the **2026 NASA International Space Apps Challenge** — Challenge: **[Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars](https://www.spaceappschallenge.org/2026/challenges/nasas-discarded-equipment-storytelling/)**.

- **Live Production App:** [https://silent-monuments-nasa-2026.vercel.app](https://silent-monuments-nasa-2026.vercel.app)
- **7-Slide Presentation Deck:** [https://silent-monuments-nasa-2026.vercel.app/slides.html](https://silent-monuments-nasa-2026.vercel.app/slides.html)
- **GitHub Repository:** [https://github.com/23PWCIV6057/silent-monuments-nasa-2026](https://github.com/23PWCIV6057/silent-monuments-nasa-2026)

## Overview

**Silent Monuments** is an interactive, zero-budget 2D retro-telemetry story quest and **NSSDCA** encyclopedia designed for school-age learners, educators, and space enthusiasts. Players step into the boots of **Junior Archivist Maya** to visit **5 solar-system frontiers** and interact with all **13 official NASA discarded hardware suites** from the challenge resources:

1. **Chapter 1 (The Moon):** Apollo 11–17 Lunar Module Descent Stages (`1969-059C`), Apollo 15–17 Lunar Roving Vehicles (`1971-063C`), ALSEP Scientific Packages & Laser Retroreflectors (`1969-099C`), and Surveyor Landers (`1966-116A`).
2. **Chapter 2 (Mars Surface Rovers):** Spirit & Opportunity (`2003-032A`), Sojourner (`1996-068A`), and Viking 1 & 2 Landers (`1975-075C`), featuring an interactive **2018 Mars Dust Storm Opacity ($\tau$) Slider** and Hematite "Blueberry" survey game.
3. **Chapter 3 (Mars Subsurface & Interior):** InSight (`2018-042A`) and Phoenix (`2007-034A`), featuring an interactive **SEIS Marsquake Waveform Tuner & Liquid Core Mapper**.
4. **Chapter 4 (Jezero Crater Skies):** Ingenuity Mars Helicopter (`2020-052B`), featuring a **2,400 RPM Thin-Air Aerial Scout Flight Simulator**.
5. **Chapter 5 (Asteroids & Deep Space):** NEAR Shoemaker on 433 Eros (`1996-008A`), Dawn at Ceres (`2007-043A`), Kepler Space Telescope (`2009-011A`), and Pioneer 10 & 11 (`1972-012A`), featuring a **70-Meter Deep Space Network Dish Decoder**.

## Quick Start

```bash
npm install
npm run dev
```

- **Verify dataset & build:**
  ```bash
  npm test
  npm run build
  ```
- **7-Slide Presentation Deck:** Open `/slides.html` in the running app (or open `public/slides.html`).
- **Complete Submission Copy-Paste Kit:** See [`SUBMISSION_KIT.md`](./SUBMISSION_KIT.md).

## Use of Super Intelligence (SI / AI) Disclosure

In accordance with the 2026 NASA Space Apps Challenge rules, Super Intelligence (SI) tools were used as supportive coding and design assistants during development (structuring the 5-chapter narrative flow, scaffolding React/TypeScript and HTML5 2D Canvas components, and styling). All scientific parameters, NSSDCA IDs, coordinates, and historical mission outcomes were cross-verified directly against official NASA NSSDCA (`nssdc.gsfc.nasa.gov`) and NASA Science Mission Directorate records.
