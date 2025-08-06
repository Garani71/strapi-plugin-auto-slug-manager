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
    locale: 'ru' // По умолчанию русская локаль
  },
  contentTypes: {}
};

module.exports = {
  /**
   * Инициализирует настройки из конфигурации плагина
   * @param {object} pluginConfig - конфигурация из config/plugins.ts
   */
  initializeSettings(pluginConfig = {}) {
    settingsStore = {
      ...settingsStore,
      ...pluginConfig,
      // Правильно объединяем slugifyOptions
      slugifyOptions: {
        ...settingsStore.slugifyOptions,
        ...(pluginConfig.slugifyOptions || {})
      }
    };
    console.log('🔧 [Settings Store] Настройки инициализированы из конфигурации плагина:', settingsStore);
    return { ...settingsStore };
  },

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