Design tokens (dark mode)

This folder contains the design tokens extracted from the PRD (`input.md`).

What are design tokens?
- Design tokens are named variables that represent the visual design decisions of the product: colors, typography, spacing, radii, shadows, animation timings, and icon sizes.
- Tokens make it easy to keep UI consistent, and they act as the single source of truth for styling across components.

How tokens are organized here
- `tokens.ts` exports grouped objects: `colors`, `typography`, `spacing`, `radii`, `shadows`, `animation`, and `icons`.
- The file currently implements dark-mode tokens only (per request).

Why use tokens?
- Single place to update visual styles (e.g., change primary color once).
- Easier to implement theming and runtime changes.
- Cleaner component code: components consume tokens instead of magic numbers.

Quick usage example (React Native + TypeScript)

```ts
import tokens from '../design/tokens';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.dark.background,
    padding: tokens.spacing.md,
  },
  title: {
    fontFamily: tokens.typography.fontFamilyIOSText,
    fontSize: tokens.typography.h1.size,
    lineHeight: tokens.typography.h1.lineHeight,
    color: tokens.dark.textPrimary,
  },
});

function Example() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello tokens</Text>
    </View>
  );
}
```

Next steps you might ask for
- Add a light-mode tokens file and a small theme switcher utility.
- Extract tokens to JSON for sharing with design tools.
- Create a `ThemeProvider` and typed hooks like `useTokens()` for ease of use.

Contact
- If you want these tokens in a different format (JSON, SCSS, etc.), tell me which format and I will add it.
