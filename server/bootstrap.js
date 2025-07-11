'use strict';

module.exports = ({ strapi }) => {
  // Регистрируем universal lifecycle хуки при старте Strapi
  const registerSlugLifecycles = () => {
    console.log('🚀 [Auto Slug Manager] Инициализация плагина...');
    
    const slugService = strapi.plugin('auto-slug-manager').service('slug-generator');
    
    // Получаем все content-types с полем slug
    const contentTypesWithSlug = slugService.getContentTypesWithSlug();
    
    if (contentTypesWithSlug.length === 0) {
      console.log('⚠️ [Auto Slug Manager] Не найдено content-types с полем slug');
      return;
    }

    // Регистрируем lifecycle хуки для каждого content-type
    contentTypesWithSlug.forEach(({ uid, displayName }) => {
      console.log(`📝 [Auto Slug Manager] Регистрируем lifecycle для ${displayName} (${uid})`);
      
      // В Strapi v5 используем прямую регистрацию через strapi.db.lifecycles
      strapi.db.lifecycles.subscribe({
        models: [uid],
        
        // beforeCreate хук
        async beforeCreate(event) {
          const { data } = event.params;
          console.log(`🆕 [Auto Slug Manager] beforeCreate для ${uid}:`, data.title || data.name);
          
          if (!data.slug) {
            const slug = await slugService.generateSlugForEntry(data, uid);
            if (slug) {
              data.slug = slug;
              console.log(`✅ [Auto Slug Manager] Слаг создан: "${slug}"`);
            }
          }
        },

        // beforeUpdate хук
        async beforeUpdate(event) {
          const { data, where } = event.params;
          console.log(`🔄 [Auto Slug Manager] beforeUpdate для ${uid}:`, data.title || data.name);
          
          // Генерируем слаг только если его нет или если нужно обновить
          if (data.title || data.name) {
            // Получаем текущую запись
            const currentEntity = await strapi.db.query(uid).findOne({ where });
            
            // Пробуем сгенерировать слаг (сервис сам решит, обновлять или нет)
            const slug = await slugService.generateSlugForEntry(data, uid, currentEntity?.documentId);
            if (slug) {
              data.slug = slug;
              console.log(`✅ [Auto Slug Manager] Слаг обновлен: "${slug}"`);
            } else if (currentEntity?.slug) {
              console.log(`⚠️ [Auto Slug Manager] Слаг уже существует, пропускаем: "${currentEntity.slug}"`);
            }
          }
        }
      });
    });
    
    console.log(`✅ [Auto Slug Manager] Плагин инициализирован для ${contentTypesWithSlug.length} content-types`);
  };

  // Запускаем регистрацию после полной инициализации Strapi
  registerSlugLifecycles();
}; 