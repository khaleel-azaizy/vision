/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Modern Vision App Color Palette
const tintColorLight = '#6366F1'; // Indigo-500
const tintColorDark = '#A5B4FC'; // Indigo-300

export const Colors = {
  light: {
    // Primary colors
    primary: '#6366F1', // Indigo-500
    primaryLight: '#818CF8', // Indigo-400
    primaryDark: '#4F46E5', // Indigo-600
    
    // Secondary colors
    secondary: '#EC4899', // Pink-500
    secondaryLight: '#F472B6', // Pink-400
    secondaryDark: '#DB2777', // Pink-600
    
    // Accent colors
    accent: '#10B981', // Emerald-500
    accentLight: '#34D399', // Emerald-400
    accentDark: '#059669', // Emerald-600
    
    // Status colors
    success: '#10B981', // Emerald-500
    warning: '#F59E0B', // Amber-500
    error: '#EF4444', // Red-500
    info: '#3B82F6', // Blue-500
    
    // Neutral colors
    text: '#1F2937', // Gray-800
    textSecondary: '#6B7280', // Gray-500
    textTertiary: '#9CA3AF', // Gray-400
    textInverse: '#FFFFFF',
    
    background: '#FFFFFF',
    backgroundSecondary: '#F9FAFB', // Gray-50
    backgroundTertiary: '#F3F4F6', // Gray-100
    
    surface: '#FFFFFF',
    surfaceSecondary: '#F9FAFB', // Gray-50
    surfaceTertiary: '#F3F4F6', // Gray-100
    
    border: '#E5E7EB', // Gray-200
    borderLight: '#F3F4F6', // Gray-100
    borderDark: '#D1D5DB', // Gray-300
    
    // Legacy support
    tint: tintColorLight,
    icon: '#6B7280', // Gray-500
    tabIconDefault: '#9CA3AF', // Gray-400
    tabIconSelected: tintColorLight,
  },
  dark: {
    // Primary colors
    primary: '#818CF8', // Indigo-400
    primaryLight: '#A5B4FC', // Indigo-300
    primaryDark: '#6366F1', // Indigo-500
    
    // Secondary colors
    secondary: '#F472B6', // Pink-400
    secondaryLight: '#F9A8D4', // Pink-300
    secondaryDark: '#EC4899', // Pink-500
    
    // Accent colors
    accent: '#34D399', // Emerald-400
    accentLight: '#6EE7B7', // Emerald-300
    accentDark: '#10B981', // Emerald-500
    
    // Status colors
    success: '#34D399', // Emerald-400
    warning: '#FBBF24', // Amber-400
    error: '#F87171', // Red-400
    info: '#60A5FA', // Blue-400
    
    // Neutral colors
    text: '#F9FAFB', // Gray-50
    textSecondary: '#D1D5DB', // Gray-300
    textTertiary: '#9CA3AF', // Gray-400
    textInverse: '#1F2937', // Gray-800
    
    background: '#111827', // Gray-900
    backgroundSecondary: '#1F2937', // Gray-800
    backgroundTertiary: '#374151', // Gray-700
    
    surface: '#1F2937', // Gray-800
    surfaceSecondary: '#374151', // Gray-700
    surfaceTertiary: '#4B5563', // Gray-600
    
    border: '#374151', // Gray-700
    borderLight: '#4B5563', // Gray-600
    borderDark: '#6B7280', // Gray-500
    
    // Legacy support
    tint: tintColorDark,
    icon: '#9CA3AF', // Gray-400
    tabIconDefault: '#6B7280', // Gray-500
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
