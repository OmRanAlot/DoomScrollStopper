# Global Styles Documentation

## Overview

The `globalStyles.js` file provides a centralized styling system for the entire DoomScrollStopper app. All components should use these global styles to ensure visual consistency and make it easy to update the design system.

## Design Token Source

All colors, spacing, typography, and other design values come from [`design/tokens.ts`](../design/tokens.ts), which is the single source of truth for the app's design system.

## How to Use Global Styles

### Basic Import

```javascript
import { globalStyles, colorPalette } from '../styles/globalStyles';
```

### Using Predefined Styles

```javascript
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

function MyComponent() {
    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Hello World</Text>
            <View style={globalStyles.card}>
                <Text style={globalStyles.bodyText}>Card content</Text>
            </View>
        </View>
    );
}
```

### Using Color Palette

```javascript
import { StyleSheet } from 'react-native';
import { colorPalette, spacingValues, borderRadius } from '../styles/globalStyles';

const styles = StyleSheet.create({
    customCard: {
        backgroundColor: colorPalette.surface,
        borderRadius: borderRadius.lg,
        padding: spacingValues.md,
        borderWidth: 1,
        borderColor: colorPalette.divider,
    },
    customText: {
        color: colorPalette.primary,
        fontSize: 18,
    },
});
```

### Combining Global and Custom Styles

```javascript
import { globalStyles, colorPalette } from '../styles/globalStyles';

<View style={[globalStyles.card, { marginTop: 20 }]}>
    <Text style={[globalStyles.cardTitle, { color: colorPalette.primary }]}>
        Custom Title
    </Text>
</View>
```

## Available Styles

### Containers
- `container` - Main app container (flex: 1, background)
- `scrollContainer` - Scrollable container
- `contentWrapper` - Content with padding

### Typography
- `title` - H1 title (32px, bold)
- `subtitle` - Large body text (18px)
- `sectionTitle` - H2 section title (24px, bold)
- `cardTitle` - Card header (24px, bold)
- `bodyText` - Regular body text (16px)
- `bodyTextSecondary` - Secondary body text (16px, gray)
- `captionText` - Small caption (12px)

### Cards
- `card` - Standard card with shadow
- `cardLarge` - Large card with more padding
- `cardSmall` - Small compact card

### Buttons
- `buttonPrimary` - Primary action button (purple background)
- `buttonPrimaryText` - White text for primary button
- `buttonSecondary` - Secondary button (outlined)
- `buttonSecondaryText` - Text for secondary button

### Stats & Metrics
- `statsGrid` - Grid layout for stats (2 columns)
- `statBox` - Individual stat container
- `statIcon` - Stat emoji/icon (32px)
- `statValue` - Stat number (24px, bold)
- `statLabel` - Stat description (12px)

### Progress Bars
- `progressBarContainer` - Bar background
- `progressBarFill` - Filled portion
- `progressLabel` - Label above bar
- `progressValue` - Progress percentage

### List Items
- `listItem` - Standard list row
- `listItemLast` - Last item (no bottom border)
- `listItemLeft` - Left side with icon + text
- `listItemRight` - Right side content
- `listItemIcon` - List item emoji (28px)
- `listItemTitle` - Item title
- `listItemSubtitle` - Item subtitle

### Badges & Chips
- `badge` - Small label badge
- `badgeText` - Badge text
- `chip` - Outlined chip button
- `chipSelected` - Selected chip
- `chipText` - Chip label
- `chipTextSelected` - Selected chip label

### Utilities
- `divider` - Horizontal divider line
- `section` - Section container with bottom margin
- Margin/padding utilities: `marginTopMd`, `paddingLg`, etc.

## Color Palette

### Brand Colors
- `primary` (#6366F1) - Main brand color (indigo)
- `primaryLight` (#818CF8) - Lighter variant
- `primaryDark` (#4F46E5) - Darker variant
- `secondary` (#A855F7) - Secondary purple
- `accent` (#F472B6) - Accent pink

### Background Colors
- `background` (#111827) - Main dark background
- `surface` (#1F2937) - Elevated surfaces (cards)
- `card` (#0f1724) - Alternative card background

### Text Colors
- `textPrimary` (#F9FAFB) - Primary text (light)
- `textSecondary` (#D1D5DB) - Secondary text (gray)

### Semantic Colors
- `success` (#10B981) - Success green
- `warning` (#D97706) - Warning orange
- `error` (#DC2626) - Error red

### UI Colors
- `divider` (#374151) - Separator lines
- `overlay` (rgba(0,0,0,0.6)) - Modal overlays

## Spacing Scale

All spacing follows an 8px grid system:

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px
- `xxxl`: 64px

```javascript
import { spacingValues } from '../styles/globalStyles';

const styles = StyleSheet.create({
    box: {
        padding: spacingValues.md,  // 16px
        margin: spacingValues.lg,   // 24px
    },
});
```

## Border Radius

Rounded corners follow this scale:

- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 24px
- `xxl`: 32px
- `full`: 9999px (fully rounded)

```javascript
import { borderRadius } from '../styles/globalStyles';

const styles = StyleSheet.create({
    card: {
        borderRadius: borderRadius.lg,  // 16px
    },
    button: {
        borderRadius: borderRadius.xl,  // 24px
    },
});
```

## Typography Scale

Font sizes follow a modular scale:

- Display: 48px
- H1: 32px
- H2: 24px
- H3: 20px
- Body Large: 18px
- Body: 16px
- Body Small: 14px
- Caption: 12px
- Overline: 10px

```javascript
import { typographyStyles } from '../styles/globalStyles';

const styles = StyleSheet.create({
    heading: {
        fontSize: typographyStyles.h2.size,         // 24
        lineHeight: typographyStyles.h2.lineHeight, // 32
        fontWeight: typographyStyles.h2.weight,     // '300'
    },
});
```

## Best Practices

### ✅ DO

```javascript
// Use global styles whenever possible
<View style={globalStyles.card}>
    <Text style={globalStyles.cardTitle}>Title</Text>
</View>

// Use color palette for custom styles
backgroundColor: colorPalette.primary

// Use spacing values
padding: spacingValues.md
```

### ❌ DON'T

```javascript
// Don't hardcode colors
backgroundColor: '#6366F1'  // Use colorPalette.primary instead

// Don't use arbitrary spacing
padding: 15  // Use spacingValues.md (16) instead

// Don't create redundant styles
fontSize: 24, fontWeight: '700'  // Use globalStyles.cardTitle
```

## Updating the Design System

If you need to change colors, spacing, or typography:

1. Update [`design/tokens.ts`](../design/tokens.ts) - this is the source of truth
2. Global styles will automatically reflect the changes
3. No need to update individual components

## Examples

### Example 1: Stats Card

```javascript
import { View, Text } from 'react-native';
import { globalStyles, colorPalette } from '../styles/globalStyles';

<View style={globalStyles.card}>
    <Text style={globalStyles.cardTitle}>Today's Stats</Text>
    <View style={globalStyles.statsGrid}>
        <View style={globalStyles.statBox}>
            <Text style={globalStyles.statIcon}>⏱️</Text>
            <Text style={globalStyles.statValue}>2h 34m</Text>
            <Text style={globalStyles.statLabel}>Screen Time</Text>
        </View>
        <View style={globalStyles.statBox}>
            <Text style={globalStyles.statIcon}>🔥</Text>
            <Text style={globalStyles.statValue}>5</Text>
            <Text style={globalStyles.statLabel}>Day Streak</Text>
        </View>
    </View>
</View>
```

### Example 2: List with Items

```javascript
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

<View style={globalStyles.card}>
    <Text style={globalStyles.cardTitle}>Top Apps</Text>
    <View style={globalStyles.listItem}>
        <View style={globalStyles.listItemLeft}>
            <Text style={globalStyles.listItemIcon}>📷</Text>
            <Text style={globalStyles.listItemTitle}>Instagram</Text>
        </View>
        <View style={globalStyles.listItemRight}>
            <Text style={globalStyles.bodyText}>45m</Text>
        </View>
    </View>
</View>
```

### Example 3: Progress Bar

```javascript
import { View, Text } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

<View style={globalStyles.card}>
    <Text style={globalStyles.progressLabel}>Daily Goal</Text>
    <View style={globalStyles.progressBarContainer}>
        <View style={[globalStyles.progressBarFill, { width: '75%' }]} />
    </View>
    <Text style={globalStyles.progressValue}>75%</Text>
</View>
```

## Need Help?

If you need a style that doesn't exist in the global styles:

1. Check if you can combine existing styles
2. Check if you can use color palette + spacing values
3. If it's a reusable pattern, consider adding it to `globalStyles.js`
4. For one-off custom styles, create them locally but still use design tokens

## Summary

✨ **The global styles system ensures**:
- Consistent visual design across all screens
- Easy theme updates (change once, update everywhere)
- Smaller component files (less style duplication)
- Faster development (use predefined styles)
- Better maintainability (single source of truth)

---

**Last Updated**: December 28, 2025
**Design System**: Based on design/tokens.ts
**Color Scheme**: Indigo primary (#6366F1) with dark mode
