export * from './homeStyles';
export * from './theme';
export * from './commonStyles';

// Re-export commonly used items for convenience
export { 
  globalStyles as styles,
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  darkShadows,
  layoutDimensions,
  getThemedColors,
  getThemedShadows,
  createThemedStyles,
} from './globalStyles';

export { homeStyles } from './homeStyles';
export { lightTheme, darkTheme, themedStyles } from './theme';
export { 
  commonStyles,
  createButtonStyle,
  createTextStyle,
} from './commonStyles';