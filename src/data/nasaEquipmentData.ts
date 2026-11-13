export interface ArtifactItem {
  id: string;
  name: string;
  nssdcaId: string;
  celestialBody: 'Moon' | 'Mars' | 'Asteroid / Dwarf Planet' | 'Deep Space / Heliocentric';
  locationName: string;
  coordinates: string;
  launchYear: number;
  endYear: string;
  status: 'Dormant Monument' | 'Active Reflector / Passive' | 'Drifting Silently' | 'Stationary Surface Artifact';
  massKg: number;
  chapterId: number;
  tagline: string;
  firstPersonVoice: string;
  whyLeftBehind: string;
  scienceBreakthroughs: string[];
  engineeringSpecs: {
    powerSource: string;
    primaryInstruments: string;
    missionDuration: string;
  };
  officialUrl: string;
  accentColor: string;
}

export interface ChapterData {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  celestialBody: string;
  yearRange: string;
  heroArtifactName: string;
  nssdcaRef: string;
  officialUrl: string;
  characterName: string;
  characterRole: string;
  dialogueIntro: string[];
  scientificContext: string;
  miniGameTitle: string;
  miniGameInstruction: string;
  miniGameScienceNote: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const CHAPTERS: ChapterData[] = [
  {
    id: 1,
    slug: 'moon-tranquility-hadley',
    title: 'Chapter 1: Footprints & Mirrors on the Moon',
    subtitle: 'Sea of Tranquility & Hadley-Apennine (Apollo LM, LRV & ALSEP)',
    celestialBody: 'The Moon',
    yearRange: '1969–1972 (Still reflecting lasers in 2026!)',
    heroArtifactName: 'Apollo 11 LM "Eagle" Descent Stage, ALSEP & Apollo 15 Lunar Rover',
    nssdcaRef: 'NSSDCA 1969-059C / 1969-099C / 1971-063C',
    officialUrl: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C',
    characterName: 'LRV-1 "Moon Buggy" & Eagle Descent Stage',
    characterRole: 'Apollo 11 & 15 Lunar Surface Monuments',
    dialogueIntro: [
      'TRANSMISSION RECEIVED [0.67° N, 23.47° E]: "Greetings, Junior Archivist Maya! I am Eagle’s Descent Stage at Tranquility Base, alongside my cousin LRV-1 parked at Hadley Rille."',
      '"People sometimes call us space junk—but without leaving my heavy landing legs and fuel tanks behind as a launchpad, Neil and Buzz could never have lifted off back to Earth!"',
      '"Even better: the ALSEP Laser Ranging Retroreflector astronauts placed beside me in 1969 requires ZERO battery power and STILL bounces Earth laser pulses back today!"'
    ],
    scientificContext:
      'Apollo missions left six Lunar Module descent stages, three electric Lunar Roving Vehicles (LRVs), and five ALSEP (Apollo Lunar Surface Experiments Package) stations on the Moon. While the seismometers powered down in 1977 after revealing moonquakes and the Moon’s crust thickness, the passive corner-cube Laser Retroreflectors still bounce sub-nanosecond laser pulses from Earth observatories—proving the Moon spirals away from Earth at 3.8 cm per year.',
    miniGameTitle: 'Mission 1: LRV Crater Traverse & Laser Retroreflector Lock',
    miniGameInstruction:
      'PHASE 1: Drive the Apollo 15 electric Lunar Rover (Arrow Keys / WASD or Touch Buttons) across craters to deploy 3 ALSEP experiment nodes. PHASE 2: Fine-tune the Retroreflector mirror angle so Earth’s green laser pulse bounces directly back to the telescope!',
    miniGameScienceNote:
      'Real Science: Corner-cube prisms reflect light back parallel to its incoming beam, letting scientists measure the Earth–Moon distance to within millimeters.',
    quiz: {
      question: 'Why did Apollo astronauts leave the Lunar Module descent stages and Lunar Rovers behind on the Moon?',
      options: [
        'They forgot where they parked them during moonwalks',
        'The descent stage acted as the launchpad, and leaving rovers saved critical ascent fuel mass so astronauts could return safely',
        'NASA planned to refuel them with solar panels the next week',
        'Lunar gravity prevented electric motors from turning off'
      ],
      correctIndex: 1,
      explanation:
        'Every kilogram lifted off the Moon required several kilograms of propellant. Using the descent stage as a launchpad and leaving the 210 kg electric rovers behind allowed astronauts to bring back 382 kg of priceless lunar rocks!'
    }
  },
  {
    id: 2,
    slug: 'mars-meridiani-rovers',
    title: 'Chapter 2: The 5,000-Sol Marathon on Mars',
    subtitle: 'Meridiani Planum & Ares Vallis (Opportunity, Spirit, Sojourner & Viking)',
    celestialBody: 'Mars',
    yearRange: '1976–2018',
    heroArtifactName: 'MER-B Opportunity ("Oppy") & MER-A Spirit',
    nssdcaRef: 'NSSDCA 2003-032A / 1996-068A / 1975-075C',
    officialUrl: 'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/',
    characterName: 'MER-B "Opportunity"',
    characterRole: '90-Sol Rover That Explored Mars for Nearly 15 Years',
    dialogueIntro: [
      'TRANSMISSION RECEIVED [Perseverance Valley, Mars]: "My battery is low and it’s getting dark... Oh! You tuned into my memory log, Maya!"',
      '"Engineers built Spirit and me for just 90 Martian sols. We expected dust to coat our solar arrays within three months—until Martian wind gusts and dust devils kept sweeping our panels clean!"',
      '"I drove 45.16 kilometers—more than a marathon on another world—and found hematite ‘blueberries’ that proved ancient Mars once had liquid water!"'
    ],
    scientificContext:
      'From Viking 1 & 2 (1976) and the shoebox-sized Sojourner rover (1997) to twin rovers Spirit and Opportunity (2004), Mars is dotted with robotic pioneers. Opportunity survived 5,111 sols (56× its 90-sol design life) until a planet-encircling 2018 dust storm spiked atmospheric optical depth (Tau) above 10.8, blocking 99.9% of sunlight.',
    miniGameTitle: 'Mission 2: Hematite "Blueberry" Survey & Dust-Devil Solar Cleaning',
    miniGameInstruction:
      'Drive Opportunity across Meridiani Planum! Scan 5 mineral "blueberries" to confirm ancient water while your solar battery drains in falling dust. Drive into passing turquoise Wind Gusts to sweep dust off your solar wings and recharge!',
    miniGameScienceNote:
      'Real Science: Atmospheric opacity ("Tau") measures sunlight attenuation. Opportunity’s Mössbauer and Alpha Particle X-Ray spectrometers proved jarosite and hematite formed in acidic liquid water.',
    quiz: {
      question: 'How did Spirit and Opportunity survive for years when their solar panels were only rated for 90 sols before dust accumulation?',
      options: [
        'Astronauts wiped the panels clean during flybys',
        'They carried nuclear RTG reactors instead of solar panels',
        'Seasonal Martian wind gusts and passing dust devils naturally swept dust off their solar arrays',
        'Martian rainstorms washed the dust away each spring'
      ],
      correctIndex: 2,
      explanation:
        'Unexpected "cleaning events" from Martian dust devils and wind gusts repeatedly cleared dust from the rovers’ solar arrays, extending Opportunity’s 90-sol mission to 5,111 sols (nearly 15 Earth years)!'
    }
  },
  {
    id: 3,
    slug: 'mars-elysium-insight-phoenix',
    title: 'Chapter 3: Listening to the Heartbeat of Mars',
    subtitle: 'Elysium Planitia & Green Valley (InSight & Phoenix Landers)',
    celestialBody: 'Mars',
    yearRange: '2008–2022',
    heroArtifactName: 'InSight Mars Lander & Phoenix Polar Lander',
    nssdcaRef: 'NSSDCA 2018-042A / 2007-034A',
    officialUrl: 'https://science.nasa.gov/mission/insight/',
    characterName: 'InSight Lander (with SEIS Seismometer)',
    characterRole: 'Geophysical Seismology & Subsurface Ice Monuments',
    dialogueIntro: [
      'TRANSMISSION RECEIVED [Elysium Planitia, 4.5° N, 135.6° E]: "Shhh... listen closely, Maya. While rovers rolled across the rocks, I stayed completely still and pressed a stethoscope to Mars’s chest."',
      '"My cousin Phoenix dug into the northern polar plains in 2008 and tasted real water-ice before the polar winter froze its solar arrays. Ten years later, I placed the SEIS seismometer directly onto Martian soil."',
      '"Before dust silenced my solar wings in December 2022, I detected 1,319 marsquakes—including a magnitude 4.7 monster—mapping Mars’s liquid core for the first time!"'
    ],
    scientificContext:
      'Unlike mobile rovers, stationary landers like Phoenix (2008) and InSight (2018–2022) traded mobility for specialized subsurface instruments. Phoenix excavated shallow water-ice trenches near the north pole, while InSight used its robotic arm to place the ultra-sensitive SEIS seismometer and Wind & Thermal Shield on the ground—measuring Mars’s crust thickness (24–72 km) and its ~1,830 km radius liquid iron-alloy core.',
    miniGameTitle: 'Mission 3: Marsquake Seismogram Tuner & Core Mapper',
    miniGameInstruction:
      'Martian wind vibration is masking deep seismic waves! Adjust the Wind Shield Damping and Seismic Frequency Filter sliders to lock onto 3 genuine Marsquake P-to-S wave arrivals and triangulate Mars’s liquid core!',
    miniGameScienceNote:
      'Real Science: Seismic P-waves (compressional) travel faster than S-waves (shear), and S-waves cannot pass through a liquid core—allowing InSight to measure Mars’s core size from a single station!',
    quiz: {
      question: 'What groundbreaking discovery did InSight make before its dust-covered solar panels lost power in 2022?',
      options: [
        'It detected over 1,300 marsquakes and measured the size and liquid state of Mars’s core',
        'It drilled 50 kilometers deep into underground lava tubes',
        'It launched the first sample return rocket back to Earth',
        'It discovered living ferns inside Martian craters'
      ],
      correctIndex: 0,
      explanation:
        'InSight’s SEIS instrument detected 1,319 marsquakes and meteoroid impacts, revealing Mars’s crust layering, mantle structure, and a large liquid iron-sulfur core.'
    }
  },
  {
    id: 4,
    slug: 'mars-jezero-ingenuity',
    title: 'Chapter 4: The Wright Brothers Moment on Another Planet',
    subtitle: 'Jezero Crater — Airfield Chi (Ingenuity Mars Helicopter)',
    celestialBody: 'Mars',
    yearRange: '2021–2024 (72 Historic Flights)',
    heroArtifactName: 'Ingenuity Mars Helicopter ("Ginny")',
    nssdcaRef: 'NSSDCA 2020-052B (Mars 2020 Helicopter)',
    officialUrl: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/',
    characterName: 'Ingenuity ("Ginny")',
    characterRole: 'First Aircraft in History to Make Powered, Controlled Flight on Another Planet',
    dialogueIntro: [
      'TRANSMISSION RECEIVED [Valinor Hills, Jezero Crater]: "Rotor telemetry online! Hey Maya—do you know how hard it is to fly where the air is only 1% as thick as Earth’s?"',
      '"To lift my 1.8 kg frame on Mars, my dual carbon-fiber blades had to spin at 2,400 RPM—five times faster than a helicopter on Earth! I carried a tiny piece of fabric from the 1903 Wright Flyer under my solar panel."',
      '"I was only built for 5 test hops over 30 days. Instead, I flew 72 times as Perseverance’s aerial scout before a sand ripple clipped my rotor tip on Flight 72 in January 2024!"'
    ],
    scientificContext:
      'Mars’s atmosphere at the surface has the same density as Earth’s atmosphere at 30,000 meters (100,000 ft) altitude. Ingenuity proved aerial scouting works on other worlds, flying 17.0 km total over 128.8 minutes across 72 flights. Even with a damaged rotor blade keeping it grounded at "Valinor Hills," Ingenuity’s avionics can still wake daily to log Martian surface temperatures for decades.',
    miniGameTitle: 'Mission 4: 2,400 RPM Thin-Air Aerial Scout in Jezero Crater',
    miniGameInstruction:
      'Pilot Ingenuity across Jezero Crater! Tap/Hold THRUST (Space / Up Arrow / Button) to keep spinning at 2,400 RPM in Mars’s 1% thin air, steer around sand ripples, photograph 3 Ancient River Delta outcrops for Perseverance, and land gently on Airfield Chi!',
    miniGameScienceNote:
      'Real Science: Featureless sand ripples on Flight 72 confused Ingenuity’s downward visual navigation camera, causing a hard landing that snapped a rotor blade tip.',
    quiz: {
      question: 'Why did Ingenuity’s counter-rotating blades have to spin at ~2,400 RPM while weighing only 1.8 kg?',
      options: [
        'Mars has 10 times stronger gravity than Earth',
        'Mars’s atmosphere is only about 1% as dense as Earth’s, requiring ultra-fast, lightweight blades to generate lift',
        'It needed to outrun supersonic Martian birds',
        'Its solar panel generated too much electricity and had to burn it off'
      ],
      correctIndex: 1,
      explanation:
        'Because Mars’s CO₂ atmosphere has ~1% of Earth’s sea-level density, Ingenuity needed ultralight (1.8 kg) construction and 1.2-meter carbon-fiber blades spinning at ~2,400–2,537 RPM to generate lift.'
    }
  },
  {
    id: 5,
    slug: 'deep-space-eternal-drifters',
    title: 'Chapter 5: Silent Voyagers of Asteroids & Deep Space',
    subtitle: '433 Eros, Ceres, Earth-Trailing Orbit & Interstellar Trajectory',
    celestialBody: 'Asteroids & Deep Space',
    yearRange: '1972–Present',
    heroArtifactName: 'Pioneer 10 & 11, Dawn, NEAR Shoemaker & Kepler Space Telescope',
    nssdcaRef: 'NSSDCA 1972-012A / 1996-008A / 2007-043A / 2009-011A',
    officialUrl: 'https://science.nasa.gov/mission/pioneer-10/',
    characterName: 'Pioneer 10 (with Dawn, NEAR Shoemaker & Kepler)',
    characterRole: 'Deep Space Time Capsules & Planetary Pioneers',
    dialogueIntro: [
      'FAINT S-BAND CARRIER [82 AU / 12.2 Billion km from Earth]: "...kzzzzt... Maya... can your 70-meter Deep Space Network dish still hear a whisper of just 8 watts?"',
      '"Not all of NASA’s monuments rest on the Moon or Mars! NEAR Shoemaker touched down gently on asteroid 433 Eros in 2001. Dawn orbits dwarf planet Ceres forever to protect its organic-rich surface from contamination."',
      '"Kepler drifts in an Earth-trailing orbit after revealing 2,600+ exoplanets, while Pioneer 11 and I carry gold-anodized plaques showing humanity’s home among the stars!"'
    ],
    scientificContext:
      'Hardware left in deep space tells a profound story of planetary stewardship and cosmic reach. Dawn was intentionally left in a stable quarantine orbit around Ceres when its hydrazine ran out in 2018 so it wouldn’t contaminate Ceres’s subsurface brine reservoirs. NEAR Shoemaker became the first spacecraft to land on an asteroid (433 Eros). Kepler proved Earth-sized planets outnumber stars in our galaxy, and Pioneer 10 & 11 crossed the asteroid belt and outer planets carrying Carl Sagan and Frank Drake’s golden plaque.',
    miniGameTitle: 'Mission 5: Deep Space Network (DSN) 70m Dish & Exoplanet Signal Decoder',
    miniGameInstruction:
      'Rotate the 70-meter NASA Deep Space Network antenna (Left/Right or Touch Controls) to lock onto 4 drifting silent spacecraft across the solar system—NEAR Shoemaker, Dawn, Kepler, and Pioneer 10—and decode their final telemetry packets!',
    miniGameScienceNote:
      'Real Science: Pioneer 10’s final signal on January 23, 2003 took 11 hours and 20 minutes traveling at the speed of light to reach NASA’s Deep Space Network on Earth.',
    quiz: {
      question: 'Why did NASA leave the Dawn spacecraft in a perpetual silent orbit around dwarf planet Ceres instead of crashing it onto the surface?',
      options: [
        'Ceres has no gravity so Dawn bounced off',
        'Planetary protection rules required keeping Dawn from contaminating Ceres’s water-ice and organic-rich surface',
        'NASA forgot the password to Dawn’s thrusters',
        'Dawn is waiting for astronauts to refuel its steam engine in 2027'
      ],
      correctIndex: 1,
      explanation:
        'Because Dawn discovered water-ice, salts, and organic compounds on Ceres, NASA’s Planetary Protection policy placed Dawn in a stable multi-decade quarantine orbit rather than risking biological contamination via surface impact.'
    }
  }
];

// Complete Catalog of ALL 13 Official Hardware Categories from the 2026 Challenge Resources Tab
export const NSSDCA_ARTIFACTS: ArtifactItem[] = [
  {
    id: 'apollo-lm',
    name: 'Apollo Lunar Module Descent Stages (Apollo 11–17)',
    nssdcaId: '1969-059C',
    celestialBody: 'Moon',
    locationName: 'Sea of Tranquility & 5 Other Lunar Sites',
    coordinates: '0.6741° N, 23.4730° E (Apollo 11 Eagle)',
    launchYear: 1969,
    endYear: '1969–1972',
    status: 'Stationary Surface Artifact',
    massKg: 2132,
    chapterId: 1,
    tagline: 'Octagonal gold-kapton landing stages that served as humanity’s lunar launchpads.',
    firstPersonVoice:
      'I cushioned humanity’s first steps on another world, then held steady as the launchpad that sent the crew home.',
    whyLeftBehind:
      'Two-stage lunar orbit rendezvous design: the heavy landing gear, descent engine, and empty propellant tanks remained on the Moon to minimize mass lifted back into lunar orbit.',
    scienceBreakthroughs: [
      'Enabled collection of 382 kg of lunar rocks and core samples across 6 landings, establishing the giant-impact origin of the Moon',
      'Confirmed lunar regolith bearing strength and calibrated precise solar-system radiometric dating chronologies'
    ],
    engineeringSpecs: {
      powerSource: 'Silver-zinc batteries (depleted after surface stay)',
      primaryInstruments: 'Descent propulsion system, landing radar, commemorative plaque & equipment bays',
      missionDuration: 'Surface operations: 21.6 hours (Apollo 11) to 75 hours (Apollo 17)'
    },
    officialUrl: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-059C',
    accentColor: '#F59E0B'
  },
  {
    id: 'apollo-lrv',
    name: 'Lunar Roving Vehicles — LRV-1, LRV-2 & LRV-3 ("Moon Buggies")',
    nssdcaId: '1971-063C',
    celestialBody: 'Moon',
    locationName: 'Hadley-Apennine, Descartes Highlands & Taurus-Littrow',
    coordinates: '26.1322° N, 3.6339° E (Apollo 15 LRV-1)',
    launchYear: 1971,
    endYear: '1971–1972',
    status: 'Dormant Monument',
    massKg: 210,
    chapterId: 1,
    tagline: 'Foldable 4-wheel electric rovers that expanded astronaut geological range by 10×.',
    firstPersonVoice:
      'Folded like origami on the side of the Lunar Module, I unfolded onto lunar dust and carried astronauts across craters and mountain foothills.',
    whyLeftBehind:
      'Powered by non-rechargeable 36V silver-zinc batteries and left parked at a vantage point so their TV cameras could broadcast the Lunar Module liftoff back to Earth.',
    scienceBreakthroughs: [
      'Allowed Apollo 15, 16, and 17 astronauts to traverse up to 35.9 km (Apollo 17), discovering the 4.1-billion-year-old "Genesis Rock" and volcanic orange glass soil',
      'Pioneered zinc-coated piano-wire mesh wheels engineered for low-gravity abrasive regolith'
    ],
    engineeringSpecs: {
      powerSource: 'Two 36-volt silver-zinc potassium hydroxide non-rechargeable batteries',
      primaryInstruments: 'Four 0.25 hp electric traction motors, gyroscopic directional navigator, RCA color TV camera',
      missionDuration: '3 traverses per mission (27.8 km, 26.6 km, and 35.9 km driven)'
    },
    officialUrl: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1971-063C',
    accentColor: '#F59E0B'
  },
  {
    id: 'apollo-alsep',
    name: 'ALSEP Scientific Packages & Laser Retroreflectors',
    nssdcaId: '1969-099C',
    celestialBody: 'Moon',
    locationName: 'Apollo 11 (EASEP) & Apollo 12, 14, 15, 16, 17 Sites',
    coordinates: '0.6734° N, 23.4729° E (Apollo 11 LRRR)',
    launchYear: 1969,
    endYear: '1977 (Active stations) / 2026+ (Passive Laser Retroreflectors)',
    status: 'Active Reflector / Passive',
    massKg: 150,
    chapterId: 1,
    tagline: 'Autonomous geophysical stations—whose fused-silica corner mirrors STILL bounce Earth lasers today.',
    firstPersonVoice:
      'My radio transmitters went quiet in 1977, but my 100 fused-silica corner prisms need zero electricity—fire a laser from Earth tonight and I will bounce it right back!',
    whyLeftBehind:
      'Designed specifically as long-term autonomous observatories left behind after astronauts departed to monitor the lunar environment for years.',
    scienceBreakthroughs: [
      'Laser Ranging Retroreflectors still operate today, proving the Moon recedes from Earth at 3.8 cm/year and testing Einstein’s General Relativity to extreme precision',
      'Passive & active seismometers recorded over 12,000 moonquakes and meteoroid impacts, revealing the Moon’s crust and partially molten deep interior'
    ],
    engineeringSpecs: {
      powerSource: 'SNAP-27 Radioisotope Thermoelectric Generator (ALSEP 12–17) / Passive Optics (LRRR)',
      primaryInstruments: 'Passive/Active Seismometers, Laser Ranging Retroreflector (LRRR), Solar Wind Spectrometer, Heat Flow Probe',
      missionDuration: '8 years of continuous radio telemetry (1969–1977); 57+ years of active laser ranging'
    },
    officialUrl: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1969-099C',
    accentColor: '#38BDF8'
  },
  {
    id: 'surveyor-landers',
    name: 'Surveyor 1, 3, 5, 6 & 7 Robotic Lunar Landers',
    nssdcaId: '1966-116A',
    celestialBody: 'Moon',
    locationName: 'Oceanus Procellarum (Surveyor 3 visited by Apollo 12!)',
    coordinates: '3.0155° S, 23.4219° W (Surveyor 3)',
    launchYear: 1966,
    endYear: '1968',
    status: 'Dormant Monument',
    massKg: 296,
    chapterId: 1,
    tagline: '1960s robotic trailblazers that proved astronauts wouldn’t sink into lunar dust.',
    firstPersonVoice:
      'Before any human dared land on the Moon, I fired my vernier thrusters and proved the lunar surface was firm enough to hold a spacecraft.',
    whyLeftBehind:
      'One-way soft-landing reconnaissance probes designed to operate until lunar night froze their batteries; Apollo 12 landed 180 meters from Surveyor 3 in 1969 to retrieve its camera for study!',
    scienceBreakthroughs: [
      'Disproved theories that spacecraft would sink into deep electrostatic dust traps',
      'Performed the first in-situ alpha-scattering chemical analysis of basaltic lunar soil and first liftoff/hop on the Moon (Surveyor 6)'
    ],
    engineeringSpecs: {
      powerSource: 'Solar panel array + silver-zinc battery',
      primaryInstruments: ' Vidicon TV camera (transmitted 87,000+ lunar surface photos), Soil Mechanics Surface Sampler scoop, Alpha-Scattering Instrument',
      missionDuration: '1966–1968'
    },
    officialUrl: 'https://science.nasa.gov/mission/surveyor-3/',
    accentColor: '#FBBF24'
  },
  {
    id: 'viking-landers',
    name: 'Viking 1 & Viking 2 Mars Landers',
    nssdcaId: '1975-075C',
    celestialBody: 'Mars',
    locationName: 'Chryse Planitia (Thomas Mutch Memorial Station) & Utopia Planitia',
    coordinates: '22.48° N, 47.97° W (Viking 1)',
    launchYear: 1975,
    endYear: '1982 (Viking 1) / 1980 (Viking 2)',
    status: 'Dormant Monument',
    massKg: 572,
    chapterId: 2,
    tagline: 'The first spacecraft to operate successfully on Mars and transmit panoramic surface views.',
    firstPersonVoice:
      'In July 1976 I opened my camera eyes on Chryse Planitia and showed humanity the rust-red boulders and pink skies of Mars for the very first time.',
    whyLeftBehind:
      'Stationary nuclear-powered surface laboratories that operated until battery failure (Viking 2 in 1980) and an accidental software antenna-pointing command overwrite (Viking 1 in Nov 1982).',
    scienceBreakthroughs: [
      'Conducted the first three biological soil experiments on Mars and discovered highly reactive perchlorate/oxidant chemistry in Martian regolith',
      'Measured Mars’s atmospheric composition (95% CO₂) and recorded over 6 years of continuous Martian weather reports'
    ],
    engineeringSpecs: {
      powerSource: 'Two plutonium-238 RTGs (70 watts total) + nickel-cadmium batteries',
      primaryInstruments: 'GCMS, Biology Instrument Package, X-Ray Fluorescence Spectrometer, Meteorology Boom',
      missionDuration: '6 years, 116 days on surface (Viking 1)'
    },
    officialUrl: 'https://science.nasa.gov/mission/viking-1/',
    accentColor: '#EA580C'
  },
  {
    id: 'sojourner-rover',
    name: 'Sojourner Rover & Mars Pathfinder (Carl Sagan Memorial Station)',
    nssdcaId: '1996-068A',
    celestialBody: 'Mars',
    locationName: 'Ares Vallis, Mars',
    coordinates: '19.13° N, 33.22° W',
    launchYear: 1996,
    endYear: '1997',
    status: 'Dormant Monument',
    massKg: 11.5,
    chapterId: 2,
    tagline: 'The 11.5 kg six-wheeled microwave-sized rover that proved roving on Mars was possible.',
    firstPersonVoice:
      'I rolled down Pathfinder’s airbag petals on six rocker-bogie wheels—every giant Mars rover since is my direct descendant!',
    whyLeftBehind:
      'Pathfinder’s base station battery failed due to cold Martian nights after 83 sols (12× Sojourner’s planned 7-sol design life), leaving Sojourner circling the lander awaiting relay commands.',
    scienceBreakthroughs: [
      'Validated the airbag landing system and 6-wheel Rocker-Bogie suspension later scaled up for Spirit, Opportunity, Curiosity, and Perseverance',
      'Analyzed 16 rocks ("Barnacle Bill", "Yogi") with its APXS spectrometer, finding rounded conglomerate pebbles shaped by ancient catastrophic floods'
    ],
    engineeringSpecs: {
      powerSource: '0.22 m² gallium arsenide solar panel (16W peak) + LiSOCl₂ backup battery',
      primaryInstruments: 'Alpha Proton X-Ray Spectrometer (APXS), stereo hazard cameras',
      missionDuration: '83 sols (planned for 7 sols); drove ~100 meters'
    },
    officialUrl: 'https://science.nasa.gov/mission/mars-pathfinder/',
    accentColor: '#F97316'
  },
  {
    id: 'spirit-opportunity',
    name: 'Spirit (MER-A) & Opportunity (MER-B) Twin Mars Rovers',
    nssdcaId: '2003-032A',
    celestialBody: 'Mars',
    locationName: 'Gusev Crater (Spirit) & Meridiani Planum (Opportunity)',
    coordinates: '2.046° S, 354.63° E (Opportunity at Perseverance Valley)',
    launchYear: 2003,
    endYear: '2010 (Spirit) / 2018 (Opportunity)',
    status: 'Dormant Monument',
    massKg: 185,
    chapterId: 2,
    tagline: 'Twin robotic geologists planned for 90 sols that rewrote Mars’s water history over 14+ years.',
    firstPersonVoice:
      'We were given 90 days to live. Spirit explored Gusev Crater for 6 years, and I drove 45 kilometers across Meridiani Planum for nearly 15 years!',
    whyLeftBehind:
      'Spirit became embedded in soft sulfate sand at "Troy" in 2009 and froze during the 2010 winter; Opportunity lost solar power during the June 2018 global Mars dust storm.',
    scienceBreakthroughs: [
      'Discovered hematite concretions ("blueberries"), jarosite, and clay minerals proving ancient Mars had neutral-to-acidic liquid water capable of supporting microbial life',
      'Spirit discovered 90%-pure opaline silica deposits at "Home Plate," evidence of ancient hydrothermal hot springs or volcanic fumaroles'
    ],
    engineeringSpecs: {
      powerSource: 'Triple-junction GaInP/GaAs/Ge deployable solar arrays (~140W peak)',
      primaryInstruments: 'Pancam, Mini-TES, Mössbauer Spectrometer, APXS, Microscopic Imager, Rock Abrasion Tool (RAT)',
      missionDuration: 'Spirit: 2,208 sols (7.7 km); Opportunity: 5,111 sols (45.16 km)'
    },
    officialUrl: 'https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity/',
    accentColor: '#EA580C'
  },
  {
    id: 'phoenix-insight',
    name: 'Phoenix Polar Lander (2008) & InSight Geophysical Lander (2018)',
    nssdcaId: '2018-042A',
    celestialBody: 'Mars',
    locationName: 'Green Valley (68.2° N) & Elysium Planitia (4.5° N)',
    coordinates: '4.5024° N, 135.6234° E (InSight)',
    launchYear: 2018,
    endYear: '2008 (Phoenix) / Dec 2022 (InSight)',
    status: 'Dormant Monument',
    massKg: 358,
    chapterId: 3,
    tagline: 'Stationary digger and seismologist that tasted Martian water-ice and mapped Mars’s liquid core.',
    firstPersonVoice:
      'Phoenix scooped subsurface polar ice into its ovens, and I listened to 1,319 marsquakes to map the Red Planet from crust to core.',
    whyLeftBehind:
      'Phoenix’s solar arrays succumbed to darkness and CO₂ dry-ice accumulation in polar winter; InSight’s circular UltraFlex solar arrays gradually lost output under thick equatorial dust in December 2022.',
    scienceBreakthroughs: [
      'Phoenix directly excavated and vaporized shallow subsurface water-ice, confirming habitable-zone soil pH (7.7) and snow falling from Martian clouds',
      'InSight measured Mars’s crustal thickness (24–72 km) and liquid iron-sulfur core (~1,830 km radius) using over 1,300 detected marsquakes'
    ],
    engineeringSpecs: {
      powerSource: 'Dual circular decagonal UltraFlex solar panels (InSight) / GaAs solar wings (Phoenix)',
      primaryInstruments: 'SEIS Seismometer, HP³ Heat Flow Probe, RISE Radio Science (InSight); TEGA Ovens & Robotic Arm Scoop (Phoenix)',
      missionDuration: 'Phoenix: 157 sols; InSight: 1,440 sols (4+ Earth years)'
    },
    officialUrl: 'https://science.nasa.gov/mission/insight/',
    accentColor: '#06B6D4'
  },
  {
    id: 'ingenuity-helicopter',
    name: 'Ingenuity Mars Helicopter ("Ginny")',
    nssdcaId: '2020-052B',
    celestialBody: 'Mars',
    locationName: 'Valinor Hills / Airfield Chi, Jezero Crater',
    coordinates: '18.4988° N, 77.3610° E',
    launchYear: 2020,
    endYear: 'Jan 2024 (Flight 72 — Stationary Telemetry Monument)',
    status: 'Stationary Surface Artifact',
    massKg: 1.8,
    chapterId: 4,
    tagline: 'History’s first aircraft on another planet—built for 5 flights, completed 72 across Jezero Crater.',
    firstPersonVoice:
      'My broken rotor tip keeps me grounded at Valinor Hills now, but for 72 flights I soared through Mars’s thin crimson sky as Perseverance’s airborne scout!',
    whyLeftBehind:
      'During Flight 72 on Jan 18, 2024, featureless sand dunes caused a hard landing that damaged its carbon-fiber rotor blades; programmed to continue waking daily as a stationary environmental logger.',
    scienceBreakthroughs: [
      'Proved aerodynamic flight is possible in Mars’s 1%-density atmosphere, paving the way for next-generation Mars Sample Recovery and Dragonfly Titan rotorcraft',
      'Scouted over 17 km of ancient river delta boulders, sand traps, and geologic contacts ahead of the Perseverance rover'
    ],
    engineeringSpecs: {
      powerSource: 'Top-mounted solar array charging 6 Sony Li-ion cells (35–40 Wh)',
      primaryInstruments: 'Counter-rotating 1.2m carbon-fiber rotors (2,400 RPM), Garmin laser altimeter, 13 MP color horizon camera, navcam',
      missionDuration: '72 flights over nearly 3 Earth years (128.8 flight minutes)'
    },
    officialUrl: 'https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/',
    accentColor: '#10B981'
  },
  {
    id: 'near-shoemaker',
    name: 'NEAR Shoemaker Asteroid Orbiter & Lander',
    nssdcaId: '1996-008A',
    celestialBody: 'Asteroid / Dwarf Planet',
    locationName: 'Saddle Region of Asteroid 433 Eros',
    coordinates: '35° S, 279° W on Asteroid 433 Eros',
    launchYear: 1996,
    endYear: 'Feb 2001',
    status: 'Stationary Surface Artifact',
    massKg: 487,
    chapterId: 5,
    tagline: 'The first spacecraft ever to orbit—and then improvise a soft landing on—an asteroid.',
    firstPersonVoice:
      'I wasn’t even built with landing legs! Yet on Valentine’s Day 2001, I gently touched down on tumbling asteroid 433 Eros at walking speed.',
    whyLeftBehind:
      'At the end of its orbital mapping mission with fuel nearly gone, engineers executed an improvised controlled descent onto Eros’s surface, where it transmitted gamma-ray data for 16 days before freezing.',
    scienceBreakthroughs: [
      'Returned 160,000+ images of near-Earth asteroid 433 Eros, proving it is a consolidated, fractured primordial remnant from the dawn of the Solar System',
      'Captured sub-meter surface gamma-ray spectra directly from the asteroid regolith after touchdown'
    ],
    engineeringSpecs: {
      powerSource: 'Four gallium arsenide solar panels (1,800W at 1 AU)',
      primaryInstruments: 'Multi-Spectral Imager, NEAR Laser Rangefinder, X-Ray/Gamma-Ray Spectrometer, Magnetometer',
      missionDuration: '5 years (1 year orbiting Eros + 16 days operating on asteroid surface)'
    },
    officialUrl: 'https://science.nasa.gov/mission/near-shoemaker/',
    accentColor: '#A855F7'
  },
  {
    id: 'dawn-spacecraft',
    name: 'Dawn Ion-Propulsion Spacecraft',
    nssdcaId: '2007-043A',
    celestialBody: 'Asteroid / Dwarf Planet',
    locationName: 'Perpetual Quarantine Orbit Around Dwarf Planet Ceres',
    coordinates: 'Heliocentric Main Asteroid Belt (~2.77 AU)',
    launchYear: 2007,
    endYear: 'Nov 2018',
    status: 'Drifting Silently',
    massKg: 747,
    chapterId: 5,
    tagline: 'The only spacecraft ever to orbit two extraterrestrial destinations—protoplanet Vesta and dwarf planet Ceres.',
    firstPersonVoice:
      'Powered by blue xenon ion beams, I orbited both rocky Vesta and icy Ceres—where I now circle silently forever to keep Ceres’s ancient brines pure.',
    whyLeftBehind:
      'Depleted its hydrazine attitude-control propellant in Oct 2018; intentionally placed in a stable multi-decade quarantine orbit so it cannot crash into Ceres’s organic- and water-rich surface.',
    scienceBreakthroughs: [
      'Revealed bright sodium carbonate salt domes (Occator Crater) fed by a deep subsurface brine reservoir on dwarf planet Ceres',
      'Mapped Vesta’s giant Rheasilvia impact basin, confirming Vesta is the parent body of HED meteorites found on Earth'
    ],
    engineeringSpecs: {
      powerSource: '19.7-meter span solar array (10.3 kW at 1 AU) + 3 NSTAR Xenon Ion Thrusters',
      primaryInstruments: 'Framing Cameras, VIR Visible & Infrared Mapping Spectrometer, GRaND Gamma Ray and Neutron Detector',
      missionDuration: '11 years (orbited Vesta 2011–2012, orbited Ceres 2015–2018)'
    },
    officialUrl: 'https://science.nasa.gov/mission/dawn/',
    accentColor: '#8B5CF6'
  },
  {
    id: 'kepler-telescope',
    name: 'Kepler Space Telescope',
    nssdcaId: '2009-011A',
    celestialBody: 'Deep Space / Heliocentric',
    locationName: 'Earth-Trailing Heliocentric Orbit (~1 AU)',
    coordinates: '372.5-Day Earth-Trailing Solar Orbit (>150 Million km from Earth)',
    launchYear: 2009,
    endYear: 'Oct 2018',
    status: 'Drifting Silently',
    massKg: 1052,
    chapterId: 5,
    tagline: 'The planet-hunting sentinel that proved our Milky Way galaxy is teeming with worlds.',
    firstPersonVoice:
      'When two of my reaction wheels failed, engineers balanced me against the gentle pressure of sunlight itself! Look up at the night sky—because of me, you know there are more planets than stars.',
    whyLeftBehind:
      'Ran out of hydrazine fuel in October 2018 in its safe Earth-trailing solar orbit; NASA sent "goodnight" commands to disable its transmitters and leave it drifting peacefully around the Sun.',
    scienceBreakthroughs: [
      'Discovered over 2,600 confirmed exoplanets (and thousands more candidates) by measuring tiny starlight dips during planetary transits',
      'Proved statistically that 20–50% of stars visible in the night sky likely host rocky, Earth-sized worlds in their habitable zones'
    ],
    engineeringSpecs: {
      powerSource: '2.86 m² non-articulated solar array (1.1 kW)',
      primaryInstruments: '0.95-meter Schmidt Photometer with 95-megapixel array of 42 CCDs',
      missionDuration: '9.6 years (Primary + K2 Extended Mission)'
    },
    officialUrl: 'https://science.nasa.gov/mission/kepler/',
    accentColor: '#3B82F6'
  },
  {
    id: 'pioneer-10-11',
    name: 'Pioneer 10 & Pioneer 11 Interstellar Probes',
    nssdcaId: '1972-012A',
    celestialBody: 'Deep Space / Heliocentric',
    locationName: 'Outer Solar System / Interstellar Escape Trajectory',
    coordinates: '~137 AU toward Aldebaran (Pioneer 10) / ~115 AU toward Scutum (Pioneer 11)',
    launchYear: 1972,
    endYear: '2003 (Pioneer 10 last signal) / 1995 (Pioneer 11)',
    status: 'Drifting Silently',
    massKg: 258,
    chapterId: 5,
    tagline: 'Humanity’s first emissaries across the Asteroid Belt, Jupiter, and Saturn—carrying the Golden Plaque to the stars.',
    firstPersonVoice:
      'My plutonium power faded in 2003 at 12.2 billion kilometers from home, yet I coast silently toward the red star Aldebaran carrying a gold-anodized greeting from Earth.',
    whyLeftBehind:
      'Gravity-assist trajectories past Jupiter (Pioneer 10) and Saturn (Pioneer 11) accelerated both probes above solar escape velocity; RTG thermocouple decay eventually dropped transmitter power below DSN detection threshold.',
    scienceBreakthroughs: [
      'First spacecraft to traverse the Asteroid Belt, make direct observations of Jupiter (1973) and Saturn’s F-ring (1979), and chart Jupiter’s intense radiation belts',
      'Carry the iconic gold-anodized aluminum Pioneer Plaques designed by Carl Sagan, Frank Drake, and Linda Salzman Sagan'
    ],
    engineeringSpecs: {
      powerSource: 'Four SNAP-19 plutonium-238 Radioisotope Thermoelectric Generators (155W at launch)',
      primaryInstruments: '2.74m High-Gain Dish Antenna, Helium Vector Magnetometer, Imaging Photopolarimeter, Cosmic Ray Telescope',
      missionDuration: '30+ years of active tracking (1972–2003); eternal interstellar drift'
    },
    officialUrl: 'https://science.nasa.gov/mission/pioneer-10/',
    accentColor: '#EC4899'
  }
];
