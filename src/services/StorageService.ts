const SETTINGS_KEY = 'flagged_settings';

export const StorageService = {
  getSettings: () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Could not load settings", e);
    }
    return null;
  },

  saveSettings: (settings: any) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn("Could not save settings", e);
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(SETTINGS_KEY);
    } catch (e) {
      console.warn("Could not clear settings", e);
    }
  }
};
