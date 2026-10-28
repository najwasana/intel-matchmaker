# Intel Matchmaker — Swipe Less. Choose Smarter.

**Headline:** It's Not About the Best. It's About Your Best Match.  
**Competition Theme:** Intel Processor Awareness and Creative Design Competition  
**Visual Style:** Premium Lavender Glassmorphism with Original Mascot Chip and 3D Dimensional Compatibility Heart  

---

## 1. Project Title & Overview

**Intel Matchmaker** is an interactive processor discovery web application created for the Intel Processor Awareness and Creative Design Competition.

Rather than overwhelming everyday consumers and laptop shoppers with dense technical jargon, clock frequencies, and confusing benchmark bars, Intel Matchmaker reframes processor selection as an intuitive matchmaking process. Users answer a straightforward 5-question quiz and receive an explainable, deterministic recommendation between:

- **Intel® Core™ Ultra Series 3** (Codename: *Panther Lake*, Personality: *The Power Creator*)
- **Intel® Core™ Series 3** (Codename: *Wildcat Lake*, Personality: *The Everyday Achiever*)

Both processor families share Intel's breakthrough **Intel 18A manufacturing technology** (incorporating RibbonFET gate-all-around transistors and PowerVia backside power delivery), while serving distinct computing experiences and budgets.

---

## 2. Main Objective & Problem Addressed

### Problem
Mainstream laptop buyers frequently struggle with processor branding and technical specifications. Many either:
1. Overpay for ultra-high compute headroom they never use, or
2. Suffer from performance bottlenecks because their processor does not match their real daily creative, gaming, or AI demands.

### Solution
**Intel Matchmaker** provides a transparent, friendly, and deterministic matchmaking engine guided by an adorable mascot named **Chip**. It maps real-world habits (video editing, gaming, heavy multitasking, study, office productivity, and local AI needs) directly to transparent **Matchmaking Points**, explaining precisely why one processor family suits the user or why both represent a balanced fit in the event of a tie.

---

## 3. How the Website Works

1. **Discovery & Profiles:** The user is greeted by **Chip** and a floating dimensional 3D compatibility heart, exploring side-by-side profile cards for both Panther Lake and Wildcat Lake.
2. **Interactive 5-Question Quiz:** Step-by-step questionnaire evaluating digital personality, workload intensity, AI priority, purchasing considerations, and daily routines.
3. **Deterministic Scoring Engine:** A strict mathematical scoring function adds points to each family based on user answers.
4. **Explainable Match Reveal:** Presents the recommended family, codename, personality archetype, exact point totals, 3 tailored reasons derived directly from user choices, and advice on when the alternative processor might still make sense.
5. **Comparison Dashboard & The 3 Big Questions:** Explains what both families have in common (Intel 18A architecture), how they differ in workload targeting, and who each is built for.

---

## 4. Key Features

- **Original Mascot Character (Chip):** Custom vector SVG mascot with glowing visor, welcoming wave, audio pods, and a mini 18A laptop.
- **3D Dimensional Compatibility Heart:** Inspired by modern cyberpunk/glass aesthetics, featuring spherical gradient shading, specular gloss highlights, tech core rings, and pulsing ambient backlight.
- **Deterministic Matchmaking Algorithm:** Zero random weighting or black-box guessing.
- **Tie-Breaker Branch:** Genuinely balanced preferences trigger a neutral "Balanced Dual Match" result with guidance on how to choose between the two.
- **Web Share API & Clipboard Fallback:** One-click sharing with automatic fallback to clipboard copy and toast notifications.
- **Keyboard & Screen-Reader Accessibility:** WAI-ARIA radio groups, visible focus indicators, live regions, and `prefers-reduced-motion` compliance.
- **Zero-Dependency Architecture:** Built strictly with vanilla HTML5, CSS3, and JavaScript.

---

## 5. Technology Stack

- **HTML5:** Semantic architecture, accessible forms, WAI-ARIA roles.
- **CSS3:** Custom CSS properties, CSS Grid, Flexbox, glassmorphism filters (`backdrop-filter`), keyframe animations (`heartFloat`, `mascotHover`, `particleFloat`).
- **JavaScript (ES6+):** Pure functional scoring algorithm, state management, clipboard fallback, and dynamic reason generation.
- **Testing & Verification:** Playwright Browser Automation (Chromium) & Node.js unit assertions.

---

## 6. How to Run Locally

### Method 1: Direct File Opening
Double-click `index.html` in any web browser (Chrome, Edge, Firefox, Safari).

### Method 2: Local Python Server
Run the following in PowerShell or terminal inside the `intel-matchmaker` folder:

```powershell
python -m http.server 8085
```
Open your browser to: **`http://localhost:8085`**

---

## 7. How to Deploy Publicly (GitHub Pages)

1. Initialize Git in the project directory:
   ```bash
   git init
   git add .
   git commit -m "Deploy Intel Matchmaker with mascot Chip and signature heart"
   ```
2. Create a new public repository on GitHub (e.g., `intel-matchmaker`).
3. Link and push to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/intel-matchmaker.git
   git branch -M main
   git push -u origin main
   ```
4. In GitHub repository settings, go to **Settings > Pages**.
5. Under **Build and deployment > Branch**, select `main` and root directory `/`, then click **Save**.
6. GitHub will publish your live website URL at:  
   `https://<your-username>.github.io/intel-matchmaker/`

---

## 8. How to Test the Live Version

1. Open the published live URL in a private/incognito browser window.
2. Verify that all styles, fonts, and SVG assets (Chip and the Heart) load cleanly without broken image icons.
3. Open Developer Tools (`F12`) and confirm that the Console displays zero errors.
4. Complete the 5 quiz questions to test both recommendation branches and the tie branch.
5. Test on mobile viewports (e.g., iPhone or Android) to verify responsive stacking.

---

## 9. Known Limitations

- **Web Share API Support:** The native system share sheet requires an HTTPS context or modern mobile browser. On desktop HTTP localhost, the app automatically falls back to copying the share text and URL to the clipboard with an instant confirmation toast.

---

## 10. Educational & Factual Accuracy Note

> “Intel Matchmaker is an independent educational concept. Recommendations are based on stated preferences, not official Intel benchmarks or personalised technical testing. Actual laptop performance depends on the device configuration and workload.”

---

## 11. Google Form Submission Checklist

Copy and paste the exact information below into the competition submission form:

| Field Name | Submission Content / Value |
| :--- | :--- |
| **Project Title** | Intel Matchmaker |
| **Short Tagline** | Swipe Less. Choose Smarter. |
| **Headline** | It's Not About the Best. It's About Your Best Match. |
| **Concise Description** | An interactive processor discovery web experience guiding users through a 5-question workflow quiz to find their ideal laptop match between Intel Core Ultra Series 3 (Panther Lake) and Intel Core Series 3 (Wildcat Lake). |
| **Longer Project Overview** | Intel Matchmaker transforms processor selection from overwhelming benchmark comparisons into a welcoming, transparent matchmaking experience. Featuring an animated robot mascot named Chip, a glossy 3D dimensional compatibility heart, and a lavender glassmorphism aesthetic, users answer 5 questions regarding their creative habits, workload intensity, local AI priorities, and daily routine. The deterministic engine calculates transparent Matchmaking Points, revealing an explainable processor recommendation alongside a side-by-side comparison highlighting their shared Intel 18A manufacturing technology. |
| **Problem Statement** | Everyday laptop buyers and students often struggle to understand modern processor naming and architecture, leading them either to overpay for unneeded high-wattage computing headroom or under-invest and suffer bottlenecks during creative, gaming, or AI tasks. |
| **Proposed Solution** | A friendly, accessible, and deterministic web matchmaking tool that translates real human habits into explainable processor recommendations with equal visual respect given to both performance-creator and smart-everyday families. |
| **Main Features** | • Original animated vector mascot "Chip" with waving welcome and celebratory animations.<br>• Signature 3D dimensional cyber-lavender compatibility heart.<br>• 5-question deterministic quiz with progress tracking and back/forward state retention.<br>• Transparent Matchmaking Points breakdown (not performance percentages).<br>• Fully reachable tie-breaking branch.<br>• Comprehensive comparison dashboard highlighting shared Intel 18A manufacturing technology.<br>• Web Share API with clipboard copy fallback.<br>• Fully responsive across 320px, 375px, 768px, 1024px, and 1440px viewports.<br>• Keyboard accessible with `prefers-reduced-motion` support. |
| **Technology Stack** | HTML5, CSS3 (Lavender Glassmorphism, CSS Grid, Flexbox, Keyframes), Vanilla JavaScript (ES6+), Playwright Browser Testing. Zero external framework dependencies. |
| **Public Website URL** | `[INSERT YOUR LIVE GITHUB PAGES URL, e.g., https://<username>.github.io/intel-matchmaker/]` |
| **Source Code Repository URL** | `[INSERT YOUR GITHUB REPO URL, e.g., https://github.com/<username>/intel-matchmaker]` |
| **Demo Video URL** | `[OPTIONAL: Insert unlisted YouTube/Loom video link if requested by the form, otherwise Leave Blank]` |
| **Team / Member Information** | `[INSERT FULL NAME, EMAIL, INSTITUTION / AFFILIATION]` |
| **Screenshots / Evidence Captured**| • Desktop Hero & Mascot Stage (`assets/viewport-desktop-1440.png`)<br>• Interactive Quiz Screen (`assets/screenshot-desktop-1440.png`)<br>• Result Reveal Screen with Celebratory Mascot & Heart Score<br>• Mobile Viewport Layout (`assets/viewport-mobile-375.png`) |
| **Creative Concept & Relevance** | Developed specifically for the Intel Processor Awareness and Creative Design Competition. It showcases how playful design (friendly robot mascot, dimensional heart, pastel palette) can coexist with rigorous technical accuracy (accurate positioning of Panther Lake and Wildcat Lake, citing shared Intel 18A process node, RibbonFET, and PowerVia). |
| **Factual Accuracy Statement** | Recommendations are preference-based workflow alignments and do not claim official Intel benchmark testing or performance guarantees. Both processor families are presented with equal visual importance. |
