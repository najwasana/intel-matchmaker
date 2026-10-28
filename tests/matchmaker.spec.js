const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:8085';

test.describe('Intel Matchmaker Comprehensive Browser Tests', () => {

  test('Test A: Page Loads and Core Sections are Rendered', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Intel Matchmaker/);

    // Verify Hero elements
    await expect(page.locator('h1.hero-title')).toContainText('Swipe Less');
    await expect(page.locator('.hero-headline')).toContainText('It\'s Not About the Best. It\'s About Your Best Match.');

    // Verify Both Profiles
    await expect(page.locator('#card-profile-ultra .profile-name')).toContainText('Intel® Core™ Ultra Series 3');
    await expect(page.locator('#card-profile-ultra .codename-badge')).toContainText('Panther Lake');
    await expect(page.locator('#card-profile-core .profile-name')).toContainText('Intel® Core™ Series 3');
    await expect(page.locator('#card-profile-core .codename-badge')).toContainText('Wildcat Lake');

    // Verify no console errors on load
    expect(consoleErrors).toHaveLength(0);
  });

  test('Test B: Navigation Links & CTAs', async ({ page }) => {
    await page.goto(BASE_URL);

    // Hero CTA button triggers quiz scroll
    const heroBtn = page.locator('#hero-find-match-btn');
    await heroBtn.click();
    await expect(page.locator('#quiz-card')).toBeVisible();

    // Nav Links
    await page.locator('nav a[href="#comparison"]').click();
    await expect(page.locator('#comparison')).toBeVisible();

    await page.locator('nav a[href="#how-it-works"]').click();
    await expect(page.locator('#how-it-works')).toBeVisible();
  });

  test('Test C: Quiz Validation and Interactive State (Back & Forward retention)', async ({ page }) => {
    await page.goto(BASE_URL);

    // Start Quiz
    const continueBtn = page.locator('#quiz-next-btn');
    const backBtn = page.locator('#quiz-prev-btn');

    // Initially back is disabled, continue is disabled
    await expect(backBtn).toBeDisabled();
    await expect(continueBtn).toBeDisabled();

    // Click on option "Creator"
    const creatorOpt = page.locator('.option-card[data-option-id="creator"]');
    await creatorOpt.click();
    await expect(creatorOpt).toHaveClass(/selected/);
    await expect(continueBtn).toBeEnabled();

    // Change answer to Gamer
    const gamerOpt = page.locator('.option-card[data-option-id="gamer"]');
    await gamerOpt.click();
    await expect(gamerOpt).toHaveClass(/selected/);
    await expect(creatorOpt).not.toHaveClass(/selected/);

    // Move forward to Q2
    await continueBtn.click();
    await expect(page.locator('#quiz-progress-text')).toContainText('Question 2 of 5');
    await expect(page.locator('#quiz-percentage-text')).toContainText('40%');
    await expect(backBtn).toBeEnabled();
    await expect(continueBtn).toBeDisabled(); // Q2 unanswered

    // Navigate back to Q1
    await backBtn.click();
    await expect(page.locator('#quiz-progress-text')).toContainText('Question 1 of 5');
    // Confirm Gamer remains selected
    await expect(page.locator('.option-card[data-option-id="gamer"]')).toHaveClass(/selected/);
    await expect(continueBtn).toBeEnabled();
  });

  test('Test D: Test 1 - Core Ultra Recommendation (10 Ultra, 0 Core)', async ({ page }) => {
    await page.goto(BASE_URL);

    // Q1: Creator (+2 Ultra, 0 Core)
    await page.locator('.option-card[data-option-id="creator"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q2: Intensive (+2 Ultra, 0 Core)
    await page.locator('.option-card[data-option-id="intensive"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q3: Very important (+2 Ultra, 0 Core)
    await page.locator('.option-card[data-option-id="very_important"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q4: Demanding-workload performance (+2 Ultra, 0 Core)
    await page.locator('.option-card[data-option-id="demanding_perf"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q5: Intensive work (+2 Ultra, 0 Core)
    await page.locator('.option-card[data-option-id="intensive_day"]').click();
    await page.locator('#quiz-next-btn').click();

    // Verify Result Card is revealed and Quiz Card hidden
    await expect(page.locator('#quiz-card')).toBeHidden();
    await expect(page.locator('#result-card')).toBeVisible();

    // Verify recommendation details
    await expect(page.locator('#result-chip-name')).toContainText('Intel® Core™ Ultra Series 3');
    await expect(page.locator('#result-codename')).toContainText('Panther Lake');
    await expect(page.locator('#result-personality')).toContainText('The Power Creator');

    // Verify score breakdown: 10 to 0
    await expect(page.locator('#score-ultra-val')).toHaveText('10');
    await expect(page.locator('#score-core-val')).toHaveText('0');
    await expect(page.locator('#score-card-ultra')).toHaveClass(/winner/);
    await expect(page.locator('#score-card-core')).not.toHaveClass(/winner/);

    // Verify reasons
    const reasons = await page.locator('#reasons-list li').allTextContents();
    expect(reasons.length).toBe(3);
    expect(reasons.some(r => r.includes('Creator'))).toBeTruthy();
  });

  test('Test E: Test 2 - Core Recommendation (0 Ultra, 9 Core)', async ({ page }) => {
    await page.goto(BASE_URL);

    // Q1: Everyday Achiever (+0 Ultra, +2 Core)
    await page.locator('.option-card[data-option-id="everyday_achiever"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q2: Everyday (+0 Ultra, +2 Core)
    await page.locator('.option-card[data-option-id="everyday"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q3: Not a priority (+0 Ultra, +1 Core)
    await page.locator('.option-card[data-option-id="not_priority"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q4: Accessible price (+0 Ultra, +2 Core)
    await page.locator('.option-card[data-option-id="accessible_price"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q5: Everyday day (+0 Ultra, +2 Core)
    await page.locator('.option-card[data-option-id="everyday_day"]').click();
    await page.locator('#quiz-next-btn').click();

    // Verify Result Card
    await expect(page.locator('#result-card')).toBeVisible();
    await expect(page.locator('#result-chip-name')).toContainText('Intel® Core™ Series 3');
    await expect(page.locator('#result-codename')).toContainText('Wildcat Lake');
    await expect(page.locator('#result-personality')).toContainText('The Everyday Achiever');

    // Verify scores: 0 to 9
    await expect(page.locator('#score-ultra-val')).toHaveText('0');
    await expect(page.locator('#score-core-val')).toHaveText('9');
    await expect(page.locator('#score-card-core')).toHaveClass(/winner/);
    await expect(page.locator('#score-card-ultra')).not.toHaveClass(/winner/);
  });

  test('Test F: Test 3 - Exact True Tie (5 Ultra, 5 Core)', async ({ page }) => {
    await page.goto(BASE_URL);

    // Q1: Everyday Achiever (+0 Ultra, +2 Core)
    await page.locator('.option-card[data-option-id="everyday_achiever"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q2: Intensive (+2 Ultra, +0 Core)
    await page.locator('.option-card[data-option-id="intensive"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q3: Somewhat important (+1 Ultra, +1 Core)
    await page.locator('.option-card[data-option-id="somewhat_important"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q4: Balance (+1 Ultra, +1 Core)
    await page.locator('.option-card[data-option-id="balance"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q5: Mixed day (+1 Ultra, +1 Core)
    await page.locator('.option-card[data-option-id="mixed_day"]').click();
    await page.locator('#quiz-next-btn').click();

    // Verify Result
    await expect(page.locator('#result-card')).toBeVisible();
    await expect(page.locator('#result-badge')).toHaveText('Balanced Dual Match');
    await expect(page.locator('#score-ultra-val')).toHaveText('5');
    await expect(page.locator('#score-core-val')).toHaveText('5');
    await expect(page.locator('#result-box')).toHaveClass(/tie-highlight/);
  });

  test('Test G: Reset Functionality Clears Quiz State', async ({ page }) => {
    await page.goto(BASE_URL);

    // Answer Q1 and Q2
    await page.locator('.option-card[data-option-id="creator"]').click();
    await page.locator('#quiz-next-btn').click();
    await page.locator('.option-card[data-option-id="intensive"]').click();

    // Click Reset
    await page.locator('#quiz-reset-btn').click();

    // Verify Quiz is reset to Q1 with no selection
    await expect(page.locator('#quiz-progress-text')).toHaveText('Question 1 of 5');
    await expect(page.locator('#quiz-prev-btn')).toBeDisabled();
    await expect(page.locator('#quiz-next-btn')).toBeDisabled();
    await expect(page.locator('.option-card.selected')).toHaveCount(0);
  });

  test('Test H: Retake Quiz from Result Screen', async ({ page }) => {
    await page.goto(BASE_URL);

    // Quick completion
    await page.locator('.option-card[data-option-id="creator"]').click();
    await page.locator('#quiz-next-btn').click();
    await page.locator('.option-card[data-option-id="intensive"]').click();
    await page.locator('#quiz-next-btn').click();
    await page.locator('.option-card[data-option-id="very_important"]').click();
    await page.locator('#quiz-next-btn').click();
    await page.locator('.option-card[data-option-id="demanding_perf"]').click();
    await page.locator('#quiz-next-btn').click();
    await page.locator('.option-card[data-option-id="intensive_day"]').click();
    await page.locator('#quiz-next-btn').click();

    // Result visible
    await expect(page.locator('#result-card')).toBeVisible();

    // Click Retake Quiz
    await page.locator('#result-retake-btn').click();

    // Result card hidden, quiz card shown and reset to Q1
    await expect(page.locator('#result-card')).toBeHidden();
    await expect(page.locator('#quiz-card')).toBeVisible();
    await expect(page.locator('#quiz-progress-text')).toHaveText('Question 1 of 5');
    await expect(page.locator('.option-card.selected')).toHaveCount(0);
  });

  test('Test I: Comparison Dashboard & Educational Disclaimer Content', async ({ page }) => {
    await page.goto(BASE_URL);

    // Check Intel 18A process node shared foundation
    await expect(page.locator('.shared-foundation-card')).toContainText('Intel 18A');
    await expect(page.locator('.shared-desc')).toContainText('RibbonFET');
    await expect(page.locator('.shared-desc')).toContainText('PowerVia');

    // Check 3 Questions answered
    await expect(page.locator('.faq-answers-block')).toBeVisible();
    await expect(page.locator('.faq-answers-block')).toContainText('What do the two processor families have in common?');
    await expect(page.locator('.faq-answers-block')).toContainText('What are their main differences?');
    await expect(page.locator('.faq-answers-block')).toContainText('Which processor family suits your needs and why?');

    // Check verbatim educational disclaimer
    const disclaimerQuote = page.locator('.disclaimer-quote');
    await expect(disclaimerQuote).toContainText('Intel Matchmaker is an independent educational concept. Recommendations are based on stated preferences, not official Intel benchmarks or personalised technical testing. Actual laptop performance depends on the device configuration and workload.');
  });
});
