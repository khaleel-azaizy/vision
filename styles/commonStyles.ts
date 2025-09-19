import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from './globalStyles';

// Common component style patterns
export const commonStyles = StyleSheet.create({
  // Flexbox utilities
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexAround: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  flexStart: {
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flexEnd: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  // Positioning
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  absoluteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  absoluteBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  // Common button patterns
  circleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  smallCircleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  },
  roundedButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Card variations
  elevatedCard: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.large,
  },
  flatCard: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  compactCard: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.small,
  },

  // Input variations
  searchInput: {
    height: 44,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.backgroundSecondary,
    paddingHorizontal: spacing.lg,
    fontSize: typography.sizes.base,
  },
  underlineInput: {
    borderBottomWidth: 2,
    borderBottomColor: colors.light.border,
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: spacing.sm,
  },

  // List item patterns
  simpleListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.borderLight,
  },
  avatarListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  cardListItem: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.xs,
    marginHorizontal: spacing.lg,
    ...shadows.small,
  },

  // Avatar styles
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surfaceTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.light.surfaceTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.surfaceTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Status indicators
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    position: 'absolute',
    top: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.light.background,
  },
  offlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.light.textTertiary,
    position: 'absolute',
    top: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.light.background,
  },

  // Separator styles
  thinSeparator: {
    height: 1,
    backgroundColor: colors.light.borderLight,
  },
  thickSeparator: {
    height: 8,
    backgroundColor: colors.light.backgroundSecondary,
  },
  spacedSeparator: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: spacing.md,
    marginHorizontal: spacing.lg,
  },

  // Loading and empty states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  emptyStateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.light.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  // Form layouts
  formField: {
    marginBottom: spacing.lg,
  },
  formFieldInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  formLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '600' as const,
    color: colors.light.textSecondary,
    marginBottom: spacing.xs,
  },
  formError: {
    fontSize: typography.sizes.xs,
    color: colors.error,
    marginTop: spacing.xs,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.light.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    margin: spacing.xl,
    maxWidth: '90%',
    ...shadows.xl,
  },
  bottomSheetContainer: {
    backgroundColor: colors.light.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    paddingBottom: spacing['3xl'],
  },

  // Navigation styles
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Image styles
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  thumbnailImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.light.surfaceSecondary,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.light.surfaceSecondary,
  },
});

// Helper functions for dynamic styles
export const createButtonStyle = (
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' = 'primary',
  size: 'small' | 'medium' | 'large' = 'medium',
  disabled: boolean = false
): ViewStyle => {
  const baseStyle: ViewStyle = {
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  };

  // Size variations
  const sizeStyles = {
    small: { height: 36, paddingHorizontal: spacing.md },
    medium: { height: 48, paddingHorizontal: spacing.lg },
    large: { height: 56, paddingHorizontal: spacing.xl },
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: disabled ? colors.light.surfaceTertiary : colors.primary,
      ...shadows.small,
    },
    secondary: {
      backgroundColor: disabled ? colors.light.surfaceTertiary : colors.light.surfaceSecondary,
      borderWidth: 1,
      borderColor: colors.light.border,
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: disabled ? colors.light.border : colors.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
    },
  };

  return {
    ...baseStyle,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };
};

export const createTextStyle = (
  variant: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'body' | 'caption' = 'body',
  color?: string
): TextStyle => {
  const variants = {
    h1: {
      fontSize: typography.sizes['4xl'],
      fontWeight: '700' as const,
      lineHeight: typography.sizes['4xl'] * typography.lineHeights.tight,
    },
    h2: {
      fontSize: typography.sizes['3xl'],
      fontWeight: '700' as const,
      lineHeight: typography.sizes['3xl'] * typography.lineHeights.tight,
    },
    h3: {
      fontSize: typography.sizes['2xl'],
      fontWeight: '600' as const,
      lineHeight: typography.sizes['2xl'] * typography.lineHeights.tight,
    },
    h4: {
      fontSize: typography.sizes.xl,
      fontWeight: '600' as const,
      lineHeight: typography.sizes.xl * typography.lineHeights.normal,
    },
    h5: {
      fontSize: typography.sizes.lg,
      fontWeight: '500' as const,
      lineHeight: typography.sizes.lg * typography.lineHeights.normal,
    },
    body: {
      fontSize: typography.sizes.base,
      fontWeight: '400' as const,
      lineHeight: typography.sizes.base * typography.lineHeights.normal,
    },
    caption: {
      fontSize: typography.sizes.sm,
      fontWeight: '400' as const,
      lineHeight: typography.sizes.sm * typography.lineHeights.normal,
    },
  };

  return {
    ...variants[variant],
    color: color || colors.light.textPrimary,
    fontFamily: typography.fonts.regular,
  };
};

export default commonStyles;