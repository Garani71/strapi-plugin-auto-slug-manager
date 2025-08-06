# Strapi Plugin Auto Slug Manager

🔗 Universal auto slug generator for all Strapi content types with Rich Text support

## ✨ Features

- **Universal** - Works with ANY content type that has a `slug` field
- **Rich Text Support** - Extracts text from both Rich Text Blocks (new editor) and classic Rich Text (HTML) fields
- **Multiple Field Types** - Supports string, Rich Text Blocks, and classic Rich Text fields
- **Cyrillic Support** - Proper transliteration of Russian/Cyrillic characters
- **Smart Uniqueness** - Automatically adds suffixes (-1, -2, -3) for unique slugs
- **Auto-discovery** - Automatically finds and processes all content types with slug fields
- **Configurable** - Update existing slugs or keep them unchanged
- **Admin Panel** - Beautiful settings interface with real-time configuration
- **Zero Configuration** - Works out of the box with sensible defaults
- **🌐 Multi-locale Support** - Choose from 8 different locales for transliteration (ru, en, de, fr, es, it, pl, tr)
- **🎛️ Easy Configuration** - Change locale directly from admin panel without code editing

## 🚀 Installation

```bash
npm install strapi-plugin-auto-slug-manager-a-mi13
# or
yarn add strapi-plugin-auto-slug-manager-a-mi13
```

## ⚙️ Configuration

Add the plugin to your `config/plugins.js` or `config/plugins.ts`:

```javascript
module.exports = {
  'auto-slug-manager': {
    enabled: true,
    config: {
      enabled: true,                    // Enable/disable plugin globally
      sourceField: 'title',             // Primary field to generate slug from
      fallbackField: 'name',            // Fallback field if primary is empty
      handleRichText: true,             // Process Rich Text (blocks) fields
      addSuffixForUnique: true,         // Add suffixes for uniqueness
      supportCyrillic: true,            // Support Cyrillic transliteration
      updateExistingSlugs: true,        // Update existing slugs when title changes
      slugifyOptions: {
        lower: true,
        strict: true,
        locale: 'ru'
      }
    }
  }
};
```

## 📖 Usage

1. **Add a `slug` field** to any content type in your Strapi schema
2. **Create or edit entries** - slugs will be automatically generated from `title` or `name` fields
3. **Rich Text support** - Works with both regular string fields and Rich Text editor fields

### Example Content Type Schema

```json
{
  "kind": "collectionType",
  "collectionName": "articles",
  "info": {
    "singularName": "article",
    "pluralName": "articles",
    "displayName": "Articles"
  },
  "attributes": {
    "title": {
      "type": "blocks"
    },
    "slug": {
      "type": "uid",
      "targetField": "title"
    }
  }
}
```

## 🎯 How it Works

1. **Auto-discovery**: Plugin scans all content types for `slug` fields
2. **Lifecycle hooks**: Registers `beforeCreate` and `beforeUpdate` hooks
3. **Smart text extraction**: Automatically detects and processes different field types:
   - **String fields** → direct text extraction
   - **Rich Text Blocks** → extracts text from JSON structure
   - **Classic Rich Text** → strips HTML tags and extracts clean text
4. **Slug generation**: Uses `slugify` with Cyrillic support
5. **Uniqueness check**: Ensures all slugs are unique within the content type

## 🔧 API Endpoints

The plugin provides API endpoints for managing settings:

- `GET /auto-slug-manager/settings` - Get current settings
- `PUT /auto-slug-manager/settings` - Update settings
- `GET /auto-slug-manager/status` - Get plugin status and discovered content types

## 📝 Field Types Supported

### Rich Text Blocks (New Editor)
```json
{
  "title": [
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "text": "My Article Title"
        }
      ]
    }
  ]
}
```

### Rich Text (Classic Editor)
```json
{
  "title": "<h1>My Article Title</h1><p>Some description</p>"
}
```

### Regular String
```json
{
  "title": "My Article Title"
}
```

All three will generate: `my-article-title`

## 🌍 Multi-locale Support

The plugin supports 8 different locales for transliteration. You can change the locale directly from the admin panel:

### Available Locales

| Locale | Language | Example |
|--------|----------|---------|
| `ru` | Russian | `Моя статья` → `moya-statya` |
| `en` | English | `My Article` → `my-article` |
| `de` | German | `Mein Artikel` → `mein-artikel` |
| `fr` | French | `Mon Article` → `mon-article` |
| `es` | Spanish | `Mi Artículo` → `mi-articulo` |
| `it` | Italian | `Il Mio Articolo` → `il-mio-articolo` |
| `pl` | Polish | `Mój Artykuł` → `moj-artykul` |
| `tr` | Turkish | `Benim Makalem` → `benim-makalem` |

### How to Change Locale

1. **Go to Admin Panel** → Settings → Auto Slug Manager
2. **Find "🔧 Настройки генерации слагов"** section
3. **Select your preferred locale** from the dropdown
4. **Click "Сохранить настройки"**

### Examples

**Russian locale (`ru`):**
- `Моя статья` → `moya-statya`
- `Тестовая запись` → `testovaya-zapis`

**English locale (`en`):**
- `My Article` → `my-article`
- `Test Entry` → `test-entry`

## 🔧 Development

```bash
# Clone the repository
git clone https://github.com/A-mi13/strapi-plugin-auto-slug-manager
cd strapi-plugin-auto-slug-manager

# Install dependencies
npm install

# Build the plugin
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

MIT License - see LICENSE file for details.

## 🐛 Issues

Found a bug? Please create an issue on [GitHub](https://github.com/A-mi13/strapi-plugin-auto-slug-manager/issues).

## 📦 Related

- [Strapi Documentation](https://docs.strapi.io/)
- [Strapi Plugin Development](https://docs.strapi.io/dev-docs/plugins-development)

---

Made with ❤️ for the Strapi community 