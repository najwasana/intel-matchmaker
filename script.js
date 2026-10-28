/**
 * INTEL MATCHMAKER — JAVASCRIPT LOGIC ENGINE
 * Complete deterministic scoring, quiz state management, result rendering,
 * accessibility keyboard support, and Web Share API with clipboard fallback.
 */

// Strict Mode
'use strict';

/**
 * QUIZ QUESTIONS DATA MODEL
 * Grounded in the competition brief rules and point assignments.
 */
const QUIZ_QUESTIONS = [
  {
    id: 1,
    title: "What's your digital personality?",
    subtitle: "Select the option that best reflects your primary computing style.",
    options: [
      {
        id: "creator",
        title: "Creator",
        desc: "Video editing, design, 3D art, and content creation.",
        points: { ultra: 2, core: 0 }
      },
      {
        id: "gamer",
        title: "Gamer",
        desc: "Gaming, streaming, and demanding graphics applications.",
        points: { ultra: 2, core: 0 }
      },
      {
        id: "multitasker",
        title: "Multitasker",
        desc: "High productivity, massive browser tabs, and intensive tasks.",
        points: { ultra: 1, core: 0 }
      },
      {
        id: "everyday_achiever",
        title: "Everyday Achiever",
        desc: "Study, web browsing, documents, spreadsheets, and meetings.",
        points: { ultra: 0, core: 2 }
      }
    ]
  },
  {
    id: 2,
    title: "How demanding is your usual workload?",
    subtitle: "Think about what software runs on your laptop every day.",
    options: [
      {
        id: "intensive",
        title: "Intensive",
        desc: "Heavy rendering, large project builds, code compiling, high-res editing.",
        points: { ultra: 2, core: 0 }
      },
      {
        id: "mixed",
        title: "Mixed",
        desc: "A balanced blend of everyday office tasks and occasional heavier applications.",
        points: { ultra: 1, core: 1 }
      },
      {
        id: "everyday",
        title: "Everyday",
        desc: "Standard productivity, video streaming, document processing, and study.",
        points: { ultra: 0, core: 2 }
      }
    ]
  },
  {
    id: 3,
    title: "How important are demanding AI workloads to you?",
    subtitle: "From advanced local generative models to right-sized smart assistants.",
    options: [
      {
        id: "very_important",
        title: "Very important",
        desc: "Running local LLMs, AI diffusion models, and intensive creative AI filters.",
        points: { ultra: 2, core: 0 }
      },
      {
        id: "somewhat_important",
        title: "Somewhat important",
        desc: "Smart assistant features, background blur, noise cancellation, and hybrid tools.",
        points: { ultra: 1, core: 1 }
      },
      {
        id: "not_priority",
        title: "Not a priority",
        desc: "Traditional computing is primary; AI enhancements are a nice bonus if available.",
        points: { ultra: 0, core: 1 }
      }
    ]
  },
  {
    id: 4,
    title: "What matters most when choosing a laptop?",
    subtitle: "Your top purchasing priority.",
    options: [
      {
        id: "demanding_perf",
        title: "Performance for demanding workloads",
        desc: "Uncompromised capability, high sustained compute, and headroom for demanding tasks.",
        points: { ultra: 2, core: 0 }
      },
      {
        id: "balance",
        title: "Balance of capability and efficiency",
        desc: "Versatile performance with smart power management for mixed everyday mobile life.",
        points: { ultra: 1, core: 1 }
      },
      {
        id: "accessible_price",
        title: "Modern everyday computing at a more accessible price point",
        desc: "Modern technology, reliability, and great everyday value without paying for unused power.",
        points: { ultra: 0, core: 2 }
      }
    ]
  },
  {
    id: 5,
    title: "What does your typical day look like?",
    subtitle: "The routine that defines your device usage.",
    options: [
      {
        id: "intensive_day",
        title: "Creating, editing, gaming, or intensive work",
        desc: "Long sessions pushing hardware capabilities in design suites, gaming, or code environments.",
        points: { ultra: 2, core: 0 }
      },
      {
        id: "mixed_day",
        title: "A mixture of productivity and intensive work",
        desc: "Shifting between documents, calls, and occasional intensive creative or analytical bursts.",
        points: { ultra: 1, core: 1 }
      },
      {
        id: "everyday_day",
        title: "Studying, browsing, documents, meetings, and everyday tasks",
        desc: "Lectures, coursework, web exploration, video conferencing, and daily communication.",
        points: { ultra: 0, core: 2 }
      }
    ]
  }
];

/**
 * APPLICATION STATE OBJECT
 */
const AppState = {
  currentQuestionIndex: 0,
  userAnswers: {}, // key: questionId (1-5), value: optionId
  lastCalculatedResult: null
};

/**
 * DETERMINISTIC SCORING ALGORITHM
 * Pure, isolated, fully testable function
 * @param {Object} answers - Map of questionId to optionId
 * @returns {Object} Result summary with point totals, recommendation, and reason metadata
 */
function calculateMatchmakingScores(answers) {
  let ultraPoints = 0;
  let corePoints = 0;
  const answeredQuestionsCount = Object.keys(answers).length;

  for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
    const q = QUIZ_QUESTIONS[i];
    const selectedOptionId = answers[q.id];
    if (selectedOptionId) {
      const option = q.options.find(opt => opt.id === selectedOptionId);
      if (option && option.points) {
        ultraPoints += option.points.ultra || 0;
        corePoints += option.points.core || 0;
      }
    }
  }

  let recommendation = 'tie';
  if (ultraPoints > corePoints) {
    recommendation = 'ultra';
  } else if (corePoints > ultraPoints) {
    recommendation = 'core';
  }

  return {
    ultraPoints,
    corePoints,
    recommendation,
    answeredCount: answeredQuestionsCount,
    isComplete: answeredQuestionsCount === QUIZ_QUESTIONS.length
  };
}

/**
 * GENERATE EXPLAINABLE REASONS
 * Determines 3 concise reasons tailored to user's exact selections
 */
function generateReasons(answers, recommendation) {
  const reasons = [];

  const q1 = answers[1];
  const q2 = answers[2];
  const q3 = answers[3];
  const q4 = answers[4];
  const q5 = answers[5];

  if (recommendation === 'ultra') {
    // Reason 1: Personality & Workflow
    if (q1 === 'creator') {
      reasons.push("As a Creator, your video editing and design suites directly benefit from Core Ultra's dedicated performance headroom.");
    } else if (q1 === 'gamer') {
      reasons.push("As a Gamer, you require the sustained graphics and compute capability engineered into the Core Ultra architecture.");
    } else if (q1 === 'multitasker') {
      reasons.push("Your multitasking profile requires high responsiveness across simultaneous demanding applications.");
    } else {
      reasons.push("Your primary workflow thrives on maximum sustained performance and multitasking headroom.");
    }

    // Reason 2: Workload & AI Demands
    if (q3 === 'very_important') {
      reasons.push("Your requirement for demanding local AI acceleration matches Core Ultra's powerful on-device inferencing capabilities.");
    } else if (q2 === 'intensive' || q5 === 'intensive_day') {
      reasons.push("Your regular intensive workloads demand the robust sustained throughput of Panther Lake.");
    } else {
      reasons.push("Provides generous headroom for expanding into more demanding computing tasks without hardware bottlenecks.");
    }

    // Reason 3: Purchasing Priority
    if (q4 === 'demanding_perf') {
      reasons.push("Aligns with your top priority: performance for demanding workloads without compromise.");
    } else {
      reasons.push("Backed by advanced Intel 18A manufacturing for high compute density and modern power efficiency.");
    }

  } else if (recommendation === 'core') {
    // Reason 1: Personality & Daily Habits
    if (q1 === 'everyday_achiever') {
      reasons.push("Your Everyday Achiever workflow matches Core Series 3 perfectly for fluid web browsing, office suites, and coursework.");
    } else {
      reasons.push("Fits your primary workflow without requiring you to pay a premium for unneeded compute headroom.");
    }

    // Reason 2: Workload & Right-sized AI
    if (q3 === 'not_priority' || q3 === 'somewhat_important') {
      reasons.push("Delivers right-sized AI capabilities for intelligent camera effects and smart assistants without unnecessary battery drain.");
    } else if (q2 === 'everyday' || q5 === 'everyday_day') {
      reasons.push("Optimized for daily productivity, study, video conferencing, and smooth media streaming.");
    } else {
      reasons.push("Balances capability and cool-running efficiency for everyday mobile convenience.");
    }

    // Reason 3: Purchasing Priority & Value
    if (q4 === 'accessible_price') {
      reasons.push("Directly answers your preference: modern computing features at a more accessible, value-conscious price point.");
    } else {
      reasons.push("Engineered on the breakthrough Intel 18A process node, offering modern architecture at great everyday value.");
    }

  } else {
    // Neutral Tie Reasons
    reasons.push("Your workflow is exceptionally balanced between everyday tasks and occasional intensive demands.");
    reasons.push("Both families share the cutting-edge Intel 18A process node, guaranteeing modern architecture and efficiency.");
    reasons.push("If budget and all-day battery matter most, choose Core Series 3; if you plan to do heavy video editing or gaming, step up to Core Ultra.");
  }

  return reasons;
}

/**
 * DOM CONTROLLER & EVENT LISTENERS
 */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const primaryNav = document.getElementById('primary-nav');
  const navItems = document.querySelectorAll('.nav-item');

  const quizCard = document.getElementById('quiz-card');
  const resultCard = document.getElementById('result-card');
  const quizProgressText = document.getElementById('quiz-progress-text');
  const quizProgressFill = document.getElementById('quiz-progress-fill');
  const quizProgressBar = document.getElementById('quiz-progressbar');
  const quizPercentageText = document.getElementById('quiz-percentage-text');
  const quizQuestionTitle = document.getElementById('quiz-question-title');
  const quizQuestionSubtitle = document.getElementById('quiz-question-subtitle');
  const quizOptionsGrid = document.getElementById('quiz-options-grid');
  const quizValidation = document.getElementById('quiz-validation');
  const quizPrevBtn = document.getElementById('quiz-prev-btn');
  const quizNextBtn = document.getElementById('quiz-next-btn');
  const quizResetBtn = document.getElementById('quiz-reset-btn');

  // Hero & CTA buttons
  const heroFindMatchBtn = document.getElementById('hero-find-match-btn');
  const navCtaBtn = document.getElementById('nav-cta-btn');
  const compQuizTriggers = document.querySelectorAll('.comp-quiz-trigger');
  const exploreBtns = document.querySelectorAll('.explore-btn');

  // Result Elements
  const resultBadge = document.getElementById('result-badge');
  const resultTitle = document.getElementById('result-title');
  const resultSubtitle = document.getElementById('result-subtitle');
  const resultBox = document.getElementById('result-box');
  const resultChipName = document.getElementById('result-chip-name');
  const resultCodename = document.getElementById('result-codename');
  const resultPersonality = document.getElementById('result-personality');
  const resultSummary = document.getElementById('result-summary');
  const scoreUltraVal = document.getElementById('score-ultra-val');
  const scoreCoreVal = document.getElementById('score-core-val');
  const barUltraFill = document.getElementById('bar-ultra-fill');
  const barCoreFill = document.getElementById('bar-core-fill');
  const scoreCardUltra = document.getElementById('score-card-ultra');
  const scoreCardCore = document.getElementById('score-card-core');
  const reasonsList = document.getElementById('reasons-list');
  const altTitle = document.getElementById('alt-title');
  const altDesc = document.getElementById('alt-desc');
  const resultRetakeBtn = document.getElementById('result-retake-btn');
  const resultShareBtn = document.getElementById('result-share-btn');
  const shareToast = document.getElementById('share-toast');

  // Mobile menu toggle
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('active');
      mobileMenuBtn.classList.toggle('open', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  // Close mobile nav on click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      if (primaryNav.classList.contains('active')) {
        primaryNav.classList.remove('active');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Smooth scroll & CTA linking to Quiz
  function scrollToQuiz() {
    const quizElem = document.getElementById('quiz-section');
    if (quizElem) {
      quizElem.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (heroFindMatchBtn) heroFindMatchBtn.addEventListener('click', scrollToQuiz);
  if (navCtaBtn) navCtaBtn.addEventListener('click', scrollToQuiz);
  compQuizTriggers.forEach(btn => btn.addEventListener('click', scrollToQuiz));

  exploreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget.getAttribute('data-target');
      const targetElem = document.getElementById(target);
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  /**
   * SHOW TOAST MESSAGE
   */
  let toastTimer = null;
  function showToast(message) {
    if (!shareToast) return;
    shareToast.textContent = message;
    shareToast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      shareToast.classList.remove('show');
    }, 3800);
  }

  /**
   * RENDER CURRENT QUIZ QUESTION
   */
  function renderQuestion() {
    const qIndex = AppState.currentQuestionIndex;
    const question = QUIZ_QUESTIONS[qIndex];
    const totalQuestions = QUIZ_QUESTIONS.length;
    const progressPercent = Math.round(((qIndex + 1) / totalQuestions) * 100);

    // Update Header
    quizProgressText.textContent = `Question ${qIndex + 1} of ${totalQuestions}`;
    quizProgressBar.setAttribute('aria-valuenow', progressPercent);
    quizProgressFill.style.width = `${progressPercent}%`;
    quizPercentageText.textContent = `${progressPercent}%`;

    // Update Question titles
    quizQuestionTitle.textContent = question.title;
    quizQuestionSubtitle.textContent = question.subtitle;
    quizValidation.textContent = "";

    // Clear Options Container
    quizOptionsGrid.innerHTML = "";

    const currentSelectedOption = AppState.userAnswers[question.id];

    // Render Options
    question.options.forEach((opt, idx) => {
      const isSelected = currentSelectedOption === opt.id;

      const card = document.createElement('div');
      card.className = `option-card ${isSelected ? 'selected' : ''}`;
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      card.setAttribute('tabindex', '0');
      card.dataset.optionId = opt.id;

      card.innerHTML = `
        <div class="option-indicator" aria-hidden="true">
          <div class="option-indicator-dot"></div>
        </div>
        <div class="option-body">
          <div class="option-title">${opt.title}</div>
          <div class="option-desc">${opt.desc}</div>
        </div>
      `;

      // Click handler
      card.addEventListener('click', () => {
        selectOption(question.id, opt.id);
      });

      // Keyboard handler (Enter / Space)
      card.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          selectOption(question.id, opt.id);
        }
      });

      quizOptionsGrid.appendChild(card);
    });

    // Update buttons
    quizPrevBtn.disabled = qIndex === 0;
    quizNextBtn.disabled = !currentSelectedOption;
    if (qIndex === totalQuestions - 1) {
      quizNextBtn.innerHTML = `
        See Match Result
        <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd"/>
        </svg>
      `;
    } else {
      quizNextBtn.innerHTML = `
        Continue
        <svg viewBox="0 0 20 20" fill="currentColor" class="btn-icon" aria-hidden="true">
          <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      `;
    }
  }

  /**
   * SELECT OPTION
   */
  function selectOption(questionId, optionId) {
    AppState.userAnswers[questionId] = optionId;
    quizValidation.textContent = "";

    // Update visuals
    const optionCards = quizOptionsGrid.querySelectorAll('.option-card');
    optionCards.forEach(c => {
      const match = c.dataset.optionId === optionId;
      c.classList.toggle('selected', match);
      c.setAttribute('aria-checked', match ? 'true' : 'false');
    });

    quizNextBtn.disabled = false;
  }

  /**
   * ADVANCE QUESTION / FINISH
   */
  function handleNext() {
    const qIndex = AppState.currentQuestionIndex;
    const currentQ = QUIZ_QUESTIONS[qIndex];

    if (!AppState.userAnswers[currentQ.id]) {
      quizValidation.textContent = "Please select an answer to continue.";
      return;
    }

    if (qIndex < QUIZ_QUESTIONS.length - 1) {
      AppState.currentQuestionIndex++;
      renderQuestion();
    } else {
      // Complete quiz and reveal result
      finishQuiz();
    }
  }

  /**
   * PREVIOUS QUESTION
   */
  function handlePrev() {
    if (AppState.currentQuestionIndex > 0) {
      AppState.currentQuestionIndex--;
      renderQuestion();
    }
  }

  /**
   * RESET QUIZ STATE
   */
  function resetQuiz() {
    AppState.currentQuestionIndex = 0;
    AppState.userAnswers = {};
    AppState.lastCalculatedResult = null;

    resultCard.classList.add('hidden');
    quizCard.classList.remove('hidden');

    renderQuestion();
    scrollToQuiz();
  }

  /**
   * FINISH QUIZ & RENDER RESULT
   */
  function finishQuiz() {
    const result = calculateMatchmakingScores(AppState.userAnswers);
    AppState.lastCalculatedResult = result;

    const { ultraPoints, corePoints, recommendation } = result;
    const maxScore = 10; // Maximum possible in scoring scheme
    const ultraPct = Math.min(100, Math.round((ultraPoints / maxScore) * 100));
    const corePct = Math.min(100, Math.round((corePoints / maxScore) * 100));

    // Update score displays
    scoreUltraVal.textContent = ultraPoints;
    scoreCoreVal.textContent = corePoints;
    barUltraFill.style.width = `${ultraPct}%`;
    barCoreFill.style.width = `${corePct}%`;

    // Highlight winner cards
    scoreCardUltra.classList.remove('winner');
    scoreCardCore.classList.remove('winner');
    resultBox.classList.remove('tie-highlight');

    // Update Result Celebratory Bubble & Heart Score Badge
    const celebrateBubble = document.getElementById('celebrate-bubble');
    const compatibilityPct = document.getElementById('result-compatibility-pct');
    const compatibilityCaption = document.getElementById('result-compatibility-caption');

    const reasons = generateReasons(AppState.userAnswers, recommendation);
    reasonsList.innerHTML = reasons.map(r => `<li>${r}</li>`).join('');

    if (recommendation === 'ultra') {
      resultBadge.textContent = "Definitive Match";
      resultTitle.textContent = "Your Best Match: Intel® Core™ Ultra Series 3";
      resultChipName.textContent = "Intel® Core™ Ultra Series 3";
      resultCodename.textContent = "Codename: Panther Lake";
      resultPersonality.textContent = "The Power Creator";
      resultSummary.textContent = "Your stated preferences demand sustained horsepower, heavy creative or gaming capabilities, and maximum local AI headroom.";

      if (celebrateBubble) celebrateBubble.innerHTML = `<span>"Power match found: Core™ Ultra!"</span>`;
      if (compatibilityPct) compatibilityPct.textContent = `${ultraPoints} Pts`;
      if (compatibilityCaption) compatibilityCaption.textContent = `Match Score`;

      scoreCardUltra.classList.add('winner');

      altTitle.textContent = "When might Intel® Core™ Series 3 make sense for you?";
      altDesc.textContent = "If you ever find your usage dialing back to lighter day-to-day documents and study, or if battery longevity and price sensitivity become paramount, Core Series 3 offers modern 18A architecture without paying for unneeded headroom.";

    } else if (recommendation === 'core') {
      resultBadge.textContent = "Definitive Match";
      resultTitle.textContent = "Your Best Match: Intel® Core™ Series 3";
      resultChipName.textContent = "Intel® Core™ Series 3";
      resultCodename.textContent = "Codename: Wildcat Lake";
      resultPersonality.textContent = "The Everyday Achiever";
      resultSummary.textContent = "Your workflow is driven by everyday productivity, coursework, smooth browsing, and right-sized AI assistance at great value.";

      if (celebrateBubble) celebrateBubble.innerHTML = `<span>"Smart match found: Core™ Series 3!"</span>`;
      if (compatibilityPct) compatibilityPct.textContent = `${corePoints} Pts`;
      if (compatibilityCaption) compatibilityCaption.textContent = `Match Score`;

      scoreCardCore.classList.add('winner');

      altTitle.textContent = "When might Intel® Core™ Ultra Series 3 make sense for you?";
      altDesc.textContent = "If your aspirations shift into heavy 4K video editing, local generative AI models, or high-tier gaming, stepping up to Core Ultra Series 3 will give you the dedicated compute and graphics headroom required.";

    } else {
      // True Tie Branch
      resultBadge.textContent = "Balanced Dual Match";
      resultTitle.textContent = "Your Best Match: A Balanced Fit";
      resultChipName.textContent = "Equal Match: Core™ Ultra & Core™ Series 3";
      resultCodename.textContent = "Panther Lake & Wildcat Lake (Intel 18A)";
      resultPersonality.textContent = "Versatile Explorer";
      resultSummary.textContent = "Your answers scored identically across both processor families! Both share Intel 18A manufacturing and represent outstanding fits depending on whether you value top-tier headroom or smart everyday value.";

      if (celebrateBubble) celebrateBubble.innerHTML = `<span>"A perfect balance between both!"</span>`;
      if (compatibilityPct) compatibilityPct.textContent = `5 - 5`;
      if (compatibilityCaption) compatibilityCaption.textContent = `Balanced Fit`;

      resultBox.classList.add('tie-highlight');
      scoreCardUltra.classList.add('winner');
      scoreCardCore.classList.add('winner');

      altTitle.textContent = "How to break the tie?";
      altDesc.textContent = "Prioritize Core™ Ultra Series 3 if you expect your creative and gaming ambitions to grow, or prioritize Core™ Series 3 if price accessibility and everyday efficiency are your deciding criteria.";
    }

    // Switch view
    quizCard.classList.add('hidden');
    resultCard.classList.remove('hidden');

    // Scroll to result
    resultCard.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * SHARE RESULT (Web Share API with Clipboard Fallback)
   */
  async function handleShare() {
    if (!AppState.lastCalculatedResult) return;

    const res = AppState.lastCalculatedResult;
    let matchText = "Intel Core Ultra Series 3";
    if (res.recommendation === 'core') matchText = "Intel Core Series 3";
    else if (res.recommendation === 'tie') matchText = "Both Core Ultra & Core Series 3 (Balanced Match)";

    const shareData = {
      title: "My Intel Matchmaker Result",
      text: `I took the Intel Matchmaker quiz! My processor match is ${matchText} (Ultra: ${res.ultraPoints} pts, Core: ${res.corePoints} pts). Discover your match:`,
      url: window.location.href.split('#')[0]
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast("Shared successfully!");
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyFallback(`${shareData.text} ${shareData.url}`);
        }
      }
    } else {
      copyFallback(`${shareData.text} ${shareData.url}`);
    }
  }

  function copyFallback(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          showToast("Result copied to clipboard! Ready to share.");
        })
        .catch(() => {
          showToast("Could not copy automatically. You can copy the URL to share.");
        });
    } else {
      showToast("Sharing not supported in this browser. Please copy the URL.");
    }
  }

  // Quiz Event Listeners
  quizNextBtn.addEventListener('click', handleNext);
  quizPrevBtn.addEventListener('click', handlePrev);
  quizResetBtn.addEventListener('click', resetQuiz);
  resultRetakeBtn.addEventListener('click', resetQuiz);
  resultShareBtn.addEventListener('click', handleShare);

  // Initialize Quiz View
  renderQuestion();
});
}

// Expose scoring and data for automated testing in Node/Browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    QUIZ_QUESTIONS,
    calculateMatchmakingScores,
    generateReasons
  };
}
