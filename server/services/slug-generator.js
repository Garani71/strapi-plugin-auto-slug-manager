'use strict';

const slugify = require('slugify');
const settingsStore = require('../utils/settings-store');

module.exports = ({ strapi }) => ({
  /**
   * Извлекает текст из Rich Text блоков (тип "blocks")
   * @param {Array} blocks - массив блоков Rich Text
   * @returns {string} - извлеченный текст
   */
  extractTextFromBlocks(blocks) {
    console.log('📝 [Auto Slug] Извлекаем текст из блоков:', JSON.stringify(blocks, null, 2));
    
    if (!blocks || !Array.isArray(blocks)) {
      console.log('❌ [Auto Slug] Блоки пустые или не массив');
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
    console.log('✅ [Auto Slug] Извлеченный текст:', result);
    return result;
  },

  /**
   * Извлекает текст из классического Rich Text (HTML строка)
   * @param {string} htmlContent - HTML содержимое
   * @returns {string} - извлеченный текст
   */
  extractTextFromHtml(htmlContent) {
    console.log('📝 [Auto Slug] Извлекаем текст из HTML:', htmlContent);
    
    if (!htmlContent || typeof htmlContent !== 'string') {
      console.log('❌ [Auto Slug] HTML контент пустой или не строка');
      return '';
    }

    // Удаляем HTML теги и извлекаем чистый текст
    let text = htmlContent
      .replace(/<[^>]*>/g, ' ')  // Удаляем все HTML теги
      .replace(/&nbsp;/g, ' ')   // Заменяем неразрывные пробелы
      .replace(/&amp;/g, '&')    // Декодируем амперсанды
      .replace(/&lt;/g, '<')     // Декодируем < 
      .replace(/&gt;/g, '>')     // Декодируем >
      .replace(/&quot;/g, '"')   // Декодируем кавычки
      .replace(/&#39;/g, "'")    // Декодируем апострофы
      .replace(/\s+/g, ' ')      // Схлопываем множественные пробелы
      .trim();                   // Убираем пробелы по краям

    const result = text.trim();
    console.log('✅ [Auto Slug] Извлеченный текст из HTML:', result);
    return result;
  },

  /**
   * Извлекает текст из поля (обычного или Rich Text)
   * @param {any} fieldValue - значение поля
   * @param {boolean} handleRichText - обрабатывать ли Rich Text
   * @returns {string} - текст для генерации слага
   */
  extractTextFromField(fieldValue, handleRichText = true) {
    if (!fieldValue) return '';

    // Если это Rich Text блоки (массив) - новый редактор
    if (handleRichText && Array.isArray(fieldValue)) {
      console.log('🔍 [Auto Slug] Обнаружен Rich Text Blocks (массив)');
      return this.extractTextFromBlocks(fieldValue);
    }

    // Если это обычная строка
    if (typeof fieldValue === 'string') {
      // Проверяем, содержит ли строка HTML теги (классический Rich Text)
      if (handleRichText && fieldValue.includes('<') && fieldValue.includes('>')) {
        console.log('🔍 [Auto Slug] Обнаружен классический Rich Text (HTML)');
        return this.extractTextFromHtml(fieldValue);
      }
      
      // Обычная строка
      console.log('🔍 [Auto Slug] Обнаружена обычная строка');
      return fieldValue;
    }

    console.log('⚠️ [Auto Slug] Неизвестный тип поля:', typeof fieldValue, fieldValue);
    return '';
  },

  /**
   * Генерирует уникальный слаг
   * @param {string} text - исходный текст
   * @param {string} contentType - тип контента
   * @param {string} documentId - ID документа (для исключения из проверки)
   * @param {object} options - настройки slugify
   * @returns {Promise<string>} - уникальный слаг
   */
  async generateUniqueSlug(text, contentType, documentId = null, options = {}) {
    if (!text) {
      console.log('⚠️ [Auto Slug] Пустой текст для генерации слага');
      return '';
    }

    // Генерируем базовый слаг
    const baseSlug = slugify(text, {
      lower: true,
      strict: true,
      locale: 'ru',
      ...options
    });

    console.log('🔄 [Auto Slug] Базовый слаг:', baseSlug);

    // Проверяем уникальность
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      // Ищем существующие записи с таким слагом
      const existing = await strapi.db.query(contentType).findOne({
        where: { 
          slug: slug,
          ...(documentId && { documentId: { $ne: documentId } })
        }
      });

      if (!existing) {
        console.log('✅ [Auto Slug] Уникальный слаг найден:', slug);
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
      console.log('🔄 [Auto Slug] Попытка слага:', slug);
    }

    return slug;
  },

  /**
   * Генерирует слаг для записи
   * @param {object} data - данные записи
   * @param {string} contentType - тип контента
   * @param {string} documentId - ID документа
   * @returns {Promise<string|null>} - сгенерированный слаг или null
   */
  async generateSlugForEntry(data, contentType, documentId = null) {
    console.log(`🔍 [Auto Slug] generateSlugForEntry вызван для ${contentType}`);
    console.log(`📋 [Auto Slug] Данные:`, JSON.stringify(data, null, 2));
    
    // Получаем текущие настройки из хранилища
    const config = settingsStore.getSettings();
    console.log(`⚙️ [Auto Slug] Конфигурация:`, config);
    
    // Проверяем, включен ли плагин глобально
    if (!config.enabled) {
      console.log(`❌ [Auto Slug] Плагин отключен глобально`);
      return null;
    }

    // Проверяем, включен ли для данного content-type
    const contentTypeConfig = config.contentTypes[contentType];
    if (contentTypeConfig && contentTypeConfig.enabled === false) {
      console.log(`⚠️ [Auto Slug] Генерация отключена для ${contentType}`);
      return null;
    }

    // Если слаг уже есть, проверяем настройки обновления
    if (data.slug && !config.updateExistingSlugs) {
      console.log(`⚠️ [Auto Slug] Слаг уже существует, пропускаем: "${data.slug}"`);
      return null;
    }
    
    if (data.slug && config.updateExistingSlugs) {
      console.log(`🔄 [Auto Slug] Слаг существует, но обновляем согласно настройкам: "${data.slug}"`);
    }

    console.log(`🔍 [Auto Slug] Ищем текст в поле "${config.sourceField}":`, data[config.sourceField]);

    // Получаем текст из основного поля
    let sourceText = this.extractTextFromField(
      data[config.sourceField], 
      config.handleRichText
    );

    console.log(`📝 [Auto Slug] Извлеченный текст из основного поля:`, sourceText);

    // Если основное поле пустое, пробуем резервное
    if (!sourceText && config.fallbackField) {
      console.log(`🔍 [Auto Slug] Пробуем резервное поле "${config.fallbackField}":`, data[config.fallbackField]);
      sourceText = this.extractTextFromField(
        data[config.fallbackField], 
        config.handleRichText
      );
      console.log(`📝 [Auto Slug] Извлеченный текст из резервного поля:`, sourceText);
    }

    if (!sourceText) {
      console.log(`⚠️ [Auto Slug] Не найден текст для генерации слага в ${contentType}`);
      console.log(`🔍 [Auto Slug] Проверенные поля: ${config.sourceField}, ${config.fallbackField}`);
      return null;
    }

    console.log(`🚀 [Auto Slug] Генерируем слаг для ${contentType} из текста:`, sourceText);

    // Генерируем уникальный слаг
    const slug = await this.generateUniqueSlug(
      sourceText,
      contentType,
      documentId,
      config.slugifyOptions
    );

    console.log(`✅ [Auto Slug] Итоговый слаг:`, slug);
    return slug;
  },

  /**
   * Обрабатывает все content-types и находит те, где есть поле slug
   * @returns {Array} - список content-types с полем slug
   */
  getContentTypesWithSlug() {
    const contentTypes = strapi.contentTypes;
    const typesWithSlug = [];

    for (const [uid, contentType] of Object.entries(contentTypes)) {
      // Пропускаем системные типы
      if (!uid.startsWith('api::')) continue;

      // Проверяем, есть ли поле slug
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

    console.log('📋 [Auto Slug] Найденные content-types с полем slug:', typesWithSlug);
    return typesWithSlug;
  }
}); 