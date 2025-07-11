# Strapi Plugin: Auto Slug Manager

Universal auto slug generator for all Strapi v5 content types with full Rich Text support

[![npm version](https://badge.fury.io/js/strapi-plugin-auto-slug-manager-a-mi13.svg)](https://www.npmjs.com/package/strapi-plugin-auto-slug-manager-a-mi13)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Universal**: Works with ANY content type that has a slug field
- **Auto-discovery**: Automatically finds and processes all content types with slug fields  
- **Rich Text Support**: Handles both new Blocks editor and classic Rich Text (HTML)
- **Cyrillic Support**: Perfect transliteration for Russian and other Cyrillic languages
- **Highly Configurable**: Flexible field selection and behavior customization
- **Beautiful Admin UI**: Modern, intuitive settings panel
- **Smart Updates**: Option to update existing slugs or preserve them
- **Unique Slugs**: Automatic suffix generation for duplicates (-1, -2, -3...)

## Installation

`ash
npm install strapi-plugin-auto-slug-manager-a-mi13
# or  
yarn add strapi-plugin-auto-slug-manager-a-mi13
`

## Setup

1. Add to plugins configuration (config/plugins.js):

`javascript
module.exports = {
  'auto-slug-manager': {
    enabled: true,
  },
};
`

2. Restart your Strapi application

3. Configure via Admin Panel: Navigate to Settings  Auto Slug Manager

## Usage

### Automatic Operation

The plugin automatically generates slugs for any content type with a slug field.

### Rich Text Support

The plugin intelligently handles different field types:

**1. Regular String Fields:**
title: "Hello World"  slug: "hello-world"

**2. Rich Text Blocks (New Editor):**  
Extracts text from JSON structure

**3. Classic Rich Text (HTML):**
Strips HTML tags and extracts clean text

### Cyrillic Transliteration

Perfect for Russian content:
title: "Моя статья"  slug: "moya-statya"

## Configuration

### Admin Panel Settings

Access via Settings  Auto Slug Manager:

- Enable Plugin: Turn on/off automatic slug generation
- Source Field: Primary field to generate slug from (title)
- Fallback Field: Backup field if source is empty (name)  
- Process Rich Text: Extract text from Rich Text fields
- Update Existing Slugs: Update slug when source changes
- Cyrillic Support: Transliterate Cyrillic to Latin

## License

This project is licensed under the MIT License.

## Support

- Bug Reports: [GitHub Issues](https://github.com/A-mi13/strapi-plugin-auto-slug-manager/issues)
- Email: alex-c13@mail.ru

Made with  for the Strapi community