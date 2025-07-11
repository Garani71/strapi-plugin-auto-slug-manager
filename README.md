# Strapi Plugin: Auto Slug Manager

Universal auto slug generator for all Strapi v5 content types with full Rich Text support

## Features

- **Universal**: Works with ANY content type that has a `slug` field
- **Auto-discovery**: Automatically finds and processes all content types with slug fields
- **Rich Text Support**: Handles both new Blocks editor and classic Rich Text (HTML)
- **Cyrillic Support**: Perfect transliteration for Russian and other Cyrillic languages
- **Highly Configurable**: Flexible field selection and behavior customization
- **Beautiful Admin UI**: Modern, intuitive settings panel
- **Smart Updates**: Option to update existing slugs or preserve them
- **Unique Slugs**: Automatic suffix generation for duplicates (-1, -2, -3...)

## Installation

```bash
npm install strapi-plugin-auto-slug-manager-a-mi13
# or
yarn add strapi-plugin-auto-slug-manager-a-mi13
```

## Setup

1. **Add to plugins configuration** (`config/plugins.js`):

```javascript
module.exports = {
  'auto-slug-manager': {
    enabled: true,
  },
};
```

2. **Restart your Strapi application**

3. **Configure via Admin Panel**: Navigate to Settings  Auto Slug Manager

## License

This project is licensed under the MIT License.

## Support

- **Bug Reports**: [GitHub Issues](https://github.com/A-mi13/strapi-plugin-auto-slug-manager/issues)
- **Email**: alex-c13@mail.ru

Made with  for the Strapi community
