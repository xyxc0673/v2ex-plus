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
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.lightGrey,
    marginVertical: 8,
  },
  headerRight: {
    marginRight: 16,
    alignItems: 'center',
  },
  headerRightText: {
    fontSize: 16,
  },
});

export default Common;
