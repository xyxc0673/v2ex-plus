import { StyleSheet } from 'react-native';
import { colors } from './colors';

const Common = StyleSheet.create({
  node: {
    fontSize: 12,
    paddingVertical: 1,
    paddingHorizontal: 8,
    backgroundColor: colors.lightGrey,
    borderRadius: 4,
    color: colors.secondaryText,
  },
  nodeSmall: {
    fontSize: 10,
  },
});

export default Common;
