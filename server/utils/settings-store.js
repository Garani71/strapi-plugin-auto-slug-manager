'use strict';

// Простое хранилище настроек в памяти
// В продакшене можно заменить на файл или БД
let settingsStore = {
  enabled: true,
  sourceField: 'title',
  fallbackField: 'name',
  handleRichText: true,
  addSuffixForUnique: true,
  supportCyrillic: true,
  updateExistingSlugs: true,
  slugifyOptions: {
    lower: true,
    strict: true,
    locale: 'ru'
  },
  contentTypes: {}
};

module.exports = {
  getSettings() {
    return { ...settingsStore };
  },

  updateSettings(newSettings) {
    settingsStore = {
      ...settingsStore,
      ...newSettings
    };
    console.log('💾 [Settings Store] Настройки обновлены:', settingsStore);
    return { ...settingsStore };
  },

  resetSettings() {
    settingsStore = {
      enabled: true,
      sourceField: 'title',
      fallbackField: 'name',
      handleRichText: true,
      addSuffixForUnique: true,
      supportCyrillic: true,
      updateExistingSlugs: true,
      slugifyOptions: {
        lower: true,
        strict: true,
        locale: 'ru'
      },
      contentTypes: {}
    };
    return { ...settingsStore };
  }
}; 