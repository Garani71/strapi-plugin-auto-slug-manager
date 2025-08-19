'use strict';

const settingsStore = require('./utils/settings-store');

module.exports = ({ strapi }) => {
  // Register universal lifecycle hooks at Strapi startup
  const registerSlugLifecycles = () => {
    console.log('🚀 [Auto Slug Manager] Plugin initialization...');
    
    // Get plugin configuration from Strapi
    const pluginConfig = strapi.config.get('plugin.auto-slug-manager') || {};
    console.log('⚙️ [Auto Slug Manager] Plugin configuration:', pluginConfig);
    
    // Initialize settings from plugin configuration
    settingsStore.initializeSettings(pluginConfig);
    
    const slugService = strapi.plugin('auto-slug-manager').service('slug-generator');
    
    // Get all content-types with the slug field
    const contentTypesWithSlug = slugService.getContentTypesWithSlug();
    
    if (contentTypesWithSlug.length === 0) {
      console.log('⚠️ [Auto Slug Manager] No content-types found with slug field');
      return;
    }

    // Register lifecycle hooks for each content-type
    contentTypesWithSlug.forEach(({ uid, displayName }) => {
      console.log(`📝 [Auto Slug Manager] Registering lifecycle for ${displayName} (${uid})`);
      
      // In Strapi v5 use direct registration via strapi.db.lifecycles
      strapi.db.lifecycles.subscribe({
        models: [uid],
        
        // beforeCreate hook
        async beforeCreate(event) {
          const { data } = event.params;
          console.log(`🆕 [Auto Slug Manager] beforeCreate for ${uid}:`, data.title || data.name);
          
          if (!data.slug) {
            const slug = await slugService.generateSlugForEntry(data, uid);
            if (slug) {
              data.slug = slug;
              console.log(`✅ [Auto Slug Manager] Slug created: "${slug}"`);
            }
          }
        },

        // beforeUpdate hook
        async beforeUpdate(event) {
          const { data, where } = event.params;
          console.log(`🔄 [Auto Slug Manager] beforeUpdate for ${uid}:`, data.title || data.name);
          
          // Generate slug only if it does not exist or needs to be updated
          if (data.title || data.name) {
            // Get current entry
            const currentEntity = await strapi.db.query(uid).findOne({ where });
            
            // Try to generate slug (service itself will decide whether to update or not)
            const slug = await slugService.generateSlugForEntry(data, uid, currentEntity?.documentId);
            if (slug) {
              data.slug = slug;
              console.log(`✅ [Auto Slug Manager] Slug updated: "${slug}"`);
            } else if (currentEntity?.slug) {
              console.log(`⚠️ [Auto Slug Manager] Slug already exists, skipping: "${currentEntity.slug}"`);
            }
          }
        }
      });
    });
    
    console.log(`✅ [Auto Slug Manager] Plugin initialized for ${contentTypesWithSlug.length} content-types`);
  };

  // Start registration after full Strapi initialization
  registerSlugLifecycles();
};
