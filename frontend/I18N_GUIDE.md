# Internationalization (i18n) Guide

Trippy supports multiple languages to make it accessible to users worldwide.

## Supported Languages

- 🇺🇸 **English (US)** - American English (`en-US`)
- 🇬🇧 **English (UK)** - British English (`en-GB`)
- 🇯🇵 **Japanese** - 日本語 (`ja`)

## Key Differences Between English Variants

### British vs American English

**Spelling Differences:**
- Some UI labels use different spellings (e.g., "colour" vs "color")
- Terminology varies in certain contexts

**Transportation Terminology:**
- **US:** "Transit" for public transportation
- **UK:** "Public Transport" for public transportation
- **US:** "Bicycling"
- **UK:** "Cycling"

**Other Differences:**
- Date formatting (handled automatically by browser locale)
- Minor vocabulary differences in the interface

## How Language Selection Works

### 1. Automatic Detection
When you first visit the app, it automatically detects your browser's language settings and selects the closest match:
- Browser set to `en-US` → American English
- Browser set to `en-GB` → British English
- Browser set to `ja` → Japanese
- Other English variants (en-AU, en-CA, etc.) → American English (default)

### 2. Manual Selection
You can change the language at any time using the language selector in the header:
1. Look for the "Language" dropdown in the top-right corner
2. Select your preferred language
3. The page will refresh with the new language

### 3. URL-Based Language
The current language is embedded in the URL:
- `/ja` - Japanese version
- `/en-US` - American English version
- `/en-GB` - British English version

**When you share a travel plan URL:**
- The language is preserved in the URL
- Recipients will see the plan in the same language you selected
- They can still change the language using the selector

## For Developers

### Adding a New Language

1. **Create a translation file:**
   ```bash
   cp messages/en-US.json messages/[new-locale].json
   ```

2. **Translate the content:**
   Edit the new JSON file with appropriate translations.

3. **Add the locale to the configuration:**
   ```typescript
   // i18n.ts
   export const locales = ['en-US', 'en-GB', 'ja', '[new-locale]'] as const;
   ```

4. **Update the middleware matcher:**
   ```typescript
   // middleware.ts
   export const config = {
     matcher: ['/', '/(en-US|en-GB|ja|[new-locale])/:path*'],
   };
   ```

### Translation File Structure

```json
{
  "common": {
    "appName": "Trippy",
    "editMode": "Edit Mode",
    "previewMode": "Preview Mode",
    ...
  },
  "trip": {
    "title": "Travel Plan",
    "addDay": "Add Day",
    ...
  },
  ...
}
```

### Using Translations in Components

```typescript
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('common');
  
  return <button>{t('editMode')}</button>;
}
```

### Pluralization and Variables

```json
{
  "timeline": {
    "itinerary": "{{days}}-day itinerary"
  }
}
```

```typescript
t('itinerary', { days: 5 }) // "5-day itinerary"
```

## Best Practices

1. **Keep URLs shareable**: Language is preserved in URLs, making shared plans accessible in the sender's language
2. **Test in multiple languages**: Always test new features in all supported languages
3. **Use semantic keys**: Translation keys should describe the content, not the position (e.g., `trip.title` not `page1.text1`)
4. **Avoid hardcoded strings**: All user-visible text should come from translation files

## Technical Details

- **Framework**: next-intl v4.x
- **Detection**: Browser Accept-Language header
- **Routing**: URL-based with automatic detection fallback
- **Static Generation**: All language variants are pre-generated at build time
- **Middleware**: Automatic locale detection and redirection

## Known Limitations

1. **Google Maps API**: Map labels and place names use Google's localization, which may not perfectly match the selected interface language
2. **Date Picker**: Uses browser's native date picker, which follows system locale
3. **User Input**: Place names and custom text retain the language they were entered in
