# Strapi Plugin: Auto Slug Manager

🔗 **Universal auto slug generator for all Strapi v5 content types with full Rich Text support**

[![npm version](https://badge.fury.io/js/strapi-plugin-auto-slug-manager-a-mi13.svg)](https://www.npmjs.com/package/strapi-plugin-auto-slug-manager-a-mi13)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **Universal**: Works with ANY content type that has a `slug` field
- 🔍 **Auto-discovery**: Automatically finds and processes all content types with slug fields
- 📝 **Rich Text Support**: Handles both new Blocks editor and classic Rich Text (HTML)
- 🌐 **Cyrillic Support**: Perfect transliteration for Russian and other Cyrillic languages
- ⚙️ **Highly Configurable**: Flexible field selection and behavior customization
- 🎨 **Beautiful Admin UI**: Modern, intuitive settings panel
- 🔄 **Smart Updates**: Option to update existing slugs or preserve them
- 🎯 **Unique Slugs**: Automatic suffix generation for duplicates (-1, -2, -3...)

## 🎯 Compatibility

| Environment | Version | Status |
|-------------|---------|--------|
| **Strapi** | `v5.0.0+` | ✅ Fully Supported |
| **Node.js** | `18.x, 20.x, 22.x` | ✅ Tested |
| **NPM** | `8.x+` | ✅ Compatible |
| **Yarn** | `1.x, 3.x+` | ✅ Compatible |

### Strapi Version Support

- ✅ **Strapi v5.0.0+**: Full support with all features
- ❌ **Strapi v4.x**: Not compatible (use legacy lifecycle approach)
- ❌ **Strapi v3.x**: Not compatible

### Database Support

The plugin works with all Strapi-supported databases:
- ✅ **PostgreSQL** (Recommended)
- ✅ **MySQL/MariaDB**
- ✅ **SQLite** (Development only)

### Rich Text Editor Support

- ✅ **Blocks Editor** (Strapi v5 default) - Full support
- ✅ **Classic Rich Text** (HTML) - Full support
- ✅ **Markdown** fields - Treated as string

### Browser Compatibility (Admin Panel)

- ✅ **Chrome** 90+
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ✅ **Edge** 90+

## 📦 Installation

```bash
npm install strapi-plugin-auto-slug-manager-a-mi13
# or
yarn add strapi-plugin-auto-slug-manager-a-mi13
```

## 🛠️ Setup

1. **Add to plugins configuration** (`config/plugins.js`):

```javascript
module.exports = {
  'auto-slug-manager': {
    enabled: true,
  },
};
```

2. **Restart your Strapi application**:

```bash
npm run develop
# or
yarn develop
```

3. **Configure via Admin Panel**: Navigate to Settings → Auto Slug Manager

## 🎯 Usage

### Automatic Operation

The plugin automatically generates slugs for any content type with a `slug` field:

```javascript
// Creating content
const article = await strapi.entityService.create('api::article.article', {
  data: {
    title: 'My Amazing Article',
    // slug will be automatically generated as 'my-amazing-article'
  }
});
```

### Rich Text Support

The plugin intelligently handles different field types:

**1. Regular String Fields:**
```javascript
title: "Hello World" → slug: "hello-world"
```

**2. Rich Text Blocks (New Editor):**
```javascript
title: [
  {
    type: "paragraph",
    children: [{ type: "text", text: "Hello World" }]
  }
] → slug: "hello-world"
```

**3. Classic Rich Text (HTML):**
```javascript
title: "<h1>Hello World</h1><p>Description</p>" → slug: "hello-world-description"
```

### Cyrillic Transliteration

Perfect for Russian content:

```javascript
title: "Моя статья" → slug: "moya-statya"
title: "Тестовая статья для слуг" → slug: "testovaya-statya-dlya-slug"
```

## ⚙️ Configuration

### Admin Panel Settings

Access via **Settings → Auto Slug Manager**:

| Setting | Description | Default |
|---------|-------------|---------|
| **Enable Plugin** | Turn on/off automatic slug generation | `true` |
| **Source Field** | Primary field to generate slug from | `title` |
| **Fallback Field** | Backup field if source is empty | `name` |
| **Process Rich Text** | Extract text from Rich Text fields | `true` |
| **Update Existing Slugs** | Update slug when source changes | `true` |
| **Cyrillic Support** | Transliterate Cyrillic to Latin | `true` |

### Available Source Fields

- `title` - Most common choice
- `name` - Alternative naming field
- `label` - Label or display name
- `heading` - Header or title field
- `caption` - Caption or subtitle

### Programmatic Configuration

You can also configure via `config/plugins.js`:

```javascript
module.exports = {
  'auto-slug-manager': {
    enabled: true,
    config: {
      enabled: true,
      sourceField: 'title',
      fallbackField: 'name',
      handleRichText: true,
      updateExistingSlugs: true,
      supportCyrillic: true,
      slugifyOptions: {
        lower: true,
        strict: true,
        locale: 'ru'
      }
    }
  },
};
```

## 🔧 Advanced Usage

### Custom Slug Generation

The plugin provides hooks for custom logic:

```javascript
// In your content type lifecycle (optional)
module.exports = {
  async beforeCreate(event) {
    // Plugin handles this automatically
    // You can add custom logic here if needed
  }
};
```

### Content Type Requirements

For the plugin to work, your content type must have a `slug` field:

```javascript
// In your content type schema
{
  "attributes": {
    "title": {
      "type": "string"
    },
    "slug": {
      "type": "uid",
      "targetField": "title"  // Optional: Strapi admin reference
    }
  }
}
```

## 🎨 Admin Interface

The plugin includes a beautiful, modern admin interface:

- **Toggle switches** for all boolean settings
- **Dropdown selectors** for field configuration
- **Real-time status** showing discovered content types
- **Save functionality** with success/error feedback

## 🔍 Troubleshooting

### Plugin Not Working?

1. **Check console logs** for error messages
2. **Verify slug field exists** in your content type
3. **Restart Strapi** after configuration changes
4. **Check admin panel** for plugin status

### Common Issues

**Slugs not generating:**
- Ensure your content type has a `slug` field
- Check that the source field contains text
- Verify plugin is enabled in settings

**Cyrillic not transliterating:**
- Enable "Cyrillic Support" in settings
- Check `slugifyOptions.locale` is set to 'ru'

**Duplicates not handled:**
- Plugin automatically adds suffixes (-1, -2, -3...)
- Check database for existing slugs

## 🧪 Testing

The plugin includes comprehensive test examples:

```javascript
// Test cases covered:
✅ String field extraction
✅ Rich Text Blocks processing  
✅ Classic Rich Text (HTML) processing
✅ Cyrillic transliteration
✅ Unique slug generation
✅ Update vs. preserve existing slugs
✅ Fallback field usage
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for Strapi v5.x
- Uses [slugify](https://github.com/simov/slugify) for text processing
- Designed for production environments

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/A-mi13/strapi-plugin-auto-slug-manager/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/A-mi13/strapi-plugin-auto-slug-manager/discussions)
- 📧 **Email**: alex-c13@mail.ru

---

**Made with ❤️ for the Strapi community**
