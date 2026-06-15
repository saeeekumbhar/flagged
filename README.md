<div align="center">

# FLAGGED

<br />

<a href="https://github.com/saeeekumbhar/flagged">
  <img src="https://readme-typing-svg.demolab.com?font=Outfit&weight=600&size=22&pause=1500&color=889063&center=true&vCenter=true&width=500&lines=Small+choices.+Measurable+impact.;Understand.+Track.+Reduce.;Gamify+your+sustainability+journey." alt="Typing SVG" />
</a>

<br />

[![Project](https://img.shields.io/badge/Project-FLAGGED-354024?style=for-the-badge)](https://github.com/saeeekumbhar/flagged)
[![Status](https://img.shields.io/badge/Status-ACTIVE-889063?style=for-the-badge)](#)
<br />
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite_Fast-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

---

### ✨ Master Your Footprint

**Gamified, Accessible, and Built for Everyday Impact**

</div>

---

### 🌍 Vertical: GreenTech / SustainabilityTech

FLAGGED is a specialized platform for Carbon Footprint Awareness and Behavioral Change. It is designed specifically for students and young professionals who find traditional carbon calculators abstract, tedious, and disconnected from their daily reality.

---

### 🧩 Core Features (Fully Functional Prototype)

* 🤖 **AI Sustainability Insights:** Personalized lifestyle recommendations, "climate roasts," and DNA generation powered dynamically by the Google Gemini API based on actual user logs.
* 📊 **Carbon Impact Tracking:** A frictionless, mobile-first 30-second daily check-in that tracks transport, diet, AC usage, and shopping habits without cognitive overload.
* 🎮 **Dynamic Gamification Engine:** A reactive system where users earn XP, maintain streaks, and visually evolve their "Flag Era" tree based on a rolling 30-day average score. Features **dynamic badges** that unlock by analyzing historical data patterns.
* 🪙 **Closed-Loop Eco Economy:** Users earn points for sustainable choices which can be redeemed in the "Eco Rewards" marketplace for tangible real-world benefits (e.g., planting real trees, local vegan cafe discounts).
* ♿ **Inclusive Accessibility:** Built-in font scaling, high-contrast themes, dynamic ARIA labels, and `aria-live` screen-reader toasts for maximum usability.
* 🔐 **Secure Architecture:** Seamless authentication and real-time syncing via Firebase, with strict Firestore data isolation and `.env` protected API gateways.

---

### 📸 App Preview

<div align="center">
  <img src="docs/images/mockup_home.png" width="250" alt="Home Dashboard Mockup" />
  <img src="docs/images/mockup_journey.png" width="250" alt="Journey Mockup" />
  <img src="docs/images/mockup_challenges.png" width="250" alt="Green Missions Mockup" />
</div>

---

### 🏗️ System Architecture

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

### 🚀 Approach & Logic

My approach focuses on reducing cognitive load by turning passive data entry into an active, rewarding experience:

1. **Micro-Interactions:** By replacing exhaustive text forms with one-tap icon selections, the platform reduces daily logging friction to under 30 seconds.
2. **Visual Logic:** Instead of just showing a number, the user's progress is visualized through the growth of a "Flag Era" tree, providing immediate emotional feedback.
3. **Actionable AI:** Rather than generic advice, the Gemini integration reads the user's specific 30-day history to provide hyper-contextual tips (e.g., "You drove 4 times this week, try the metro tomorrow").

---

### 🧠 Assumptions Made

* **Mobile-First Reality:** The application is strictly optimized for mobile viewports, assuming users will track habits on the go via their smartphones.
* **Algorithmic Weighting:** The `ScoreEngine` heavily weights recent behavior (last 7 days = 50% weight) over older behavior to ensure the gamification feels highly responsive to immediate lifestyle changes.
* **Local Caching Limit:** It assumes users will check the app daily, hence the strict 24-hour `localStorage` expiration for Gemini Insights to balance API costs with fresh data.

---

### 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | React 19 (Modern, Concurrent UI) |
| **Styling** | Tailwind CSS 4.0 + Framer Motion |
| **Database/Auth** | Firebase (Google Cloud Services) |
| **Artificial Intelligence** | Google Gemini API (`@google/genai`) |
| **Testing** | Vitest (Lightning Fast Unit Testing) |
| **Bundler** | Vite (Optimized Build Flow & Chunking) |

---

<div align="center">
  <br />
  <strong>Developed by Saee Kumbhar</strong>
</div>
