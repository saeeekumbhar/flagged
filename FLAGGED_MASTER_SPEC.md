# FLAGGED Master Specification

# 1. Product Overview
**What FLAGGED is:**
FLAGGED is an eco-habit gamification application designed specifically for college students and young adults. It shifts the narrative of sustainability from "carbon tracking spreadsheets" to a highly engaging, aesthetic, and slightly sassy journey. 

**Target users:**
Students living either on campus ("Hosteliers") or commuting ("Day Scholars") who want to build better daily habits (transport, food, energy) while being motivated by aesthetics, streaks, and a unique persona.

**Core problem solved:**
Most carbon footprint trackers are boring, guilt-tripping, and hard to maintain. FLAGGED makes sustainable choices tactile, immediate, and culturally relevant ("Green Flags" vs "Red Flags") to drive long-term engagement.

**Main user journey:**
Users open the app, log their daily habits through a simple structured check-in, receive immediate gamified feedback (XP, Coins, Era evolution), and unlock insights or "roasts" based on their consistency.

# 2. Current User Flow
**New user:**
Onboarding (Profile setup, persona creation)
↓
Baseline Assessment (Transport, food, and energy preferences)
↓
First check-in
↓
Daily tracking
↓
Score calculation (Base Score + Daily Score)
↓
Insights generation

**Existing user:**
App open
↓
Dashboard (Era status, avatar, streak)
↓
Check-in (Daily structured form)
↓
Progress & Insights (Journey Calendar, Weekly Roast, Flag DNA)

# 3. Screens Inventory

**Splash Screen:**
- **Purpose**: App entry and branding.
- **Actions**: "Start Journey".

**Onboarding:**
- **Purpose**: Collect initial user baseline and set up Profile.
- **Data consumed**: Writes to `UserProfile`.
- **Actions**: Persona selection, base preference inputs.

**HomeTab (Dashboard):**
- **Purpose**: Central hub showing current status.
- **Main components**: Era/Level Card, Avatar Display (Aura & accessories), Streak counter, Forecast & Daily Stats, Action CTA.
- **Data consumed**: Derived `UserProfile` (Flag Score, XP, Level, Streak), `DailyLog` (Today's activities).
- **Actions**: Navigate to Profile, claim streak bonus, start daily check-in.

**JourneyTab:**
- **Purpose**: Historical view of past check-ins.
- **Main components**: Calendar view, daily timeline.
- **Data consumed**: `logs` dictionary.
- **Actions**: Tap specific dates to view or edit `DayDetailsScreen`.

**InsightsTab:**
- **Purpose**: Detailed analytics and playful feedback.
- **Main components**: Flag DNA, Glow Up Stats, Weekly Roast, Forecast.
- **Data consumed**: Generated on-the-fly from `UserProfile` and `logs`.
- **Actions**: Review historical trends.

**CommunityTab:**
- **Purpose**: Social integration (MVP structure).
- **Data consumed**: Mock leaderboards or passive community impact.

**ProfileTab:**
- **Purpose**: Manage identity and settings.
- **Actions**: Change Avatar, view overall XP/Coins.

**DayDetailsScreen:**
- **Purpose**: The main daily check-in form.
- **Main components**: Selectors for Transport, Food, Delivery, Energy, Shopping.
- **Data consumed**: Reads/writes a specific `DailyLog`.
- **Actions**: Save log, triggers XP reward.

**BadgeDetailsScreen:**
- **Purpose**: View earned achievements.

# 4. Data Model

**User Profile:**
```typescript
interface UserProfile {
  name: string;
  userType: 'day_scholar' | 'hostelier' | null;
  commuteMethod: string | null;
  foodPreferences: string | null;
  acPreference: string | null;
  deliveryFrequency: number;
  chargerHabit: boolean | null;
  flagScore: number;
  completedOnboarding: boolean;
  avatarId: string;
  streak: number;
  bestStreak: number;
  xp: number;
  level: number;
  coins: number;
}
```

**Daily Log:**
```typescript
interface DailyLog {
  date: string; // 'YYYY-MM-DD'
  transport?: 'walk' | 'cycle' | 'bus' | 'metro' | 'auto' | 'car' | 'cab' | 'none';
  food?: 'mess' | 'home' | 'veg' | 'mixed' | 'nonveg' | 'none';
  delivery?: 'no' | 'once' | 'multiple';
  energyLaptop?: '<2h' | '2-4h' | '4-8h' | '8+h' | 'none';
  energyAC?: 'none' | '<2h' | '2-6h' | '6+h';
  shopping?: 'no' | 'small' | 'medium' | 'large';
  reflection?: 'rough' | 'mixed' | 'green';
  dailyScore?: number; // 0-100
  totalFlagImpact: number; // Legacy
  totalCarbonEstimate: number;
  notes: string;
  activities: LoggedActivity[]; // Legacy array
}
```

# 5. Source of Truth
- **Daily Logs (`logs` dictionary)**: The ultimate source of truth for historical calculations. 
- **Flag Score**: Derived on the fly dynamically (Historical average of last 30 daily scores + base profile score).
- **Daily Score**: Calculated and cached on the `DailyLog` object (0-100) using `ScoreEngine.ts`.
- **Streaks**: Derived mathematically from consecutive `logs` dates (synced to Profile for display/best streak caching).
- **XP, Coins, Level**: Stored persistently in `UserProfile`. Incremented upon actions.
- **Badges**: Derived from `UserProfile` thresholds.
- **Insights/Reports**: 100% computed on-the-fly via `InsightEngine.ts` scanning `logs`.
- **Legacy Alert**: `totalFlagImpact` and `activities[]` array exist in models but should not be used for new score logic.

# 6. Scoring System
**Daily Sustainability Score (0-100):**
Calculated per day based on structured log fields using fixed weights.
- **Inputs & Weights**:
  - Transport (35%): walk/cycle (100), bus/metro (85), auto (65), car/cab (35)
  - Food (25%): mess/home/veg (100), mixed (75), nonveg (40)
  - Delivery (10%): no (100), once (60), multiple (20)
  - Shopping (10%): no (100), small (80), medium (50), large (20)
  - Energy - Laptop (10%): <2h (100), 2-4h (80), 4-8h (60), 8+h (40)
  - Energy - AC (10%): none (100), <2h (80), 2-6h (50), 6+h (20)

**Flag Score (Era determining score):**
Calculated dynamically by combining:
1. `calculateBaseScore(profile)`: A 0-100 score based strictly on onboarding baseline habits.
2. If logs exist in the last 30 days, the Flag Score is the average `dailyScore` of the last 30 days.

# 7. Carbon Calculation Model
Provides raw CO2 estimates in kg (via `CarbonEngine.ts`).
- **Transport**: walk/cycle (0), metro (1), bus (1.5), auto (3), car/cab (8)
- **Food**: mess/home (1.5), veg (2), mixed (3), nonveg (6)
- **Delivery**: no (0), once (2), multiple (5)
- **Energy Laptop**: <2h (0.1), 2-4h (0.3), 4-8h (0.6), 8+h (1.0)
- **Energy AC**: none (0), <2h (1.5), 2-6h (4), 6+h (8)
- **Shopping**: no (0), small (2), medium (5), large (15)

# 8. Gamification System
- **Levels**: Unlocked every 1000 XP.
- **XP**: Awarded for daily check-ins (15 XP for positive, 5 XP for negative/neutral) and streak milestones.
- **Coins**: Currencies gained alongside XP (e.g., 5 coins per check-in).
- **Badges**: Stored concepts representing milestones.
- **Avatar Progression (Eras)**: 
  - Red Flag Era (Score <= 40)
  - Recovering Flag (Score <= 60)
  - Growing Green Flag (Score <= 75)
  - Green Flag Era (Score <= 90)
  - Green Flag Legend (Score > 90)
- **Challenges**: Forecast-suggested mini-goals based on weak areas.

# 9. Analytics Layer (`InsightEngine.ts`)
**Flag DNA**
- **Input**: All `logs`.
- **Output**: Sub-scores (1-5) for Transport, Food, Energy, Shopping, Community, and a "Primary Trait" (e.g., "Conscious Commuter", "Mess Hall Hero").
- **Status**: Implemented.

**Glow Up**
- **Input**: All `logs` and baseline assumptions.
- **Output**: Total CO2 avoided (kg), equivalent trees planted, estimated money saved (₹), and total "Green Flag" days (>70 score).
- **Status**: Implemented.

**Weekly Roast**
- **Input**: Last 7 days of `logs`.
- **Output**: Sassy, personalized text based on the highest frequency of red flags (e.g., too many cabs, heavy AC) or a "Win" message for good streaks.
- **Status**: Implemented.

**Forecast**
- **Input**: Recent logs and current Streak/Score.
- **Output**: Prediction for the week, opportunity metric, and a specific suggested challenge.
- **Status**: Implemented.

# 10. Deprecated Systems
- **Legacy `activities[]` array**: The old system of comma-separated string IDs like `commute_car` or `food_delivery` is fully deprecated.
- **Green/Red Points (`totalFlagImpact`)**: The old incremental -5 / +10 points system is superseded by the `ScoreEngine` (0-100 Daily Score).
- **Mock Data Injector**: Code currently exists in `App.tsx` to automatically seed 7 days of mock logs if a user has < 2 days. This is a stopgap for aesthetics and should be removed.
- **Migration Script**: `App.tsx` contains an on-mount script to convert old comma-separated `transport` and `food` fields into pure singular selections.

# 11. Future Roadmap
**MVP:**
- Clean up legacy `activities` logic from all components.
- Finalize robust offline-first storage patterns (moving from pure `localStorage` string parsing to a robust local DB/IndexedDB wrapper).

**Post MVP:**
- Cloud synchronization and authenticating users via email/SSO.
- True Community Leaderboards comparing Flag Scores across friends.

**Future integrations:**
- AI-generated personalized roasts (currently rule-based).
- Fitness APIs (Apple Health, Google Fit) to automatically verify walking/cycling instead of self-reporting.
- Google Maps timeline integration to detect transport modes passively.

# 12. Known Issues
- **Mock Data**: A new user immediately sees a 7-day seeded streak to populate the UI. This breaks true onboarding tracking and needs to be toggled off for production.
- **Hardcoded Coin/XP Logic**: The XP thresholds and coin rewards are slightly uncalibrated and lack an economic sink (nowhere to spend coins yet).
- **Redundant State**: Profile `streak` and Derived `streak` occasionally race; `App.tsx` patches this by silently updating `bestStreak`.

# 13. Architecture Diagram
```text
[ User Profile (Baseline) ]
           |
           v
[ Daily Logs (Source of Truth) ] --> (Stored locally in 'flagged_logs')
           |
           +--> [ Carbon Engine ] -----> (CO2 Estimates, Impact metrics)
           |
           +--> [ Score Engine ] ------> (0-100 Daily Score, Era Calculation)
           |
           +--> [ Insight Engine ] ----> (Flag DNA, Glow Up, Weekly Roast)
           |
           v
[ UI Rendering (Dashboards, Journey, Community) ]
```

# 14. Development Rules
1. **Logs are the source of truth**: Do not add arbitrary counters to `UserProfile` for things that can be counted by iterating over `logs`.
2. **Do not create duplicate scoring systems**: Any new metric or points system must route through `ScoreEngine.ts`.
3. **No hardcoded user progress**: Do not assume the user has data. If the logs are empty, the UI must handle the empty state gracefully without crashing.
4. **New features must consume existing data models**: Use the structured enum fields (transport, food, energy, shopping) for any new analytics. Do not add free-text or custom categories without a strict schema update.
