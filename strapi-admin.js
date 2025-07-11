'use strict';

export default {
  register(app) {
    // Регистрация ссылки в главном меню
    app.addMenuLink({
      to: '/plugins/auto-slug-manager',
      icon: () => '🔗',
      intlLabel: {
        id: 'auto-slug-manager.plugin.name',
        defaultMessage: 'Auto Slug Manager',
      },
      permissions: [],
      async Component() {
        const { default: SettingsPage } = await import('./admin-page');
        return SettingsPage;
      },
    });
  },
  
  bootstrap(app) {
    console.log('🚀 [Auto Slug Manager] Admin panel bootstrap');
  },
}; 