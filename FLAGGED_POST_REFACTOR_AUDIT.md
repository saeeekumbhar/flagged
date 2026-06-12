# FLAGGED Post-Refactor Audit

## 1. PROJECT ARCHITECTURE

- **Framework**: React (TypeScript) via Vite
- **Libraries**: `motion` (framer-motion) for animations, standard React hooks.
- **Folder Structure**:
  - `src/components/`: Core UI blocks (Tabs, Screens, Micro-components).
  - `src/utils/`: Engines (ScoreEngine, CarbonEngine, InsightEngine).
  - `src/types.ts`: Central interfaces.
  - `src/avatars.ts`: Persona definitions.
- **Major Modules**:
  - **ScoreEngine**: Handles daily sustainability scoring and weighted Flag Score calculations.
  - **InsightEngine**: Generates text-based analytics (Roasts, Forecasts, DNA).
  - **CarbonEngine**: Calculates hard carbon output estimates.

**Data Flow Confirmation**:
The data flow is currently implemented exactly as specified:
User → Daily Check-In (`DayDetailsScreen`) → Daily Log (saved to state) → `ScoreEngine.calculateDailyScore` → `ScoreEngine.calculateFlagScore` (weighted average) → Dashboard/Profile UI.

---

## 2. SOURCE OF TRUTH AUDIT

- **Daily logs**
  - **State**: Real
  - **File location**: `src/App.tsx`
  - **Function**: `logs` state object.
  - **Data source**: `localStorage.getItem('flagged_logs')`

- **Daily Sustainability Score**
  - **State**: Real
  - **File location**: `src/utils/ScoreEngine.ts`
  - **Function**: `calculateDailyScore(log)`
  - **Data source**: Derived dynamically from the log fields (transport, food, etc.). Stored statically in `DailyLog.dailyScore`.

- **Flag Score**
  - **State**: Real (Derived)
  - **File location**: `src/utils/ScoreEngine.ts` & `src/App.tsx`
  - **Function**: `calculateFlagScore(logs)`
  - **Data source**: Aggregated entirely from the user's `logs`. Recalculated dynamically on every render inside `App.tsx` `useMemo`.

- **XP, Coins, Levels**
  - **State**: Real
  - **File location**: `src/App.tsx`
  - **Function**: `handleAwardXP`
  - **Data source**: Saved directly inside `profile` in `localStorage`.

- **Streaks**
  - **State**: Real (Derived)
  - **File location**: `src/utils/ScoreEngine.ts`
  - **Function**: `calculateTrend(logs)`
  - **Data source**: Dynamically derived by calculating consecutive days in the `logs` dictionary.

- **Badges**
  - **State**: Real (Logic-based)
  - **File location**: `src/components/tabs/ProfileTab.tsx` / `BadgeDetailsScreen.tsx`
  - **Function**: Component-level mapping.
  - **Data source**: Checked against `profile.xp` and `logs` arrays.

- **Insights**
  - **State**: Real (Derived)
  - **File location**: `src/utils/InsightEngine.ts`
  - **Function**: `generateFlagForecast`, `calculateFlagDNA`, etc.
  - **Data source**: Analyzed strictly from the values stored in `logs`.

*(No duplicate sources of truth found. Manual score trackers have been eradicated.)*

---

## 3. SCORING SYSTEM AUDIT

**Daily Sustainability Score**:
Calculated by mapping enum values (e.g., `transport === 'walk'`, `delivery === 'multiple'`) to individual scores out of 100. These are then combined using a weighted formula: Transport (35%), Food (25%), Delivery (10%), Shopping (10%), Energy-Laptop (10%), Energy-AC (10%).

**Flag Score**:
A 0-100 derived metric using a weighted moving average of the user's Daily Sustainability Scores:
- Last 7 days: 50%
- Last 30 days: 40%
- Baseline (older than 30 days): 10%
*(Weights automatically redistribute proportionally if data for a specific time period is missing. Empty users default to 50.)*

**Manual Score Updates Search**:
Searches for `flagScore +=`, `flagScore -=`, `updateScore`, `incrementScore`, `decrementScore`, `delta` yielded **0 active results**. 
All manual profile point manipulations have been successfully removed.

---

## 4. DAILY LOG MODEL AUDIT

**Schema (from `src/types.ts`)**:
```typescript
export interface DailyLog {
  date: string;
  transport?: 'walk' | 'cycle' | 'bus' | 'metro' | 'auto' | 'car' | 'cab' | 'none';
  food?: 'mess' | 'home' | 'veg' | 'nonveg' | 'mixed' | 'eat_out' | 'none';
  delivery?: 'no' | 'once' | 'multiple';
  energyLaptop?: '<2h' | '2-4h' | '4-8h' | '8+h' | 'none';
  energyAC?: 'none' | '<2h' | '2-6h' | '6+h';
  shopping?: 'no' | 'small' | 'medium' | 'large';
  reflection?: 'rough' | 'mixed' | 'green';
  dailyScore?: number;
  totalCarbonEstimate: number;
  notes: string;
  
  // Deprecated
  activities?: LoggedActivity[];
  totalFlagImpact?: number;
}
```
All required fields are present.

---

## 5. LEGACY SYSTEM CHECK

- `activities`: **DEPRECATED** (Only exists as optional field in `types.ts`).
- `LoggedActivity`: **DEPRECATED** (Only exists as interface in `types.ts`).
- `greenCount`: **UNUSED** (Deleted).
- `redCount`: **UNUSED** (Deleted).
- `greenPoints` / `redPoints`: **UNUSED** (Deleted).
- `quick_green` / `quick_red`: **UNUSED** (Deleted).
- `totalFlagImpact`: **DEPRECATED** (Only exists as optional field in `types.ts`).

---

## 6. RECENT ACTIVITY CHECK

The `JourneyTab.tsx` Recent Activity feed uses `Object.values(logs)` sorted by date. 
- It relies entirely on the new `dailyScore` to determine UI colors (`>= 70` is green, `< 40` is red, else yellow).
- It does not read `activities[]`.
- It does not use `greenCount` or `redCount`.
- It does not use `totalFlagImpact`.

---

## 7. MOCK DATA CHECK

**Results**:
- **Fake users**: Removed.
- **Seeded progress / Demo logs**: Removed. The 7-day auto-seeding block in `App.tsx` has been deleted.
- **Fake streaks / Fake XP**: Removed. `handleOnboardingComplete` now initializes new profiles with `0` streak, `0` XP, and `0` coins.
- **Placeholder insights**: Replaced by empty states (e.g., "No journey started yet — Complete your first check-in").

*(The only reference to "mock" left is a migration failsafe inside `App.tsx` that strips old `notes === 'Mock entry'` values for users upgrading from older versions).*

---

## 8. GAMIFICATION AUDIT

- **Avatar system**: **Real**. Driven by the Flag Score and defined in `avatars.ts`.
- **XP system**: **Real**. Added dynamically in `handleAwardXP` based on log completion.
- **Levels**: **Real**. Upgrades linearly as XP crosses 1000 thresholds.
- **Coins**: **Real**. Awarded alongside XP.
- **Badges**: **Real/Hardcoded**. Logic checks for badge attainment exist, but badge definitions are statically typed arrays.
- **Challenges**: **Real (Local)**. Handled via `localStorage` state directly in `CommunityTab.tsx` (`flagged_challenges_...`).
- **Streaks**: **Real**. Calculated purely by `calculateTrend(logs)`.

---

## 9. ANALYTICS LAYER AUDIT

- **Flag DNA**: Current Status: **Active**. Data source: `logs`. Uses **NEW** model (checks `food`, `transport`, etc.).
- **Weekly Roast**: Current Status: **Active**. Data source: `logs`. Uses **NEW** model.
- **Glow Up Counter**: Current Status: **Active**. Data source: `logs` and `profile`. Uses **NEW** model.
- **Flag Forecast**: Current Status: **Active**. Data source: `logs`. Uses **NEW** model.
- **Reports**: Current Status: **N/A** (No dedicated reports engine exists outside of InsightsTab visualizations).

---

## 10. PRODUCTION READINESS CHECK

- **Authentication**: ❌ Not Ready. Entirely local.
- **Database**: ❌ Not Ready. Reliant on `localStorage`.
- **API**: ❌ Not Ready. No endpoints configured.
- **AI integration**: ❌ Not Ready. Roasts/Insights use hardcoded if/else trees, not LLMs.
- **Security concerns**: High. `localStorage` can be manually edited by users in DevTools to spoof scores.
- **Performance issues**: Moderate. Calculating the Flag Score dynamically via `useMemo` over hundreds of logs per render will eventually cause UI stutter without pagination or chunking.

---

## 11. CLEANUP RECOMMENDATIONS

**SAFE TO DELETE**:
- `src/activities.ts` (Completely orphaned file).

**NEEDS REFACTOR**:
- `App.tsx`: The massive `useEffect` block handling `localStorage` parsing should be moved into a dedicated `StorageService.ts`.

**DO NOT TOUCH YET**:
- Gamification mechanics (`handleAwardXP`). Wait until an actual Backend/Database is integrated so XP transactions can be validated securely.

---

## 12. FINAL VERDICT

Is FLAGGED ready for:
**A) Authentication**: **YES**. The decoupled data models make it easy to swap `localStorage` hooks with a JWT/Auth provider.
**B) AI integration**: **YES**. `InsightEngine.ts` is perfectly structured to be replaced by an LLM prompt pipeline feeding on the `logs` JSON.
**C) UI redesign**: **YES**. The UI components are completely detached from state mutations now.
**D) Deployment**: **NO**. Without a database, user progress will be permanently lost if they clear their browser cache or switch devices.
