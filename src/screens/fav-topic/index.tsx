import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { Colors } from '@/theme/colors';
import Topics from '../tabbar-index/components/topics';
import { RouteProp, useRoute } from '@react-navigation/core';
import {
  fetchTopicsCollection,
  nodeTopicAction,
} from '@/store/reducers/node-topic';

type ParamList = {
  NodeTopic: {
    nodeName: string;
    nodeTitle: string;
  };
};

const FavTopic = () => {
  const dispatch = useAppDispatch();
  const topicList = useAppSelector((state) => state.nodeTopic.topicList);
  const isLoading = useAppSelector((state) => state.nodeTopic.pending);
  const isRefreshing = useAppSelector((state) => state.nodeTopic.isRefreshing);
  const currPage = useAppSelector((state) => state.nodeTopic.currPage);
  const maxPage = useAppSelector((state) => state.nodeTopic.maxPage) || 1;
  const [noMore, setNoMore] = useState(false);

  const route = useRoute<RouteProp<ParamList, 'NodeTopic'>>();

  useEffect(() => {
    dispatch(fetchTopicsCollection({ refresh: true }));

    return () => {
      dispatch(nodeTopicAction.resetNodeTopic());
    };
  }, [dispatch, route]);

  useEffect(() => {
    setNoMore(currPage >= (maxPage || 1));
  }, [currPage, maxPage]);

  const listEmptyComponent = React.useMemo(() => {
    return (
      <View style={styles.loading}>
        {isLoading === 'pending' && (
          <ActivityIndicator color={Colors.vi} size={48} />
        )}
      </View>
    );
  }, [isLoading]);

  const ListFooterComponent = React.useMemo(() => {
    return (
      <>
        <View style={styles.listFooter}>
          <Text style={styles.listFooterText}>
            {noMore ? '没有更多的主题了' : '加载中'}
          </Text>
        </View>
      </>
    );
  }, [noMore]);

  return (
    <View style={styles.container}>
      <Topics
        data={topicList}
        refreshing={isRefreshing}
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={styles.listContainer}
        itemStyle={styles.itemStyle}
        onEndReached={() => {
          if (currPage >= maxPage) {
            return;
          }
          dispatch(fetchTopicsCollection({ refresh: false }));
        }}
        onEndReachedThreshold={noMore ? null : 0.01}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
};

export default FavTopic;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  loading: {
    marginTop: '50%',
  },
  listContainer: {
    flexGrow: 1,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    paddingHorizontal: 0,
  },
  itemStyle: {
    paddingHorizontal: 16,
  },
  listFooter: {
    marginVertical: 16,
    marginBottom: 30,
    alignItems: 'center',
  },
  listFooterText: {
    color: Colors.secondaryText,
    fontSize: 12,
  },
});
