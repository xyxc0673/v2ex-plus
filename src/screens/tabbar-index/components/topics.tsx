import { ITopic } from '@/interfaces/topic';
import { Colors } from '@/theme/colors';
import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Topic from './topic';

interface IProps {
  data: Array<ITopic>;
  isRefreshing: boolean;
  listEmptyComponent: JSX.Element;
  ListHeaderComponent?: JSX.Element;
  contentContainerStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}

const TopicsComponent = ({
  data,
  isRefreshing,
  listEmptyComponent,
  ListHeaderComponent,
  contentContainerStyle = {},
  itemStyle = {},
}: IProps) => {
  return (
    <FlatList
      contentContainerStyle={[styles.topicList, contentContainerStyle]}
      data={data}
      keyExtractor={(item) => `topic_${item.id}`}
      renderItem={({ item }) => <Topic item={item} style={itemStyle} />}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          colors={[Colors.vi]}
          tintColor={Colors.vi}
        />
      }
      ListEmptyComponent={() => listEmptyComponent}
      ListHeaderComponent={() =>
        ListHeaderComponent ? ListHeaderComponent : null
      }
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
