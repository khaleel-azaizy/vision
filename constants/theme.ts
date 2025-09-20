/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Modern cool-toned palette (Indigo/Teal with soft neutrals)
const indigo600 = '#4F46E5';
const indigo400 = '#818CF8';
const indigo800 = '#3730A3';

const teal500 = '#14B8A6';
const teal400 = '#2DD4BF';
const teal700 = '#0F766E';

const orange500 = '#F97316';
const orange300 = '#FDBA74';
const orange700 = '#C2410C';

const slate900 = '#0F172A';
const slate600 = '#475569';
const slate400 = '#94A3B8';
const white = '#FFFFFF';

const bg = '#F6F8FB';
const bg2 = '#EEF2F7';
const bg3 = '#E2E8F0';
const surface = '#FFFFFF';
const surface2 = '#F8FAFC';
const surface3 = '#F1F5F9';
const border = '#E5E7EB';
const borderLight = '#EEF2F7';
const borderDark = '#CBD5E1';

export const Colors = {
  light: {
    // Primary / Secondary / Accent
    primary: indigo600,
    primaryLight: indigo400,
    primaryDark: indigo800,

    secondary: teal500,
    secondaryLight: teal400,
    secondaryDark: teal700,

    accent: orange500,
    accentLight: orange300,
    accentDark: orange700,

    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    destructive: '#EF4444',

    // Neutral colors
    text: slate900,
    textSecondary: slate600,
    textTertiary: slate400,
    textInverse: white,

    background: bg,
    backgroundSecondary: bg2,
    backgroundTertiary: bg3,

    surface: surface,
    surfaceSecondary: surface2,
    surfaceTertiary: surface3,

    border: border,
    borderLight: borderLight,
    borderDark: borderDark,

    // Legacy support
    tint: indigo600,
    icon: slate600,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: indigo600,
  },
  // Force dark theme to mirror light for a light-only experience
  dark: {} as any,
} as const;

// Mirror light palette to dark to enforce light-only scheme safely
// (avoids undefined lookups when system is dark)
(Colors as any).dark = { ...(Colors as any).light };

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
