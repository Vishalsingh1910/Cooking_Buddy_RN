const palette = {
  neutral100: "#FFFFFF",
  neutral200: "#FAFAFA", // AppColors.surface
  neutral300: "#F8F9FA", // AppColors.background
  neutral400: "#B6ACA6",
  neutral500: "#95A5A6", // AppColors.textLight
  neutral600: "#718096", // AppColors.textSecondary
  neutral700: "#3C3836",
  neutral800: "#2C3E50", // AppColors.textPrimary
  neutral900: "#000000",

  primary100: "#FFF8F3", // AppColors.accent
  primary200: "#E8C1B4",
  primary300: "#DDA28E",
  primary400: "#D28468",
  primary500: "#FF6B35", // AppColors.primary
  primary600: "#A54F31", // Darker primary

  secondary100: "#DCDDE9",
  secondary200: "#BCC0D6",
  secondary300: "#9196B9",
  secondary400: "#626894",
  secondary500: "#4ECDC4", // AppColors.secondary

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  secondary: "#FFB020",
  success: "#4CAF50",
  angry100: "#F2D6CD",
  angry500: "#F56565", // AppColors.error

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",

  appPrimary: "#FF6B35",
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral800,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral600,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral200,
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary500,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral500,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral300,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   */
  errorBackground: palette.angry100,
} as const
