export const loadPreferencesFromLocalStorage = (): ?PreferencesValues => {
  try {
    const persistedState = localStorage.getItem(localStorageItem);
    if (!persistedState) return null;

    const values = JSON.parse(persistedState);

    // "Migrate" non existing properties to their default values
    // (useful when upgrading the preferences to a new version where
    // a new preference was added).
    for (const key in initialPreferences.values) {
      if (
        initialPreferences.values.hasOwnProperty(key) &&
        typeof values[key] === 'undefined'
      ) {
        values[key] = initialPreferences.values[key];
      }
    }

    // Migrate renamed themes.
    if (values.themeName === 'GDevelop default') {
      values.themeName = 'GDevelop default Light';
    } else if (values.themeName === 'Dark') {
      values.themeName = 'Blue Dark';
    }

    return values;
  } catch (e) {
    return null;
  }
};
