# 2026 NASA Space Apps Challenge — Ready-to-Paste Submission Kit

> **CRITICAL SOLO PARTICIPANT CHECKLIST (FROM OFFICIAL 2026 JUDGING & AWARDS GUIDE):**
> 1. **Local Event Registration Required for Solo Global Judging:** Per the 2026 Judging & Awards Guide, **Local Event teams must have 1–6 people**, whereas **Universal Event teams must have 2–6 people** to be eligible for Global Judging. Since you are competing solo, verify on your `spaceappschallenge.org` profile that you are registered under a **Local Event** (not the Universal Event).
> 2. **Submission Deadline:** **Sunday, November 15, 2026 at 11:59 p.m. local time** (for your Local Event).
> 3. **Demo Requirement:** Submit **either** the 7-slide presentation (`public/slides.html` printed to PDF) **or** a 30-second video (script below).

---

## 1. Project Name
**Silent Monuments: Echoes of Moon, Mars & Deep Space**

- **Live Demo URL (Project Link):** `https://silent-monuments-nasa-2026.vercel.app`
- **7-Slide Deck URL:** `https://silent-monuments-nasa-2026.vercel.app/slides.html`
- **Public GitHub Repo URL:** `https://github.com/23PWCIV6057/silent-monuments-nasa-2026`

---

## 2. Challenge
**Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars**

---

## 3. High-Level Project Summary (Short Summary Field)
**Silent Monuments** is an interactive 2D retro-telemetry adventure game and NSSDCA encyclopedia that brings NASA’s discarded off-world hardware back to life for school-age and casual learners. Stepping into the boots of Junior Archivist Maya, players journey across 5 chapters on the Moon, Mars, Asteroids, and Deep Space—hearing first-person transmissions from Apollo’s Moon Buggy, Opportunity, InSight, Ingenuity, and Pioneer 10, and operating each instrument in hands-on 2D physics mini-games grounded in real NASA data.

---

## 4. Project Details & How It Works (Detailed Description Field)

### The Problem We Solve
For more than half a century, humanity has left landers, descent stages, rovers, helicopters, and deep-space probes across the Solar System. While casual learners hear about active missions like *Perseverance*, retired hardware is often misunderstood as mere "space junk," and dense technical catalogs like the **NASA Space Science Data Coordinated Archive (NSSDCA)** can feel intimidating for school-age students.

### Our Solution: *Silent Monuments*
Inspired by narrative-driven science games, **Silent Monuments** transforms all **13 official NASA hardware suites** from the challenge resources into an interactive, browser-playable 5-chapter quest:

1. **Chapter 1 — Footprints & Mirrors on the Moon (Apollo LM `1969-059C`, LRV `1971-063C`, ALSEP `1969-099C` & Surveyor `1966-116A`):**
   - *First-Person Story:* *Eagle's* Descent Stage and Apollo 15’s *LRV-1 Moon Buggy* explain why descent stages served as launchpads and how ALSEP passive corner-cube mirrors still bounce Earth lasers today.
   - *2D Mini-Game:* Drive the electric Lunar Rover around craters to deploy 3 ALSEP stations, then angle the Laser Ranging Retroreflector to bounce McDonald Observatory’s laser pulse across 384,400 km.
2. **Chapter 2 — The 5,000-Sol Marathon on Mars (Spirit & Opportunity `2003-032A`, Sojourner `1996-068A` & Viking 1/2 `1975-075C`):**
   - *First-Person Story:* *Opportunity* ("Oppy") shares how Martian wind-gust cleaning events extended its 90-sol mission to 5,111 sols before the 2018 global dust storm.
   - *Interactive Slider & 2D Mini-Game:* Explore an interactive **2018 Mars Dust Storm Opacity ($\tau$) Simulator**, then drive *Opportunity* to scan 5 hematite "blueberries" while steering into wind gusts to sweep dust off your solar wings.
3. **Chapter 3 — Listening to the Heartbeat of Mars (InSight `2018-042A` & Phoenix `2007-034A`):**
   - *First-Person Story:* Stationary landers *Phoenix* and *InSight* explain how they dug into polar water-ice and recorded 1,319 marsquakes.
   - *2D Mini-Game:* Tune SEIS wind-shield damping and frequency filters to lock onto real seismic waveforms (`S0173a`, `S0976a`, and `S1222a` Mag 4.7) and reveal Mars’s 1,830 km liquid iron-sulfur core.
4. **Chapter 4 — The Wright Brothers Moment on Another Planet (Ingenuity Mars Helicopter `2020-052B`):**
   - *First-Person Story:* *Ingenuity* ("Ginny") recounts flying 72 times in Mars’s 1%-density atmosphere before a rotor blade tip broke on Flight 72, leaving it as a stationary weather monument at Valinor Hills.
   - *2D Mini-Game:* Pilot *Ingenuity* at 2,400 RPM across Jezero Crater to photograph 3 ancient river delta outcrops for *Perseverance* and land safely at Airfield Chi.
5. **Chapter 5 — Silent Voyagers of Asteroids & Deep Space (NEAR Shoemaker `1996-008A`, Dawn `2007-043A`, Kepler `2009-011A` & Pioneer 10/11 `1972-012A`):**
   - *First-Person Story:* Discover why *Dawn* orbits Ceres forever under planetary protection rules, how *NEAR Shoemaker* improvised a landing on asteroid 433 Eros, and how *Pioneer 10* carries the Golden Plaque toward Aldebaran.
   - *2D Mini-Game:* Rotate NASA’s 70-meter Deep Space Network dish (`0°–360°`) to lock onto all 4 deep-space voyagers and decode their final telemetry.

### Complete NSSDCA Interactive Catalog & Printable Certificate
- Includes a filterable **13-Suite NSSDCA Encyclopedia** with exact coordinates, mass, power specs, scientific breakthroughs, and direct links to `nssdc.gsfc.nasa.gov`.
- Completing all 5 chapters unlocks a personalized, printable **Junior Deep Space Archivist Certificate** for students and classrooms.

---

## 5. Mandatory Super Intelligence (SI / AI) Usage Description
*(Paste this into the SI / AI disclosure section of your submission)*

> **Use of Super Intelligence (SI) Tools:**
> In accordance with the 2026 NASA Space Apps Challenge guidelines, Super Intelligence (SI) tools were used as supportive development assistants during the hackathon:
> - **Brainstorming & Narrative Structure:** Assisted in organizing the 5-chapter educational progression and structuring the interactive gameplay mechanics around each spacecraft's real instrumentation.
> - **Code & Simulation Implementation:** Assisted in writing the React/TypeScript frontend components, HTML5 2D Canvas mini-game simulations, responsive Tailwind CSS styles, and the zero-dependency procedural Web Audio API sound synthesizer.
> - **Scientific Fact Verification:** No scientific data was fabricated. Every spacecraft's NSSDCA ID, launch/end dates, landing coordinates, mass, instrumentation, and scientific discoveries were verified directly against the official NASA NSSDCA catalog and NASA Science Mission Directorate pages provided in the challenge resources.

---

## 6. NASA Data & External References (Paste into References Field)

### Official NASA & NSSDCA Data Sources Used:
1. **NASA Space Science Data Coordinated Archive (NSSDCA):** https://nssdc.gsfc.nasa.gov/
2. **Apollo Lunar Modules (NSSDCA 1969-059C):** https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C
3. **Lunar Roving Vehicles / LRVs (NSSDCA 1971-063C):** https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C
4. **ALSEP Scientific Packages (NSSDCA 1969-099C):** https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C
5. **Surveyor Landers (NASA Science):** https://science.nasa.gov/mission/surveyor-3/
6. **Sojourner / Mars Pathfinder (NASA Science):** https://science.nasa.gov/mission/mars-pathfinder/
7. **Spirit & Opportunity Mars Exploration Rovers (NASA Science):** https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/
8. **Viking 1 & 2 Landers (NASA Science):** https://science.nasa.gov/mission/viking-1/
9. **Phoenix & InSight Mars Landers (NASA Science):** https://science.nasa.gov/mission/insight/
10. **Ingenuity Mars Helicopter (NASA Science):** https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/
11. **Dawn Spacecraft at Vesta & Ceres (NASA Science):** https://science.nasa.gov/mission/dawn/
12. **NEAR Shoemaker at Asteroid 433 Eros (NASA Science):** https://science.nasa.gov/mission/near-shoemaker/
13. **Pioneer 10 & 11 Interstellar Probes (NASA Science):** https://science.nasa.gov/mission/pioneer-10/
14. **Kepler Space Telescope (NASA Science):** https://science.nasa.gov/mission/kepler/

### Open-Source Tools & Libraries Used:
- **React 19 & TypeScript** (MIT License) — UI architecture & state management
- **Vite** (MIT License) — Frontend build tooling
- **Tailwind CSS** (MIT License) — Responsive styling & high-contrast theming
- **Lucide Icons (`lucide-react`)** (ISC License) — Accessible SVG iconography
- **HTML5 2D Canvas API & Web Audio API** (W3C Standard Browser APIs) — Interactive 2D simulations & procedural retro telemetry audio
- **Google Fonts (`Orbitron`, `Space Mono`, `Press Start 2P`, `Inter`)** (SIL Open Font License)

---

## 7. 30-Second Video Script (If Recording a 30s Video Demo)
- **0:00–0:06 (Show Story Quest Header & Chapter 1):** *"Since the 1960s, NASA has left heroic machines across the Solar System—not as junk, but as monuments to discovery. Welcome to Silent Monuments!"*
- **0:06–0:15 (Click through First-Person Dialogue & Moon LRV/Laser Mini-Game):** *"As Junior Archivist Maya, students journey across 5 chapters on the Moon, Mars, and Deep Space—hearing first-person transmissions from Apollo’s Moon Buggy, Opportunity, InSight, Ingenuity, and Pioneer 10."*
- **0:15–0:24 (Show Mars Dust Slider, InSight Core Scan & Ingenuity Flight):** *"In 5 hands-on 2D mini-games grounded in NASA’s NSSDCA archive, players bounce Earth lasers off Apollo retroreflectors, survive Mars’s 2018 dust storm, tune marsquake waves, and fly Ingenuity at 2,400 RPM."*
- **0:24–0:30 (Show NSSDCA Catalog & Printable Archivist Certificate):** *"Complete the archive to earn your Junior Space Archivist Certificate—preserving NASA’s silent pioneers for the Artemis generation!"*
