import { ITopic } from '@/interfaces/topic';
import { Colors } from '@/theme/colors';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import Topic from './topic';

interface IProps {
  data: Array<ITopic>;
  isRefreshing: boolean;
  listEmptyComponent: JSX.Element;
}

const TopicsComponent = ({
  data,
  isRefreshing,
  listEmptyComponent,
}: IProps) => {
  return (
    <FlatList
      contentContainerStyle={styles.topicList}
      data={data}
      keyExtractor={(item) => `topic_${item.id}`}
      renderItem={({ item }) => <Topic item={item} />}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          colors={[Colors.vi]}
          tintColor={Colors.vi}
        />
      }
      ListEmptyComponent={() => listEmptyComponent}
    />
  );
};

const Topics = React.memo(TopicsComponent);
export default Topics;

const styles = StyleSheet.create({
  topicList: {
    marginHorizontal: 16,
  },
});
