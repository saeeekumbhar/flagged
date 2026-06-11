# FLAGGED Project Audit

This document provides a comprehensive technical analysis of the FLAGGED codebase, covering its architecture, data models, state management, scoring logic, and technical debt.

## 1. Folder Structure
```text
flagged/
├── public/                 # Static assets (bg images, logos)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── screens/        # Full-screen overlay components (DayDetails, BadgeDetails)
│   │   ├── tabs/           # Main tab views (Home, Journey, Insights, Community, Profile)
│   │   └── ui/             # Generic UI elements (tubelight-navbar)
│   ├── lib/                # Utility libraries (e.g. cn for tailwind)
│   ├── utils/              # Calculation helpers (growthEngine)
│   ├── App.tsx             # Main Application Container & Global State
│   ├── main.tsx            # Entry point
│   ├── types.ts            # TypeScript interfaces and types
│   ├── activities.ts       # Legacy Activity Definitions
│   └── avatars.ts          # Avatar Database & Flag Evolution Definitions
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite bundler configuration
├── tsconfig.json           # TypeScript configuration
└── tailwind.config.js      # Tailwind CSS theme and styling configuration
```

## 2. Application Routes & Navigation

The application follows a single-page architecture built with React, Vite, and Tailwind CSS. It uses conditionally rendered components to act as screens rather than a traditional router like React Router.

### Navigation Architecture
Navigation is handled entirely by a global state object `navState` in `App.tsx`. The application renders different UI components based on the current `navState.type`.

### Screen Hierarchy
*   **Splash Screen** (`Splash.tsx`): Shown once on initial load.
*   **Onboarding Flow** (`Onboarding.tsx`): Profile creation wizard (Name, Commute, Food, Delivery, Device, Avatar).
*   **Main Application Container** (`App.tsx`): Wraps all tabs and detail overlays.
    *   **Tabs** (Controlled by `BottomNav` / `TubelightNavbar`):
        *   `HomeTab`: Gamified dashboard, XP/Streak HUD, Action CTAs.
        *   `JourneyTab`: Calendar grid view showing historical logs.
        *   `InsightsTab`: Placeholder for analytics and AI summaries.
        *   `CommunityTab`: Placeholder for social features/leaderboard.
        *   `ProfileTab`: User stats, DNA card, and Badges.
    *   **Detail Overlays** (Full screen modals):
        *   `DayDetailsScreen`: The daily check-in tracker form.
        *   `BadgeDetailsScreen`: Details for a specific achievement badge.

---

## 3. Data Architecture (Database Schema)

The application uses a schema-less local storage database via `localStorage`, persisting data in JSON strings.

### Collections / Tables
1.  **`flagged_profile`** (User Profile Data)
    *   **Schema**: `name`, `commuteMethod`, `foodPreferences`, `acPreference`, `deliveryFrequency`, `chargerHabit`, `flagScore`, `completedOnboarding`, `avatarId`, `streak`, `bestStreak`, `xp`, `level`, `coins`.
2.  **`flagged_logs`** (Historical Log Data)
    *   **Schema**: Dictionary keyed by ISO date string (`YYYY-MM-DD`). Contains `DailyLog` objects.

### Data Relationships
There are no relational keys. `flagged_logs` entries stand alone, and `flagged_profile` acts as a flattened aggregate record of the user's current status.

---

## 4. State Management

State management is entirely localized to React Component State, with `App.tsx` acting as the global state container. There are **no Context Providers or external stores** (like Redux or Zustand).

*   **Global State** (Held in `App.tsx`):
    *   `profile`: Current user metrics.
    *   `logs`: Dictionary of all historical entries.
    *   `navState`: Current screen route.
    *   `toast` / `isShaking` / `showConfetti`: Global UI triggers.
*   **Local State**:
    *   Forms and UI transitions handle their own local state (e.g., `transport`, `food` selections inside `DayDetailsScreen.tsx`).

---

## 5. Flag Score System

The Flag Score is a 0-100 metric determining the user's "Era" (Red Flag <= 40, Glow Up <= 70, Green Flag > 70). 

### How It Is Calculated
1.  **Onboarding Base Score**: The initial score is determined during onboarding (starting at 50) and heavily modified by the choices the user makes (e.g., walk = +20, car = -15).
2.  **Daily Delta**: When a user completes a daily check-in, the specific choices calculate a `totalFlagImpact` integer. This impact is then compared to the `previousLogImpact` for that day, and the **delta** is applied to the global `profile.flagScore`.
3.  **Comeback Multiplier**: If the user is in the "Red Flag Era" (<= 40) and logs positive actions, their points are multiplied by 1.5x.
4.  **Score Decay**: On app mount, if the user has missed more than 3 days, the score artificially decays towards 50 by 1 point per missed day.

### Files Containing Logic
*   `DayDetailsScreen.tsx` (Calculates the raw impact for the day based on selections).
*   `App.tsx` (Applies the delta to the global score, calculates multipliers, and handles decay).
*   `Onboarding.tsx` (Calculates base score).

---

## 6. Daily Check-In System

### Data Model & Storage Format
Stored as a `DailyLog` object in the `flagged_logs` dictionary. Key is `YYYY-MM-DD`.
```typescript
interface DailyLog {
  date: string;
  activities: LoggedActivity[]; // Legacy
  transport?: string; // Comma-separated strings (e.g. "walk,metro")
  food?: string;
  delivery?: string;
  energyLaptop?: string;
  energyAC?: string;
  shopping?: string;
  reflection?: 'rough' | 'mixed' | 'green';
  totalFlagImpact: number;
  totalCarbonEstimate: number;
  notes: string;
}
```

### Calculation Flow
The form in `DayDetailsScreen.tsx` parses the comma-separated strings. For example, if `transport` is `"walk,metro"`, it splits the string, adds `+10` for walk and `+5` for metro, resulting in a total `flagImpact` for transport. All categories are summed into `totalFlagImpact` and `totalCarbonEstimate` and passed to `App.tsx` on save.

### User Flow: Logging a Day
1.  **UI Action**: User taps "Day Logged" on HomeTab.
2.  **State Update**: `App.tsx` changes `navState` to `{ type: 'day_details', date: today }`.
3.  **UI Action**: User selects chips on `DayDetailsScreen` and taps "Complete Check-In".
4.  **Recalculation**: `DayDetailsScreen` calculates raw `totalFlagImpact`.
5.  **State Update**: `App.tsx`'s `handleLogSave` triggers. It calculates the delta against any previous log for that day.
6.  **Profile Update**: Applies delta to `flagScore`. Awards XP (Base +15 for positive). Checks level-up math (1000 XP/level). Increments `streak` if the date is new.
7.  **Database Write**: Updates both `flagged_logs` and `flagged_profile` in `localStorage`.
8.  **UI Trigger**: Fires `setShowConfetti(true)`.
9.  **Navigation**: Updates `navState` to return to `home` tab.

---

## 7. Feature Inventory

### Fully Implemented
*   Onboarding Wizard & Avatar Selection
*   XP, Leveling, and Coin economy (Backend logic)
*   Score Decay and Streak Tracking
*   Interactive UI Gamification (Confetti, Haptic Screen Shakes)
*   Daily Check-In Multi-select Tracker
*   Tubelight Navigation Bar
*   Non-scrollable responsive Home Dashboard

### Partially Implemented
*   **Journey Calendar**: Renders correctly, but only uses basic logic to color blocks green/red based on total impact.
*   **Flag DNA / Glow Up Stats**: Stats are calculated dynamically from logs, but only display basic totals.
*   **Badges System**: UI exists, but badges are hardcoded arrays and do not unlock dynamically based on criteria.

### Stubbed / Placeholder
*   **Insights Tab**: Completely static placeholder UI.
*   **Community Tab**: Completely static placeholder UI.
*   **Store / Economy Spending**: Coins are awarded but cannot be spent anywhere.

---

## 8. Technical Debt

1.  **Duplicate Systems**: `DailyLog` has both the old `activities` array and the new discrete tracking fields (`transport`, `food`, etc.). `App.tsx` currently has to merge legacy `quick_green` logs with the new structured data.
2.  **Legacy Logic**: `src/activities.ts` exists but is largely bypassed by the hardcoded point values inside `DayDetailsScreen.tsx`'s `handleSave` function.
3.  **Source of Truth Fragility**: `flagScore` is updated via a "delta" calculation upon saving a log. If the logs and profile ever become desynchronized, there is no reconciliation function to recalculate the `flagScore` from scratch based on the raw log history.
4.  **Hardcoded Data**: The Avatar choices (`avatars.ts`), Badge choices (`ProfileTab.tsx`), and initial mock data seeding (`App.tsx`) are entirely hardcoded.

---

## 9. Known Issues

1.  **Orphaned Types**: The `userType` (Day Scholar vs Hostel) is still present in the `UserProfile` interface and hardcoded to `'day_scholar'` in `App.tsx`'s onboarding completion handler, despite the feature being fully removed from the UI.
2.  **Delta Desynchronization**: Editing or overwriting past logs does not dynamically re-evaluate the entire historical timeline of the `flagScore`. Because the system relies solely on updating the score via positive/negative deltas at the time of saving, edge-case edits could result in math discrepancies over time.
3.  **Responsive Layout Constraints**: While the `HomeTab` successfully eliminates scrolling using `justify-between` and `h-full`, running the app on extremely short viewports (like small older generation smartphones) may cause UI clipping because minimum element heights have not been rigorously enforced.

---

## 10. Source of Truth & Architecture Diagram

*   **Flag Score**: **`profile.flagScore`** (Primary).
*   **Streaks**: **`profile.streak`** (Primary). 
*   **Reports/Stats (Flag DNA)**: **Calculated on-the-fly**. 

```text
User 
 │
 ├─► Onboarding (Generates Base Profile)
 │
 ├─► App Container (Holds Global State & localStore connection)
 │    │
 │    ├─► HomeTab (Reads Profile, Streak, XP)
 │    │    └─► Quick Log Action (Pushes to Logs, Deltas Profile)
 │    │
 │    ├─► DayDetailsScreen (Tracker Overlay)
 │    │    └─► handleSave (Calculates Raw Impact)
 │    │         └─► App.handleLogSave
 │    │              ├─► Write to LocalStorage (Logs)
 │    │              ├─► Calculate Delta (Comeback Multiplier applied)
 │    │              ├─► Write to LocalStorage (Profile: Score, XP, Level, Streak)
 │    │              └─► Trigger Global Animations
 │    │
 │    ├─► ProfileTab
 │    │    ├─► Reads Profile State
 │    │    ├─► Reads Logs (Iterates all for Flag DNA / Stats)
 │    │    └─► Hardcoded Badges
 │    │
 │    ├─► JourneyTab (Iterates Logs for Calendar UI)
 │    │
 │    ├─► InsightsTab (Stubbed)
 │    │
 │    └─► CommunityTab (Stubbed)
```
