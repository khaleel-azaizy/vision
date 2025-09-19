import { StyleSheet } from 'react-native';

// Light theme colors
export const lightTheme = {
  primary: '#007AFF',
  primaryDark: '#0056CC',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  
  background: '#FFFFFF',
  backgroundSecondary: '#F8F8F8',
  backgroundTertiary: '#F0F0F0',
  
  surface: '#FFFFFF',
  surfaceSecondary: '#F5F5F5',
  
  textPrimary: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textInverse: '#FFFFFF',
  
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  
  shadow: 'rgba(0, 0, 0, 0.1)',
};

// Dark theme colors
export const darkTheme = {
  primary: '#0A84FF',
  primaryDark: '#0056CC',
  secondary: '#5E5CE6',
  success: '#30D158',
  warning: '#FF9F0A',
  error: '#FF453A',
  
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  backgroundTertiary: '#2C2C2E',
  
  surface: '#1C1C1E',
  surfaceSecondary: '#2C2C2E',
  
  textPrimary: '#FFFFFF',
  textSecondary: '#99999B',
  textTertiary: '#666668',
  textInverse: '#000000',
  
  border: '#3A3A3C',
  borderLight: '#2C2C2E',
  
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export type Theme = typeof lightTheme;

// Helper function to create themed styles
export const createThemedStyles = <T extends StyleSheet.NamedStyles<T>>(
  styleFunction: (theme: Theme) => T
) => {
  return {
    light: StyleSheet.create(styleFunction(lightTheme)),
    dark: StyleSheet.create(styleFunction(darkTheme)),
  };
};

// Common themed styles
export const themedStyles = createThemedStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  
  card: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: theme.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  
  primaryButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  primaryButtonText: {
    color: theme.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.primary,
  },
  
  secondaryButtonText: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: theme.surface,
    color: theme.textPrimary,
  },
  
  text: {
    color: theme.textPrimary,
  },
  
  textSecondary: {
    color: theme.textSecondary,
  },
  
  textTertiary: {
    color: theme.textTertiary,
  },
}));