# FLAGGED Source Code Architecture

This directory contains the entire React 19 frontend and business logic for the FLAGGED application. It is strictly organized to separate concerns, making it highly testable, maintainable, and aligned with industry standards.

## Directory Structure

*   **`/components`**: Pure React UI components. These handle rendering logic, animations (`framer-motion`), and user interactions. They are completely decoupled from heavy calculations.
*   **`/services`**: External communication and core logic. Handles Firebase interactions (`FirebaseService.ts`), AI prompting (`GeminiService.ts`), and system APIs (`SoundService.ts`).
*   **`/utils`**: Pure, side-effect-free math and logic engines (`ScoreEngine.ts`, `CarbonEngine.ts`, `InsightEngine.ts`). These are 100% unit-tested via Vitest.
*   **`/hooks`**: Custom React hooks (`useAuth`, `useProfile`, `useLogs`) that manage state and bridge the gap between `/components` and `/services`.
*   **`/contexts`**: React Context providers for global state management without prop-drilling.
*   **`/constants`**: Shared immutable data structures (e.g., evolution milestones in `avatars.ts`, XP multipliers in `constants/index.ts`).
*   **`types.ts`**: Strict TypeScript interfaces defining the data models used across the entire application.
