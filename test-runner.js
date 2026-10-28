/**
 * AUTOMATED TEST SUITE: Intel Matchmaker
 * Tests:
 * 1. Test 1: Core Ultra recommendation (Creator, Intensive, Very important, Demanding perf, Intensive day) -> Ultra 10, Core 0
 * 2. Test 2: Core recommendation (Everyday Achiever, Everyday, Not priority, Accessible price, Everyday day) -> Ultra 0, Core 9
 * 3. Test 3: True tie (Balanced scenario) -> equal points & neutral recommendation
 * 4. Test 4: Mixed preferences -> points correctly mapped from all 5 questions
 * 5. Test 5: Dynamic reasons generation verification
 * 6. Question options point mapping integrity verification
 */

const { QUIZ_QUESTIONS, calculateMatchmakingScores, generateReasons } = require('./script.js');

const results = [];

function assert(condition, testName, details) {
  if (condition) {
    results.push({ name: testName, status: 'PASS', details });
    console.log(`[PASS] ${testName}`);
  } else {
    results.push({ name: testName, status: 'FAIL', details });
    console.error(`[FAIL] ${testName} - ${details}`);
  }
}

console.log("=== STARTING INTEL MATCHMAKER ALGORITHM & STATE TESTS ===\n");

// TEST 1: Core Ultra Recommendation
const test1Input = {
  1: 'creator',
  2: 'intensive',
  3: 'very_important',
  4: 'demanding_perf',
  5: 'intensive_day'
};
const res1 = calculateMatchmakingScores(test1Input);
assert(
  res1.ultraPoints === 10 && res1.corePoints === 0 && res1.recommendation === 'ultra' && res1.isComplete === true,
  "Test 1: Mandatory Core Ultra recommendation",
  `Expected Ultra:10, Core:0, Rec:ultra. Got Ultra:${res1.ultraPoints}, Core:${res1.corePoints}, Rec:${res1.recommendation}`
);

// TEST 2: Core Recommendation
const test2Input = {
  1: 'everyday_achiever',
  2: 'everyday',
  3: 'not_priority',
  4: 'accessible_price',
  5: 'everyday_day'
};
const res2 = calculateMatchmakingScores(test2Input);
assert(
  res2.ultraPoints === 0 && res2.corePoints === 9 && res2.recommendation === 'core' && res2.isComplete === true,
  "Test 2: Mandatory Core recommendation",
  `Expected Ultra:0, Core:9, Rec:core. Got Ultra:${res2.ultraPoints}, Core:${res2.corePoints}, Rec:${res2.recommendation}`
);

// FIND A TRUE TIE COMBINATION
// We need Ultra points === Core points
// For instance:
// Q1: multitasker (+1 ultra, 0 core)
// Q2: mixed (+1 ultra, +1 core) -> Subtotal: Ultra 2, Core 1
// Q3: somewhat_important (+1 ultra, +1 core) -> Subtotal: Ultra 3, Core 2
// Q4: balance (+1 ultra, +1 core) -> Subtotal: Ultra 4, Core 3
// Q5: mixed_day (+1 ultra, +1 core) -> Subtotal: Ultra 5, Core 4 (Difference is 1)
// Let's adjust:
// Q1: everyday_achiever (+0 ultra, +2 core) -> Subtotal: Ultra 0, Core 2
// Q2: intensive (+2 ultra, +0 core) -> Subtotal: Ultra 2, Core 2
// Q3: somewhat_important (+1 ultra, +1 core) -> Subtotal: Ultra 3, Core 3
// Q4: balance (+1 ultra, +1 core) -> Subtotal: Ultra 4, Core 4
// Q5: mixed_day (+1 ultra, +1 core) -> Subtotal: Ultra 5, Core 5. EXACT MATCH!

const test3TieInput = {
  1: 'everyday_achiever', // 0 ultra, 2 core
  2: 'intensive',         // 2 ultra, 0 core
  3: 'somewhat_important',// 1 ultra, 1 core
  4: 'balance',           // 1 ultra, 1 core
  5: 'mixed_day'          // 1 ultra, 1 core
};
const res3 = calculateMatchmakingScores(test3TieInput);
assert(
  res3.ultraPoints === 5 && res3.corePoints === 5 && res3.recommendation === 'tie' && res3.isComplete === true,
  "Test 3: Exact True Tie balanced recommendation",
  `Expected Ultra:5, Core:5, Rec:tie. Got Ultra:${res3.ultraPoints}, Core:${res3.corePoints}, Rec:${res3.recommendation}`
);

// TEST 4: Mixed Preferences
const test4Input = {
  1: 'gamer',             // 2 ultra, 0 core
  2: 'everyday',          // 0 ultra, 2 core
  3: 'very_important',    // 2 ultra, 0 core
  4: 'accessible_price',  // 0 ultra, 2 core
  5: 'mixed_day'          // 1 ultra, 1 core
};
// Ultra: 2 + 0 + 2 + 0 + 1 = 5
// Core:  0 + 2 + 0 + 2 + 1 = 5 (another tie)
// Let's test non-tie mixed:
const test4NonTie = {
  1: 'gamer',             // 2 ultra, 0 core
  2: 'mixed',             // 1 ultra, 1 core
  3: 'somewhat_important',// 1 ultra, 1 core
  4: 'accessible_price',  // 0 ultra, 2 core
  5: 'everyday_day'       // 0 ultra, 2 core
};
// Ultra: 2 + 1 + 1 + 0 + 0 = 4
// Core:  0 + 1 + 1 + 2 + 2 = 6
const res4 = calculateMatchmakingScores(test4NonTie);
assert(
  res4.ultraPoints === 4 && res4.corePoints === 6 && res4.recommendation === 'core',
  "Test 4: Mixed preferences calculated accurately across all 5 answers",
  `Expected Ultra:4, Core:6, Rec:core. Got Ultra:${res4.ultraPoints}, Core:${res4.corePoints}, Rec:${res4.recommendation}`
);

// TEST 5: Reason Generation
const reasonsUltra = generateReasons(test1Input, 'ultra');
const reasonsCore = generateReasons(test2Input, 'core');
const reasonsTie = generateReasons(test3TieInput, 'tie');

assert(
  reasonsUltra.length === 3 && reasonsUltra.some(r => r.includes('Creator')),
  "Test 5A: Ultra reasons generated and reflect Creator answer",
  `Reasons count: ${reasonsUltra.length}`
);
assert(
  reasonsCore.length === 3 && reasonsCore.some(r => r.includes('Everyday Achiever')),
  "Test 5B: Core reasons generated and reflect Everyday Achiever answer",
  `Reasons count: ${reasonsCore.length}`
);
assert(
  reasonsTie.length === 3 && reasonsTie.some(r => r.includes('balanced')),
  "Test 5C: Tie reasons properly present balanced guidance",
  `Reasons count: ${reasonsTie.length}`
);

// TEST 6: All Questions and Options points validation
let totalOptionsTested = 0;
QUIZ_QUESTIONS.forEach(q => {
  q.options.forEach(opt => {
    totalOptionsTested++;
    assert(
      typeof opt.points.ultra === 'number' && typeof opt.points.core === 'number',
      `Test 6 (Q${q.id} - ${opt.id}): Valid point structure`,
      `Points: ultra=${opt.points.ultra}, core=${opt.points.core}`
    );
  });
});

console.log(`\n=== TEST SUITE COMPLETED: Total ${results.length} assertions passed: ${results.filter(r => r.status === 'PASS').length}, failed: ${results.filter(r => r.status === 'FAIL').length} ===`);
