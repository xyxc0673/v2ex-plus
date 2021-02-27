import { StyleSheet } from 'react-native';
import { Colors } from './colors';

const Common = StyleSheet.create({
  node: {
    fontSize: 12,
    paddingVertical: 1,
    paddingHorizontal: 8,
    backgroundColor: Colors.lightGrey,
    borderRadius: 4,
    color: Colors.secondaryText,
  },
  nodeSmall: {
    fontSize: 10,
  },
});

export default Common;
