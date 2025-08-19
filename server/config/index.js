'use strict';

module.exports = {
  default: {
    // Global settings
    enabled: true,
    sourceField: 'title', // Main field for slug generation
    fallbackField: 'name', // Fallback field if main field is empty
    handleRichText: true, // Process Rich Text (blocks) fields
    addSuffixForUnique: true, // Add suffixes for uniqueness (-1, -2, -3)
    supportCyrillic: true, // Cyrillic support
    slugifyOptions: {
      lower: true,
      strict: true,
      locale: 'ru'
    },
    
    // Settings by content-types (filled automatically)
    contentTypes: {
      // 'api::article.article': { enabled: true },
      // 'api::page.page': { enabled: true },
    }
  },
  validator: (config) => {
    // Configuration validation
    if (typeof config.enabled !== 'boolean') {
      throw new Error('enabled must be a boolean');
    }
    if (typeof config.sourceField !== 'string') {
      throw new Error('sourceField must be a string');
    }
  },
};
