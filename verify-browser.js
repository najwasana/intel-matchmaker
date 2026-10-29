const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'file:///' + path.resolve(__dirname, 'index.html').replace(/\\/g, '/');

async function runBrowserVerification() {
  console.log('=== STARTING PLAYWRIGHT BROWSER VERIFICATION & VIEWPORT INSPECTION ===\n');
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
  });

  const testReport = [];
  function logResult(name, pass, details = '') {
    testReport.push({ name, pass, details });
    const mark = pass ? '[PASS]' : '[FAIL]';
    console.log(`${mark} ${name} ${details ? '— ' + details : ''}`);
  }

  try {
    const page = await browser.newPage();

    // Catch any console errors (filtering offline font warnings in test sandbox)
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('ERR_NAME_NOT_RESOLVED') && !text.includes('fonts.googleapis.com')) {
          consoleErrors.push(text);
          console.error('Browser console error:', text);
        }
      }
    });

    // 1. Home page loads correctly
    await page.goto(BASE_URL);
    const title = await page.title();
    logResult('Functional 1: Page Loads with Correct Title', title.includes('Intel Matchmaker'), `Title: ${title}`);
    logResult('Functional 2: Browser Console Zero Errors on Load', consoleErrors.length === 0, `Errors: ${consoleErrors.length}`);

    // Verify Hero content
    const heroTitle = await page.locator('.hero-title').textContent();
    const heroHeadline = await page.locator('.hero-headline').textContent();
    logResult('Functional 3: Hero Headline & Title Present', heroTitle.includes('Swipe Less') && heroHeadline.includes('About Your Best Match'));

    // Verify Profiles
    const ultraTitle = await page.locator('#card-profile-ultra .profile-name').textContent();
    const ultraCodename = await page.locator('#card-profile-ultra .codename-badge').textContent();
    const coreTitle = await page.locator('#card-profile-core .profile-name').textContent();
    const coreCodename = await page.locator('#card-profile-core .codename-badge').textContent();
    logResult('Functional 4: Profile A Display (Panther Lake / The Power Creator)', ultraTitle.includes('Ultra') && ultraCodename.includes('Panther Lake'));
    logResult('Functional 5: Profile B Display (Wildcat Lake / The Everyday Achiever)', coreTitle.includes('Core') && coreCodename.includes('Wildcat Lake'));

    // 2. Navigation
    await page.locator('#hero-find-match-btn').click();
    await page.waitForTimeout(300);
    const quizVisible = await page.locator('#quiz-card').isVisible();
    logResult('Functional 6: Find My Match navigates to Quiz', quizVisible);

    // 3. Quiz initial state
    const isPrevDisabled = await page.locator('#quiz-prev-btn').isDisabled();
    const isNextDisabled = await page.locator('#quiz-next-btn').isDisabled();
    logResult('Functional 7: Back and Continue disabled on initial empty question', isPrevDisabled && isNextDisabled);

    // 4. Test 1: Mandatory Core Ultra recommendation
    // Q1: Creator
    await page.locator('.option-card[data-option-id="creator"]').click();
    logResult('Functional 8: Answer selection updates visually', await page.locator('.option-card[data-option-id="creator"]').evaluate(el => el.classList.contains('selected')));
    await page.locator('#quiz-next-btn').click();

    // Q2: Intensive
    await page.locator('.option-card[data-option-id="intensive"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q3: Very important
    await page.locator('.option-card[data-option-id="very_important"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q4: Demanding-workload performance
    await page.locator('.option-card[data-option-id="demanding_perf"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q5: Intensive work
    await page.locator('.option-card[data-option-id="intensive_day"]').click();
    await page.locator('#quiz-next-btn').click();

    // Check Result Screen
    await page.waitForTimeout(400);
    const resultCardVisible = await page.locator('#result-card').isVisible();
    const recUltra = await page.locator('#result-chip-name').textContent();
    const ultraScoreVal = await page.locator('#score-ultra-val').textContent();
    const coreScoreVal = await page.locator('#score-core-val').textContent();
    const reasonsCount = await page.locator('#reasons-list li').count();

    logResult('Test 1: Mandatory Core Ultra Recommendation',
      resultCardVisible && recUltra.includes('Ultra') && ultraScoreVal === '10' && coreScoreVal === '0' && reasonsCount === 3,
      `Result: ${recUltra}, Ultra: ${ultraScoreVal}, Core: ${coreScoreVal}, Reasons: ${reasonsCount}`
    );

    // 5. Retake Quiz cleans all state
    await page.locator('#result-retake-btn').click();
    await page.waitForTimeout(300);
    const isQuizCardShown = await page.locator('#quiz-card').isVisible();
    const isResultCardHidden = !(await page.locator('#result-card').isVisible());
    const q1Progress = await page.locator('#quiz-progress-text').textContent();
    const selectedCount = await page.locator('.option-card.selected').count();
    logResult('Test 6: Reset / Retake Quiz clears all state and resets to Q1',
      isQuizCardShown && isResultCardHidden && q1Progress.toUpperCase().includes('QUESTION 1') && selectedCount === 0
    );

    // 6. Test 2: Mandatory Core recommendation
    // Q1: Everyday Achiever
    await page.locator('.option-card[data-option-id="everyday_achiever"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q2: Everyday
    await page.locator('.option-card[data-option-id="everyday"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q3: Not a priority
    await page.locator('.option-card[data-option-id="not_priority"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q4: Accessible price
    await page.locator('.option-card[data-option-id="accessible_price"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q5: Everyday day
    await page.locator('.option-card[data-option-id="everyday_day"]').click();
    await page.locator('#quiz-next-btn').click();

    await page.waitForTimeout(400);
    const recCore = await page.locator('#result-chip-name').textContent();
    const ultraScoreVal2 = await page.locator('#score-ultra-val').textContent();
    const coreScoreVal2 = await page.locator('#score-core-val').textContent();
    logResult('Test 2: Mandatory Core Series 3 Recommendation',
      recCore.includes('Core™ Series 3') && ultraScoreVal2 === '0' && coreScoreVal2 === '9',
      `Result: ${recCore}, Ultra: ${ultraScoreVal2}, Core: ${coreScoreVal2}`
    );

    // 7. Retake and Test 3: True Tie Test
    await page.locator('#result-retake-btn').click();
    await page.waitForTimeout(200);

    // Q1: Everyday Achiever (0 Ultra, 2 Core)
    await page.locator('.option-card[data-option-id="everyday_achiever"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q2: Intensive (2 Ultra, 0 Core)
    await page.locator('.option-card[data-option-id="intensive"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q3: Somewhat important (1 Ultra, 1 Core)
    await page.locator('.option-card[data-option-id="somewhat_important"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q4: Balance (1 Ultra, 1 Core)
    await page.locator('.option-card[data-option-id="balance"]').click();
    await page.locator('#quiz-next-btn').click();

    // Q5: Mixed day (1 Ultra, 1 Core)
    await page.locator('.option-card[data-option-id="mixed_day"]').click();
    await page.locator('#quiz-next-btn').click();

    await page.waitForTimeout(400);
    const badgeText = await page.locator('#result-badge').textContent();
    const ultraScoreTie = await page.locator('#score-ultra-val').textContent();
    const coreScoreTie = await page.locator('#score-core-val').textContent();
    logResult('Test 3: Exact True Tie balanced recommendation',
      badgeText.includes('Balanced') && ultraScoreTie === '5' && coreScoreTie === '5',
      `Badge: ${badgeText}, Ultra: ${ultraScoreTie}, Core: ${coreScoreTie}`
    );

    // 8. Test 5: Navigation Retention & Modification
    await page.locator('#result-retake-btn').click();
    await page.waitForTimeout(200);
    // Select Creator on Q1
    await page.locator('.option-card[data-option-id="creator"]').click();
    await page.locator('#quiz-next-btn').click();
    // On Q2, go back
    await page.locator('#quiz-prev-btn').click();
    const isCreatorStillSelected = await page.locator('.option-card[data-option-id="creator"]').evaluate(el => el.classList.contains('selected'));
    // Change to Gamer
    await page.locator('.option-card[data-option-id="gamer"]').click();
    const isGamerSelected = await page.locator('.option-card[data-option-id="gamer"]').evaluate(el => el.classList.contains('selected'));
    logResult('Test 5: Navigation Back retains answer & allows changing selection', isCreatorStillSelected && isGamerSelected);

    // 9. Comparison Section & Disclaimer Verification
    const sharedNodeText = await page.locator('.shared-foundation-card').textContent();
    const disclaimerQuote = await page.locator('.disclaimer-quote').textContent();
    logResult('Product Accuracy: Shared Intel 18A Node Mentioned', sharedNodeText.includes('Intel 18A') && sharedNodeText.includes('RibbonFET'));
    logResult('Product Accuracy: Exact Required Disclaimer Present', disclaimerQuote.includes('Intel Matchmaker is an independent educational concept'));

    // 10. Multi-Viewport Inspection & Screenshots
    const viewports = [
      { name: 'desktop-1440', width: 1440, height: 900 },
      { name: 'laptop-1024', width: 1024, height: 768 },
      { name: 'tablet-768', width: 768, height: 1024 },
      { name: 'mobile-375', width: 375, height: 667 },
      { name: 'mobile-320', width: 320, height: 568 }
    ];

    const assetsDir = path.join(__dirname, 'assets');
    if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);

      // Check horizontal scrollbar / overflow
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      const hasHorizontalScroll = scrollWidth > clientWidth;

      const screenshotPath = path.join(assetsDir, `viewport-${vp.name}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });

      logResult(`Visual Test (${vp.width}px): ${vp.name}`, !hasHorizontalScroll, `scrollWidth: ${scrollWidth}, clientWidth: ${clientWidth}, screenshot: viewport-${vp.name}.png`);
    }

    console.log('\n=== ALL PLAYWRIGHT INSPECTIONS FINISHED ===');
    const passedCount = testReport.filter(r => r.pass).length;
    const failedCount = testReport.filter(r => !r.pass).length;
    console.log(`Summary: ${passedCount} PASSED, ${failedCount} FAILED out of ${testReport.length} tests.`);

  } catch (err) {
    console.error('Error during browser verification:', err);
  } finally {
    await browser.close();
  }
}

runBrowserVerification();
