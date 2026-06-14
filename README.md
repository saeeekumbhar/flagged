<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/af54c11a-a537-4ee9-9a3c-1d9fa509439d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Performance & Efficiency

The application is highly optimized for memory and time complexity:
- **React Rendering**: Contexts (`AuthContext`, `LogsContext`, etc.) and expensive calculations (Flag Score, Carbon Calculations) use `useMemo()` and `useCallback()` to prevent cascading re-renders.
- **Code Splitting**: Heavy views (`SettingsScreen`, `DayDetailsScreen`) and particle systems (`Confetti`) are lazy-loaded via `React.lazy()` to reduce initial bundle size.
- **Vite Chunking**: Vendor libraries (`react`, `firebase`, `motion`) are isolated into manual chunks for aggressive browser caching.
- **AI Caching**: Gemini AI insights are cached in `localStorage` for 24 hours. The app does NOT hit the AI endpoint every time you switch tabs, saving API costs and ensuring instant load times.
