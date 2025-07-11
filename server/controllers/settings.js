'use strict';

const settingsStore = require('../utils/settings-store');

module.exports = ({ strapi }) => ({
  async getSettings(ctx) {
    try {
      const settings = settingsStore.getSettings();
      ctx.body = { data: settings };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async updateSettings(ctx) {
    try {
      const { body } = ctx.request;
      
      // Валидируем настройки
      if (typeof body.enabled !== 'boolean') {
        return ctx.throw(400, 'enabled должно быть boolean');
      }
      
      if (body.sourceField && typeof body.sourceField !== 'string') {
        return ctx.throw(400, 'sourceField должно быть строкой');
      }
      
      if (body.fallbackField && typeof body.fallbackField !== 'string') {
        return ctx.throw(400, 'fallbackField должно быть строкой');
      }
      
      // Обновляем настройки через хранилище
      const updatedSettings = settingsStore.updateSettings(body);
      
      console.log('🔧 [Auto Slug Manager] Настройки обновлены через API');
      
      ctx.body = { 
        data: updatedSettings,
        message: 'Настройки обновлены успешно'
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  },

  async getStatus(ctx) {
    try {
      const slugService = strapi.plugin('auto-slug-manager').service('slug-generator');
      const contentTypes = slugService.getContentTypesWithSlug();
      const currentSettings = settingsStore.getSettings();
      
      ctx.body = {
        data: {
          pluginActive: true,
          contentTypesCount: contentTypes.length,
          contentTypes: contentTypes,
          currentSettings: currentSettings,
          lastUpdate: new Date().toISOString()
        }
      };
    } catch (error) {
      ctx.throw(500, error);
    }
  }
}); 