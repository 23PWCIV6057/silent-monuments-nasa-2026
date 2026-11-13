import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const dataFile = fs.readFileSync(
  path.resolve('src/data/nasaEquipmentData.ts'),
  'utf8'
);

// 1. Verify all 5 playable chapters exist
for (let i = 1; i <= 5; i++) {
  assert.ok(
    dataFile.includes(`id: ${i},`),
    `Missing Chapter ${i} in nasaEquipmentData.ts`
  );
}

// 2. Verify all 13 official NASA Challenge Resource suites are present
const requiredArtifactIds = [
  'apollo-lm',
  'apollo-lrv',
  'apollo-alsep',
  'surveyor-landers',
  'viking-landers',
  'sojourner-rover',
  'spirit-opportunity',
  'phoenix-insight',
  'ingenuity-helicopter',
  'near-shoemaker',
  'dawn-spacecraft',
  'kepler-telescope',
  'pioneer-10-11'
];

for (const id of requiredArtifactIds) {
  assert.ok(
    dataFile.includes(`id: '${id}'`),
    `Missing required NSSDCA artifact suite: ${id}`
  );
}

// 3. Verify 7-slide presentation deck and SUBMISSION_KIT.md exist
const slidesHtml = fs.readFileSync(path.resolve('public/slides.html'), 'utf8');
const slideMatches = slidesHtml.match(/<section class="slide/g) || [];
assert.equal(
  slideMatches.length,
  7,
  `Expected exactly 7 slides in public/slides.html (strict NASA limit), found ${slideMatches.length}`
);

assert.ok(
  fs.existsSync(path.resolve('SUBMISSION_KIT.md')),
  'Missing SUBMISSION_KIT.md'
);

console.log('✅ All 5 chapters, 13 NSSDCA hardware suites, and 7-slide deck verified!');
