/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Beige-focused light-only palette with black accents
const beigeStrong = '#EADBC8'; // strong beige background
const beigeLighter = '#F5EDE3';
const beigeLightest = '#FBF7F2';
const beigeBorder = '#D6C4B2';
const black = '#111111';
const blackSoft = '#2B2B2B';
const graySoft = '#6B6B6B';

export const Colors = {
  light: {
    // Primary/Accent (black accent)
    primary: black,
    primaryLight: blackSoft,
    primaryDark: '#000000',

    // Secondary kept neutral/dark for subtle accents
    secondary: blackSoft,
    secondaryLight: '#3D3D3D',
    secondaryDark: '#000000',

    // Accent (alias to primary for consistency)
    accent: black,
    accentLight: blackSoft,
    accentDark: '#000000',

    // Status colors
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB',
    destructive: '#DC2626',

    // Neutral colors
    text: black,
    textSecondary: graySoft,
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',

    background: beigeStrong,
    backgroundSecondary: beigeLighter,
    backgroundTertiary: beigeLightest,

    surface: beigeLighter,
    surfaceSecondary: beigeLightest,
    surfaceTertiary: '#FFFFFF',

    border: beigeBorder,
    borderLight: '#E8DCD0',
    borderDark: '#C7B39D',

    // Legacy support
    tint: black,
    icon: graySoft,
    tabIconDefault: '#8C8C8C',
    tabIconSelected: black,
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
