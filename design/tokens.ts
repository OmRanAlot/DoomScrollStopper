// Design tokens for DoomScrollStopper (dark mode only)
// Auto-generated from the PRD (`input.md`).
// Exported as plain JS/TS objects for easy consumption in React Native.

export const colors = {
  // Primary
  primary50: '#EEF2FF',
  primary100: '#E0E7FF',
  primary300: '#A5B4FC',
  primary400: '#818CF8',
  primary500: '#6366F1',
  primary600: '#4F46E5',

  // Secondary
  secondary300: '#D8B4FE',
  secondary400: '#C084FC',
  secondary500: '#A855F7',
  secondary600: '#9333EA',

  // Accent
  accent400: '#F9A8D4',
  accent500: '#F472B6',
  accent600: '#EC4899',

  // Neutrals (dark-mode tuned)
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Semantic
  success100: '#D1FAE5',
  success500: '#10B981',
  success600: '#059669',
  warning100: '#FEF3C7',
  warning600: '#D97706',
  error100: '#FEE2E2',
  error600: '#DC2626',

  // Gradients (represented as tuples for convenience)
  gradientPrimary: ['#EEF2FF', '#F3E8FF', '#FCE7F3'],
  gradientCalm: ['#DBEAFE', '#D1FAE5'],
  gradientCard: ['#818CF8', '#9333EA'],
  gradientBreathing: ['#67E8F9', '#5EEAD4'],
};

export const typography = {
  fontFamilyIOSDisplay: 'SF Pro Display',
  fontFamilyIOSText: 'SF Pro Text',
  fontFamilyAndroid: 'Roboto',

  display: { size: 48, lineHeight: 56, weight: '300' },
  h1: { size: 32, lineHeight: 40, weight: '300' },
  h2: { size: 24, lineHeight: 32, weight: '300' },
  h3: { size: 20, lineHeight: 28, weight: '300' },

  bodyLarge: { size: 18, lineHeight: 28, weight: '400' },
  body: { size: 16, lineHeight: 24, weight: '400' },
  bodySmall: { size: 14, lineHeight: 20, weight: '400' },

  caption: { size: 12, lineHeight: 16, weight: '400' },
  overline: { size: 10, lineHeight: 16, weight: '600', letterSpacing: 1 },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const shadows = {
  sm: { offset: { width: 0, height: 1 }, radius: 2, color: 'rgba(0,0,0,0.05)', elevation: 1 },
  md: { offset: { width: 0, height: 4 }, radius: 6, color: 'rgba(0,0,0,0.07)', elevation: 3 },
  lg: { offset: { width: 0, height: 10 }, radius: 15, color: 'rgba(0,0,0,0.1)', elevation: 6 },
  xl: { offset: { width: 0, height: 20 }, radius: 25, color: 'rgba(0,0,0,0.15)', elevation: 12 },
};

export const animation = {
  instant: 0,
  fast: 150,
  base: 250,
  slow: 400,
  breathing: 4000,
  easing: 'cubic-bezier(0.4,0,0.2,1)',
};

export const icons = {
  defaultSize: 20,
  strokeWidth: 2,
};

// Convenience palette for dark-mode mapping (since PRD lists neutrals
// primarily for light contexts, map dark-mode primary text/background)
export const dark = {
  background: colors.gray900,
  surface: colors.gray800,
  card: '#0f1724',
  textPrimary: colors.gray50,
  textSecondary: colors.gray300,
  divider: colors.gray700,
  overlay: 'rgba(0,0,0,0.6)',
};

export default {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  animation,
  icons,
  dark,
};
