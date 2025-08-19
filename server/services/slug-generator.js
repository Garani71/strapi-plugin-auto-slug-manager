'use strict';

const slugify = require('slugify');
const settingsStore = require('../utils/settings-store');

module.exports = ({ strapi }) => ({
  /**
   * Extracts text from Rich Text blocks (type "blocks")
   * @param {Array} blocks - array of Rich Text blocks
   * @returns {string} - extracted text
   */
  extractTextFromBlocks(blocks) {
    console.log('📝 [Auto Slug] Extracting text from blocks:', JSON.stringify(blocks, null, 2));
    
    if (!blocks || !Array.isArray(blocks)) {
      console.log('❌ [Auto Slug] Blocks are empty or not an array');
      return '';
    }

    let text = '';
    
    for (const block of blocks) {
      if (block.type === 'paragraph' && block.children) {
        for (const child of block.children) {
          if (child.type === 'text' && child.text) {
            text += child.text + ' ';
          }
        }
      }
    }
    
    const result = text.trim();
    console.log('✅ [Auto Slug] Extracted text:', result);
    return result;
  },

  /**
   * Extracts text from classic Rich Text (HTML string)
   * @param {string} htmlContent - HTML content
   * @returns {string} - extracted text
   */
  extractTextFromHtml(htmlContent) {
    console.log('📝 [Auto Slug] Extracting text from HTML:', htmlContent);
    
    if (!htmlContent || typeof htmlContent !== 'string') {
      console.log('❌ [Auto Slug] HTML content is empty or not a string');
      return '';
    }

    // Remove HTML tags and extract plain text
    let text = htmlContent
      .replace(/<[^>]*>/g, ' ')  // Remove all HTML tags
      .replace(/&nbsp;/g, ' ')   // Replace non-breaking spaces
      .replace(/&amp;/g, '&')    // Decode ampersands
      .replace(/&lt;/g, '<')     // Decode < 
      .replace(/&gt;/g, '>')     // Decode >
      .replace(/&quot;/g, '"')   // Decode quotes
      .replace(/&#39;/g, "'")    // Decode apostrophes
      .replace(/\s+/g, ' ')      // Collapse multiple spaces
      .trim();                   // Remove leading/trailing spaces

    const result = text.trim();
    console.log('✅ [Auto Slug] Extracted text from HTML:', result);
    return result;
  },

  /**
   * Extracts text from a field (regular or Rich Text)
   * @param {any} fieldValue - field value
   * @param {boolean} handleRichText - whether to process Rich Text
   * @returns {string} - text for slug generation
   */
  extractTextFromField(fieldValue, handleRichText = true) {
    if (!fieldValue) return '';

    // If it's Rich Text blocks (array) - new editor
    if (handleRichText && Array.isArray(fieldValue)) {
      console.log('🔍 [Auto Slug] Detected Rich Text Blocks (array)');
      return this.extractTextFromBlocks(fieldValue);
    }

    // If it's a regular string
    if (typeof fieldValue === 'string') {
      // Check if the string contains HTML tags (classic Rich Text)
      if (handleRichText && fieldValue.includes('<') && fieldValue.includes('>')) {
        console.log('🔍 [Auto Slug] Detected classic Rich Text (HTML)');
        return this.extractTextFromHtml(fieldValue);
      }
      
      // Regular string
      console.log('🔍 [Auto Slug] Detected regular string');
      return fieldValue;
    }

    console.log('⚠️ [Auto Slug] Unknown field type:', typeof fieldValue, fieldValue);
    return '';
  },

  /**
   * Generates a unique slug
   * @param {string} text - source text
   * @param {string} contentType - content type
   * @param {string} documentId - document ID (to exclude from check)
   * @param {object} options - slugify options
   * @returns {Promise<string>} - unique slug
   */
  async generateUniqueSlug(text, contentType, documentId = null, options = {}) {
    if (!text) {
      console.log('⚠️ [Auto Slug] Empty text for slug generation');
      return '';
    }

    // Get settings from store
    const config = settingsStore.getSettings();
    
    // Generate base slug with config options
    const baseSlug = slugify(text, {
      ...config.slugifyOptions,
      ...options
    });

    console.log('🔄 [Auto Slug] Base slug:', baseSlug);

    // Check uniqueness
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      // Find existing entries with this slug
      const existing = await strapi.db.query(contentType).findOne({
        where: { 
          slug: slug,
          ...(documentId && { documentId: { $ne: documentId } })
        }
      });

      if (!existing) {
        console.log('✅ [Auto Slug] Unique slug found:', slug);
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
      console.log('🔄 [Auto Slug] Slug attempt:', slug);
    }

    return slug;
  },

  /**
   * Generates a slug for an entry
   * @param {object} data - entry data
   * @param {string} contentType - content type
   * @param {string} documentId - document ID
   * @returns {Promise<string|null>} - generated slug or null
   */
  async generateSlugForEntry(data, contentType, documentId = null) {
    console.log(`🔍 [Auto Slug] generateSlugForEntry called for ${contentType}`);
    console.log(`📋 [Auto Slug] Data:`, JSON.stringify(data, null, 2));
    
    // Get current settings from store
    const config = settingsStore.getSettings();
    console.log(`⚙️ [Auto Slug] Configuration:`, config);
    
    // Check if plugin is enabled globally
    if (!config.enabled) {
      console.log(`❌ [Auto Slug] Plugin is disabled globally`);
      return null;
    }

    // Check if enabled for this content-type
    const contentTypeConfig = config.contentTypes[contentType];
    if (contentTypeConfig && contentTypeConfig.enabled === false) {
      console.log(`⚠️ [Auto Slug] Generation disabled for ${contentType}`);
      return null;
    }

    // If slug already exists, check update settings
    if (data.slug && !config.updateExistingSlugs) {
      console.log(`⚠️ [Auto Slug] Slug already exists, skipping: "${data.slug}"`);
      return null;
    }
    
    if (data.slug && config.updateExistingSlugs) {
      console.log(`🔄 [Auto Slug] Slug exists, but updating according to settings: "${data.slug}"`);
    }

    console.log(`🔍 [Auto Slug] Looking for text in field "${config.sourceField}":`, data[config.sourceField]);

    // Get text from main field
    let sourceText = this.extractTextFromField(
      data[config.sourceField], 
      config.handleRichText
    );

    console.log(`📝 [Auto Slug] Extracted text from main field:`, sourceText);

    // If main field is empty, try fallback
    if (!sourceText && config.fallbackField) {
      console.log(`🔍 [Auto Slug] Trying fallback field "${config.fallbackField}":`, data[config.fallbackField]);
      sourceText = this.extractTextFromField(
        data[config.fallbackField], 
        config.handleRichText
      );
      console.log(`📝 [Auto Slug] Extracted text from fallback field:`, sourceText);
    }

    if (!sourceText) {
      console.log(`⚠️ [Auto Slug] No text found for slug generation in ${contentType}`);
      console.log(`🔍 [Auto Slug] Fields checked: ${config.sourceField}, ${config.fallbackField}`);
      return null;
    }

    console.log(`🚀 [Auto Slug] Generating slug for ${contentType} from text:`, sourceText);

    // Generate unique slug
    const slug = await this.generateUniqueSlug(
      sourceText,
      contentType,
      documentId,
      config.slugifyOptions
    );

    console.log(`✅ [Auto Slug] Final slug:`, slug);
    return slug;
  },

  /**
   * Processes all content-types and finds those with a slug field
   * @returns {Array} - list of content-types with slug field
   */
  getContentTypesWithSlug() {
    const contentTypes = strapi.contentTypes;
    const typesWithSlug = [];

    for (const [uid, contentType] of Object.entries(contentTypes)) {
      // Skip system types
      if (!uid.startsWith('api::')) continue;

      // Check if there is a slug field
      if (contentType.attributes && contentType.attributes.slug) {
        typesWithSlug.push({
          uid,
          displayName: contentType.info?.displayName || uid,
          hasSlugField: true,
          hasTitleField: !!contentType.attributes.title,
          hasNameField: !!contentType.attributes.name,
        });
      }
    }

    console.log('📋 [Auto Slug] Found content-types with slug field:', typesWithSlug);
    return typesWithSlug;
  }
});
