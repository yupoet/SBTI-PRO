// games/SBTI-PRO/validate.mjs
import fs from 'fs';

const html = fs.readFileSync('./index.html', 'utf-8');
let errors = 0;
let warnings = 0;

function fail(msg) { console.error('❌', msg); errors++; }
function warn(msg) { console.warn('⚠️ ', msg); warnings++; }
function ok(msg)   { console.log('✅', msg); }

// ── Extract NORMAL_TYPES ──────────────────────────────────────────────
const ntMatch = html.match(/const NORMAL_TYPES = (\[[\s\S]*?\n\s*\]);/);
if (!ntMatch) { fail('Cannot find NORMAL_TYPES'); process.exit(1); }
const NORMAL_TYPES = new Function('return ' + ntMatch[1])();

// ── Extract TYPE_LIBRARY ──────────────────────────────────────────────
const tlMatch = html.match(/const TYPE_LIBRARY = (\{[\s\S]*?\n\s*\});/);
if (!tlMatch) { fail('Cannot find TYPE_LIBRARY'); process.exit(1); }
const TYPE_LIBRARY = new Function('return ' + tlMatch[1])();

// ── Extract questions ─────────────────────────────────────────────────
const qMatch = html.match(/const questions = (\[[\s\S]*?\n\s*\]);/);
if (!qMatch) { fail('Cannot find questions'); process.exit(1); }
const questions = new Function('return ' + qMatch[1])();

// ── Extract dimensionOrder ────────────────────────────────────────────
const doMatch = html.match(/const dimensionOrder = (\[[^\]]+\]);/);
if (!doMatch) { fail('Cannot find dimensionOrder'); process.exit(1); }
const dimensionOrder = new Function('return ' + doMatch[1])();

// ── Extract dimQuestionCount (may not exist yet) ──────────────────────
const dqcMatch = html.match(/const dimQuestionCount = (\{[^}]+\});/);
const dimQuestionCount = dqcMatch ? new Function('return ' + dqcMatch[1])() : null;

// ── Checks ────────────────────────────────────────────────────────────
const DIM_COUNT = dimensionOrder.length;
console.log(`\nDimension count: ${DIM_COUNT}`);

// Pattern length
const expectedPatternLen = DIM_COUNT;
let patternErrors = 0;
NORMAL_TYPES.forEach(t => {
  const clean = t.pattern.replace(/-/g, '');
  if (clean.length !== expectedPatternLen) {
    fail(`${t.code}: pattern length ${clean.length} (expected ${expectedPatternLen})`);
    patternErrors++;
  }
  if (!/^[HML-]+$/.test(t.pattern)) {
    fail(`${t.code}: pattern contains invalid chars: ${t.pattern}`);
    patternErrors++;
  }
});
if (patternErrors === 0) ok(`All ${NORMAL_TYPES.length} patterns are ${expectedPatternLen} chars`);

// TYPE_LIBRARY coverage
NORMAL_TYPES.forEach(t => {
  if (!TYPE_LIBRARY[t.code]) fail(`${t.code} in NORMAL_TYPES but missing from TYPE_LIBRARY`);
});
ok(`NORMAL_TYPES: ${NORMAL_TYPES.length} types`);
ok(`TYPE_LIBRARY: ${Object.keys(TYPE_LIBRARY).length} entries`);

// No duplicate codes
const codes = NORMAL_TYPES.map(t => t.code);
const dupes = codes.filter((c, i) => codes.indexOf(c) !== i);
if (dupes.length) fail(`Duplicate codes: ${dupes.join(', ')}`);
else ok('No duplicate type codes');

// Questions per dim
const qPerDim = {};
questions.forEach(q => {
  qPerDim[q.dim] = (qPerDim[q.dim] || 0) + 1;
});
dimensionOrder.forEach(dim => {
  const count = qPerDim[dim] || 0;
  if (count < 2) fail(`${dim}: only ${count} questions (need ≥2)`);
});
const totalQ = questions.length;
console.log(`\nQuestions: ${totalQ} regular`);
ok(`All dims have ≥2 questions`);

// dimQuestionCount consistency (if present)
if (dimQuestionCount) {
  dimensionOrder.forEach(dim => {
    const declared = dimQuestionCount[dim];
    const actual = qPerDim[dim] || 0;
    if (declared !== actual) {
      fail(`dimQuestionCount[${dim}]=${declared} but actual questions=${actual}`);
    }
  });
  ok('dimQuestionCount matches actual question counts');
}

// TYPE_LIBRARY fields
const requiredFields = ['code', 'cn', 'intro', 'desc'];
Object.values(TYPE_LIBRARY).forEach(t => {
  requiredFields.forEach(f => {
    if (!t[f]) fail(`TYPE_LIBRARY.${t.code} missing field: ${f}`);
  });
  if (t.rarity !== undefined && t.rarity !== null && typeof t.rarity !== 'number') {
    warn(`TYPE_LIBRARY.${t.code}.rarity should be number or null`);
  }
});
ok('TYPE_LIBRARY field check done');

// distance divisor check
const distMatch = html.match(/distance\s*\/\s*(\d+)/);
if (distMatch) {
  const divisor = parseInt(distMatch[1]);
  const expected = DIM_COUNT * 2;
  if (divisor !== expected) warn(`distance divisor is ${divisor}, expected ${expected} for ${DIM_COUNT} dims`);
  else ok(`distance divisor = ${divisor} ✓`);
}

// Summary
console.log(`\n${'─'.repeat(40)}`);
if (errors > 0) {
  console.error(`\nFAILED: ${errors} error(s), ${warnings} warning(s)`);
  process.exit(1);
} else {
  console.log(`PASSED: 0 errors, ${warnings} warning(s)`);
}
