<div align="center">

# 🌱 FLAGGED
**Small choices. Measurable impact.**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.14-FFCA28?logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)

<img width="800" alt="FLAGGED Banner Placeholder" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />

*A next-generation behavior change platform designed to make sustainability an engaging, daily habit.*

</div>

---

## 🌍 Project Overview

FLAGGED is not just another carbon calculator. It is a **student-focused behavior change platform** designed to transform abstract climate concepts into tangible, daily habits. By leveraging gamification, beautiful UI design, and personalized AI insights, FLAGGED helps individuals effortlessly monitor their ecological footprint and gradually shift towards a sustainable lifestyle.

---

## 🎯 Problem We Solve

Our application is meticulously aligned with the core problem statement: *"Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights."*

* **🧠 Understand:** We translate raw carbon data into an intuitive "Flag Score" and provide a dedicated **Carbon Breakdown Card** so users clearly understand *why* their score is high or low (e.g., "Transport accounts for 40% of your footprint").
* **📈 Track:** A frictionless, 30-second daily check-in system tracks user choices across Transport, Food, Energy, and Shopping.
* **📉 Reduce:** Gemini AI analyzes the user's historical logs to provide highly personalized, actionable recommendations and "Improvement Challenges" to actively reduce their footprint.

---

## ✨ Features Showcase

| Feature | Description | Technical Implementation |
| :--- | :--- | :--- |
| 🤖 **AI Sustainability Insights** | Personalized lifestyle recommendations based on habit history. | Uses Google Gemini API with 24-hour `localStorage` caching to minimize latency. |
| 📊 **Carbon Impact Tracking** | Daily tracking of transport, diet, AC usage, and shopping habits. | Real-time calculation engines derived from established Emission Factors. |
| 🎮 **Gamified Progress** | Users earn XP, maintain streaks, and evolve their "Flag Era" tree. | Complex `ScoreEngine` mapping 30-day historical trends to user profiles. |
| ♿ **Universal Accessibility** | Features text scaling, high-contrast themes, and reduced motion. | Fully semantic HTML, dynamic ARIA labels, and `aria-live` screen-reader toasts. |

---

## 📸 App Preview

*(Replace these placeholders by adding actual images to `docs/images/`)*

<div align="center">
  <img src="docs/images/dashboard.png" width="250" alt="Dashboard View" />
  <img src="docs/images/insights.png" width="250" alt="AI Insights View" />
  <img src="docs/images/onboarding.png" width="250" alt="Onboarding Flow" />
</div>

---

## 🏗️ Architecture

The application follows a strictly decoupled, service-oriented architecture.

```mermaid
graph TD
    A[User Interface] --> B(React Contexts / Hooks)
    B --> C{Service Layer}
    C -->|Auth & Data| D[Firebase / Firestore]
    C -->|Generative AI| E[Gemini API]
    C -->|Calculations| F[Score & Carbon Engines]
    
    classDef ui fill:#4C3D19,stroke:#CFBB99,stroke-width:2px,color:#fff;
    classDef logic fill:#354024,stroke:#889063,stroke-width:2px,color:#fff;
    classDef external fill:#1A2315,stroke:#4C3D19,stroke-width:2px,color:#fff;
    
    class A ui;
    class B,C,F logic;
    class D,E external;
```

---

## 💻 Tech Stack

* **Frontend:** React 19, TypeScript, Vite, TailwindCSS
* **Backend / Database:** Firebase Authentication, Cloud Firestore
* **Artificial Intelligence:** Google Gemini API (`@google/genai`)
* **Animations:** Motion (Framer Motion)
* **Testing:** Vitest

---

## 🔄 Data Flow

1. **User Action:** User completes a 30-second daily check-in.
2. **Daily Log:** Data is validated and securely written to Firestore.
3. **Score Engine:** `calculateDailyScore` and `calculateDailyEmissions` process the raw data against environmental constants.
4. **Insights:** The user's updated 30-day history is passed to the `GeminiService`.
5. **Personalized Recommendations:** Gemini generates a custom roasting/forecast which is cached locally and displayed on the Insights tab.

---

## 🛡️ Security Approach

FLAGGED is designed with production-grade security practices:
* **Authentication:** Secure session management via Firebase Auth.
* **Data Isolation:** Frontend queries strictly filter by `where("userId", "==", user.uid)` to prevent unauthorized data access.
* **Environment Protection:** All API keys (Firebase, Gemini) are strictly managed via `.env` variables and `.gitignore`. No hardcoded credentials exist in the source code.
* **Service Workers:** Dynamic configuration injection prevents public credential exposure in static files.

---

## ⚡ Performance & Engineering

* **Code Splitting:** Heavy modals (`SettingsScreen`, `DayDetailsScreen`) and particle effects (`Confetti`) are lazy-loaded via `React.lazy()` and `<Suspense>`.
* **Vite Chunking:** Vendor dependencies (`react`, `firebase`, `motion`) are isolated into `manualChunks` to eliminate large bundle warnings and maximize browser caching.
* **Render Optimization:** All massive context providers and heavy algorithmic derivations are memoized using `useMemo` and `useCallback` to prevent cascading re-renders.
* **Intelligent Caching:** Expensive AI insights are stored in `localStorage` with a strict 24-hour expiry threshold.

---

## 🧪 Testing & Validation

The core logical engines of FLAGGED are fully validated.
* **Framework:** `Vitest` is integrated for rapid unit testing.
* **Coverage:** 12 robust test cases currently cover `ScoreEngine.ts` and `CarbonService.ts`.
* **Resilience:** Tests explicitly validate that engines fail gracefully (without crashing the UI) when fed empty logs, missing variables, or legacy data structures.

---

## 🚀 Future Scope

While FLAGGED is currently a fully functioning prototype, the roadmap for expanding the ecosystem includes:
* **Wearable Integration:** Auto-logging walking and cycling distances via Apple Health / Google Fit APIs.
* **Receipt Scanning:** Using OCR to calculate the carbon footprint of grocery hauls automatically.
* **Social Leaderboards:** Campus-wide or company-wide sustainability challenges to increase engagement.

---

<div align="center">
  <i>Built with ❤️ for a greener future.</i>
</div>
