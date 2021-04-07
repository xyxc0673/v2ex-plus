import { ITopic } from '@/interfaces/topic';
import { Colors } from '@/theme/colors';
import React from 'react';
import {
  FlatList,
  FlatListProps,
  RefreshControl,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Topic from './topic';

// Construct a type with the properties of T except for those in type K.
interface IProps extends Omit<FlatListProps<ITopic>, 'renderItem'> {
  itemStyle?: StyleProp<ViewStyle>;
}

const TopicsComponent = ({
  refreshing,
  contentContainerStyle = {},
  itemStyle = {},
  ...props
}: IProps) => {
  return (
    <FlatList
      contentContainerStyle={[styles.topicList, contentContainerStyle]}
      keyExtractor={(item) => `topic_${item.id}`}
      renderItem={({ item }) => <Topic item={item} style={itemStyle} />}
      refreshControl={
        <RefreshControl
          refreshing={refreshing || false}
          colors={[Colors.vi]}
          tintColor={Colors.vi}
        />
      }
      {...props}
    />
  );
};

const Topics = React.memo(TopicsComponent);
export default Topics;

const styles = StyleSheet.create({
  topicList: {
    paddingHorizontal: 16,
  },
});
