import { StyleSheet } from 'react-native';
import { colors, appDimensions, spacing, borderRadius, shadows } from './globalStyles';
 
export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: appDimensions.contentPadding,
  },
  
  header: {
    paddingTop: 60,
    paddingBottom: appDimensions.sectionSpacing,
    alignItems: 'center',
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },

  themeButton: {
    padding: appDimensions.cardSpacing,
    borderRadius: appDimensions.buttonRadius,
    backgroundColor: 'transparent',
  },
  
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: appDimensions.cardSpacing,
    textAlign: 'center',
  },
  
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
    color: colors.accent,
  },
  
  // Enhanced Quick Action Button
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.xl,
    ...shadows.large,
  },
  
  quickActionLight: {
    backgroundColor: colors.primary,
  },
  
  quickActionDark: {
    backgroundColor: colors.primaryDark,
  },
  
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  
  quickActionText: {
    flex: 1,
  },
  
  quickActionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#FFFFFF',
  },
  
  quickActionSubtitle: {
    fontSize: 15,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Recent Items Section
  section: {
    marginBottom: spacing.xl,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    color: colors.light.textPrimary,
  },
  
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: colors.light.backgroundSecondary,
    borderRadius: borderRadius.lg,
    marginBottom: 12,
    ...shadows.small,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  
  recentItemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.light.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  recentItemText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  
  recentItemTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
    color: colors.light.textPrimary,
  },
  
  recentItemMeta: {
    fontSize: 13,
    opacity: 0.6,
    fontWeight: '500',
    color: colors.light.textSecondary,
  },
});