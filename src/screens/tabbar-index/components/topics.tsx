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
  isRefreshing: boolean;
  onControlRefresh: () => void;
}

const TopicsComponent = ({
  isRefreshing,
  contentContainerStyle = {},
  itemStyle = {},
  onControlRefresh,
  ...props
}: IProps) => {
  return (
    <FlatList
      contentContainerStyle={[styles.topicList, contentContainerStyle]}
      keyExtractor={(item) => `topic_${item.id}`}
      renderItem={({ item }) => <Topic item={item} style={itemStyle} />}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          colors={[Colors.vi]}
          tintColor={Colors.vi}
          onRefresh={onControlRefresh}
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
    paddingVertical: 8,
  },
});
