# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-08-06

### Added
- 🌐 **Multi-locale Support**: Added support for 8 different locales (ru, en, de, fr, es, it, pl, tr)
- 🎛️ **Admin Panel Locale Selection**: Users can now change locale directly from admin panel without editing code
- 🔧 **Enhanced Configuration**: Improved settings management with proper slugifyOptions handling
- 📝 **Better Documentation**: Updated README with multi-locale examples and configuration guide

### Changed
- ⚙️ **Configuration Priority**: Admin panel settings now take precedence over config file settings
- 🔄 **Settings Initialization**: Improved settings initialization from plugin configuration
- 📦 **Package Name**: Updated to `strapi-plugin-auto-slug-manager-a-mi13` for npm publishing

### Fixed
- 🐛 **Locale Configuration**: Fixed issue where locale settings from config/plugins.ts were not being applied
- 🔧 **Settings Store**: Fixed settings initialization to properly merge slugifyOptions
- ⚡ **Performance**: Optimized settings loading and application

### Technical
- 🏗️ **Architecture**: Improved settings store with proper initialization from plugin config
- 🔌 **Bootstrap**: Enhanced bootstrap process to load settings from plugin configuration
- 🎯 **API**: Better handling of slugifyOptions in settings API

## [1.0.0] - 2025-08-01

### Added
- 🚀 **Initial Release**: Universal auto slug generator for Strapi v5
- 🔍 **Auto-discovery**: Automatically finds content types with slug fields
- 📝 **Rich Text Support**: Full support for Rich Text Blocks and classic Rich Text
- 🌍 **Cyrillic Support**: Proper transliteration for Russian/Cyrillic characters
- 🎨 **Admin Panel**: Beautiful settings interface
- 🔄 **Smart Updates**: Option to update existing slugs or preserve them
- 🎯 **Unique Slugs**: Automatic suffix generation for duplicates
- ⚙️ **Configurable**: Flexible field selection and behavior customization

---

## Migration Guide

### From 1.0.0 to 1.1.0

No breaking changes! The update is fully backward compatible.

**New Features:**
- You can now change locale from admin panel instead of editing config files
- 8 new locales are available for transliteration
- Better settings management

**Optional Migration:**
- If you want to use the new locale selection feature, you can remove `slugifyOptions` from your `config/plugins.ts` and configure everything through the admin panel 