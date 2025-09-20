import { Colors } from '@/constants/theme';
import { Dimensions, Platform, StyleSheet } from 'react-native';

// Get device dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// ========================================
// DESIGN TOKENS
// ========================================

// Color Palette
export const colors = {
  // Map to unified Colors palette (light-only theme mirrored to dark)
  primary: Colors.light.primary,
  primaryLight: Colors.light.primaryLight,
  primaryDark: Colors.light.primaryDark,
  primaryPressed: Colors.light.primary,

  secondary: Colors.light.secondary,
  secondaryLight: Colors.light.secondaryLight,
  secondaryDark: Colors.light.secondaryDark,

  accent: Colors.light.accent,
  accentLight: Colors.light.accentLight,
  accentDark: Colors.light.accentDark,

  success: Colors.light.success,
  warning: Colors.light.warning,
  error: Colors.light.error,
  info: Colors.light.info,

  light: {
    background: Colors.light.background,
    backgroundSecondary: Colors.light.backgroundSecondary,
    backgroundTertiary: Colors.light.backgroundTertiary,

    surface: Colors.light.surface,
    surfaceSecondary: Colors.light.surfaceSecondary,
    surfaceTertiary: Colors.light.surfaceTertiary,

    textPrimary: Colors.light.text,
    textSecondary: Colors.light.textSecondary,
    textTertiary: Colors.light.textTertiary,
    textQuaternary: Colors.light.textTertiary,
    textInverse: Colors.light.textInverse,

    border: Colors.light.border,
    borderLight: Colors.light.borderLight,
    borderDark: Colors.light.borderDark,

    shadow: 'rgba(0, 0, 0, 0.08)',
    shadowMedium: 'rgba(0, 0, 0, 0.12)',
    shadowStrong: 'rgba(0, 0, 0, 0.18)',

    overlay: 'rgba(0, 0, 0, 0.35)',
  },

  dark: {
    background: Colors.dark.background,
    backgroundSecondary: Colors.dark.backgroundSecondary,
    backgroundTertiary: Colors.dark.backgroundTertiary,

    surface: Colors.dark.surface,
    surfaceSecondary: Colors.dark.surfaceSecondary,
    surfaceTertiary: Colors.dark.surfaceTertiary,

    textPrimary: Colors.dark.text,
    textSecondary: Colors.dark.textSecondary,
    textTertiary: Colors.dark.textTertiary,
    textQuaternary: Colors.dark.textTertiary,
    textInverse: Colors.dark.textInverse,

    border: Colors.dark.border,
    borderLight: Colors.dark.borderLight,
    borderDark: Colors.dark.borderDark,

    shadow: 'rgba(0, 0, 0, 0.4)',
    shadowMedium: 'rgba(0, 0, 0, 0.5)',
    shadowStrong: 'rgba(0, 0, 0, 0.6)',

    overlay: 'rgba(0, 0, 0, 0.55)',
  },

  gradients: {
    primary: [Colors.light.primary, Colors.light.primaryLight],
    secondary: [Colors.light.secondary, Colors.light.secondaryLight],
    accent: [Colors.light.accent, Colors.light.accentLight],
    success: [Colors.light.success, '#2ED573'],
    sunset: ['#E76F51', '#F4A261', '#E9C46A'],
    ocean: ['#264653', '#2A9D8F', '#E9C46A'],
    purple: ['#7F5AF0', '#B693FE', '#E2CFFE'],
  },
};

// Typography Scale
export const typography = {
  // Font Families
  fonts: {
    regular: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'SF Pro Text',
      android: 'Roboto-Bold',
      default: 'System',
    }),
    mono: Platform.select({
      ios: 'SF Mono',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  
  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
  
  // Font Weights
  weights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

// Spacing System
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
};

// Border Radius
export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Dimensions
export const appDimensions = {
  contentPadding: spacing.lg,     // 16
  sectionSpacing: spacing.xl,     // 20  
  cardSpacing: spacing.sm,        // 8
  buttonRadius: borderRadius.md,  // 8
};

// Shadows
export const shadows = {
  small: {
    boxShadow: Platform.select({ web: '0 1px 3px rgba(0,0,0,0.08)', default: undefined }),
    elevation: 2,
  },
  medium: {
    boxShadow: Platform.select({ web: '0 2px 8px rgba(0,0,0,0.12)', default: undefined }),
    elevation: 4,
  },
  large: {
    boxShadow: Platform.select({ web: '0 4px 14px rgba(0,0,0,0.14)', default: undefined }),
    elevation: 8,
  },
  xl: {
    boxShadow: Platform.select({ web: '0 8px 24px rgba(0,0,0,0.18)', default: undefined }),
    elevation: 12,
  },
};

// Dark theme shadows
export const darkShadows = {
  small: {
    boxShadow: Platform.select({ web: '0 1px 3px rgba(0,0,0,0.25)', default: undefined }),
    elevation: 2,
  },
  medium: {
    boxShadow: Platform.select({ web: '0 2px 8px rgba(0,0,0,0.35)', default: undefined }),
    elevation: 4,
  },
  large: {
    boxShadow: Platform.select({ web: '0 4px 14px rgba(0,0,0,0.45)', default: undefined }),
    elevation: 8,
  },
  xl: {
    boxShadow: Platform.select({ web: '0 8px 24px rgba(0,0,0,0.55)', default: undefined }),
    elevation: 12,
  },
};

// Layout Dimensions
const layoutDimensions = {
  screenWidth,
  screenHeight,
  contentPadding: spacing.lg,
  sectionSpacing: spacing['2xl'],
  cardSpacing: spacing.md,
  listItemHeight: 60,
  buttonHeight: 48,
  inputHeight: 48,
  headerHeight: Platform.select({ ios: 44, android: 56, default: 44 }),
  tabBarHeight: Platform.select({ ios: 83, android: 60, default: 60 }),
};

// ========================================
// GLOBAL STYLES
// ========================================

export const globalStyles = StyleSheet.create({
  // Layout Containers
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  
  containerPadded: {
    flex: 1,
    padding: layoutDimensions.contentPadding,
    backgroundColor: colors.light.background,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light.background,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  spaceAround: {
    justifyContent: 'space-around',
  },
  
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Card Styles
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.medium,
  },
  
  cardCompact: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  
  cardElevated: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    ...shadows.large,
  },
  
  // Button Styles
  button: {
    height: layoutDimensions.buttonHeight,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    ...shadows.small,
  },
  
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  
  buttonSecondary: {
    backgroundColor: colors.light.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  
  buttonDanger: {
    backgroundColor: colors.error,
  },
  
  buttonSuccess: {
    backgroundColor: colors.success,
  },
  
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  
  buttonLarge: {
    height: 56,
    paddingHorizontal: spacing.xl,
  },
  
  buttonSmall: {
    height: 36,
    paddingHorizontal: spacing.md,
  },
  
  // Text Styles
  textPrimary: {
    color: colors.light.textPrimary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.base,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
  
  textSecondary: {
    color: colors.light.textSecondary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  
  textCaption: {
    color: colors.light.textTertiary,
    fontFamily: typography.fonts.regular,
    fontSize: typography.sizes.xs,
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
  },
  
  heading1: {
    color: colors.light.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['4xl'],
    fontWeight: '700' as const,
    lineHeight: typography.sizes['4xl'] * typography.lineHeights.tight,
  },
  
  heading2: {
    color: colors.light.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['3xl'],
    fontWeight: '700' as const,
    lineHeight: typography.sizes['3xl'] * typography.lineHeights.tight,
  },
  
  heading3: {
    color: colors.light.textPrimary,
    fontFamily: typography.fonts.bold,
    fontSize: typography.sizes['2xl'],
    fontWeight: '600' as const,
    lineHeight: typography.sizes['2xl'] * typography.lineHeights.tight,
  },
  
  heading4: {
    color: colors.light.textPrimary,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.xl,
    fontWeight: '600' as const,
    lineHeight: typography.sizes.xl * typography.lineHeights.normal,
  },
  
  heading5: {
    color: colors.light.textPrimary,
    fontFamily: typography.fonts.medium,
    fontSize: typography.sizes.lg,
    fontWeight: '500' as const,
    lineHeight: typography.sizes.lg * typography.lineHeights.normal,
  },
  
  // Input Styles
  input: {
    height: layoutDimensions.inputHeight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.base,
    color: colors.light.textPrimary,
  },
  
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  
  // List Styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.borderLight,
    minHeight: layoutDimensions.listItemHeight,
  },
  
  listItemLast: {
    borderBottomWidth: 0,
  },
  
  // Badge Styles
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
  },
  
  badgeSuccess: {
    backgroundColor: colors.success,
  },
  
  badgeWarning: {
    backgroundColor: colors.warning,
  },
  
  badgeError: {
    backgroundColor: colors.error,
  },
  
  badgeSecondary: {
    backgroundColor: colors.light.surfaceTertiary,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: spacing.md,
  },
  
  dividerThick: {
    height: 2,
    backgroundColor: colors.light.border,
    marginVertical: spacing.lg,
  },
  
  // Utility Classes
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },
  
  mt0: { marginTop: 0 },
  mt1: { marginTop: spacing.xs },
  mt2: { marginTop: spacing.sm },
  mt3: { marginTop: spacing.md },
  mt4: { marginTop: spacing.lg },
  mt5: { marginTop: spacing.xl },
  mt6: { marginTop: spacing['2xl'] },
  
  mb0: { marginBottom: 0 },
  mb1: { marginBottom: spacing.xs },
  mb2: { marginBottom: spacing.sm },
  mb3: { marginBottom: spacing.md },
  mb4: { marginBottom: spacing.lg },
  mb5: { marginBottom: spacing.xl },
  mb6: { marginBottom: spacing['2xl'] },
  
  ml0: { marginLeft: 0 },
  ml1: { marginLeft: spacing.xs },
  ml2: { marginLeft: spacing.sm },
  ml3: { marginLeft: spacing.md },
  ml4: { marginLeft: spacing.lg },
  ml5: { marginLeft: spacing.xl },
  
  mr0: { marginRight: 0 },
  mr1: { marginRight: spacing.xs },
  mr2: { marginRight: spacing.sm },
  mr3: { marginRight: spacing.md },
  mr4: { marginRight: spacing.lg },
  mr5: { marginRight: spacing.xl },
  
  p0: { padding: 0 },
  p1: { padding: spacing.xs },
  p2: { padding: spacing.sm },
  p3: { padding: spacing.md },
  p4: { padding: spacing.lg },
  p5: { padding: spacing.xl },
  p6: { padding: spacing['2xl'] },
  
  px0: { paddingHorizontal: 0 },
  px1: { paddingHorizontal: spacing.xs },
  px2: { paddingHorizontal: spacing.sm },
  px3: { paddingHorizontal: spacing.md },
  px4: { paddingHorizontal: spacing.lg },
  px5: { paddingHorizontal: spacing.xl },
  
  py0: { paddingVertical: 0 },
  py1: { paddingVertical: spacing.xs },
  py2: { paddingVertical: spacing.sm },
  py3: { paddingVertical: spacing.md },
  py4: { paddingVertical: spacing.lg },
  py5: { paddingVertical: spacing.xl },
  
  // Text Alignment
  textLeft: { textAlign: 'left' },
  textCenter: { textAlign: 'center' },
  textRight: { textAlign: 'right' },
  
  // Positioning
  absolute: { position: 'absolute' },
  relative: { position: 'relative' },
  
  // Opacity
  opacity25: { opacity: 0.25 },
  opacity50: { opacity: 0.5 },
  opacity75: { opacity: 0.75 },
  opacity90: { opacity: 0.9 },
  
  // Overflow
  hidden: { overflow: 'hidden' },
  
  // Width & Height
  fullWidth: { width: '100%' },
  fullHeight: { height: '100%' },
  
  // Border
  border: {
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
});

// ========================================
// THEME HELPERS
// ========================================

// Helper function to get themed colors
export const getThemedColors = (isDark: boolean) => {
  return isDark ? colors.dark : colors.light;
};

// Helper function to get themed shadows
export const getThemedShadows = (isDark: boolean) => {
  return isDark ? darkShadows : shadows;
};

// Helper function to create themed styles
export const createThemedStyles = (isDark: boolean, styles: any) => {
  const themedColors = getThemedColors(isDark);
  const themedShadows = getThemedShadows(isDark);
  
  return {
    ...styles,
    colors: themedColors,
    shadows: themedShadows,
  };
};

// Export everything
export {
  layoutDimensions, screenHeight, screenWidth
};

export default globalStyles;
