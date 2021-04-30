import { DefaultTheme } from '@react-navigation/native';

export const Colors = {
  vi: '#FF8F1C',
  white: '#ffffff',
  black: '#000000',
  primary: '#f2994a',
  secondary: '#363433',
  secondaryText: '#737C79',
  grey: '#D8D8D8',
  lightGrey: '#F5F6FA',
  blue: '#0070C9',
  thirdText: '#D8D8D8',
  green: '#99e08b',
  grey10: '#FAFAFA',
  modalBackground: 'rgba(0, 0, 0, 0.1)',
};

export const defaultTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...Colors,
  },
};
