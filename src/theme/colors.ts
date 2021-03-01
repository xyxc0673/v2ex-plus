import { DefaultTheme } from '@react-navigation/native';

export const Colors = {
  vi: '#FFCB89',
  white: '#ffffff',
  black: '#000000',
  primary: '#f2994a',
  secondary: '#363433',
  secondaryText: '#737C79',
  grey: '#D8D8D8',
  lightGrey: '#F5F6FA',
  blue: '#0070C9',
  thirdText: '#D8D8D8',
};

export const defaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...Colors,
  },
};
