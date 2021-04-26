import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import {
  fetchRecentTopics,
  fetchTopicByTab,
} from '@/store/reducers/home-topic';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { Colors } from '@/theme/colors';
import Topics from './components/topics';
import { RouteProp, useRoute } from '@react-navigation/core';

type ParamList = {
  TabbarIndex: {
    tab: string;
  };
};

const TabbarIndex = () => {
  const dispatch = useAppDispatch();
  const topicListMap = useAppSelector((state) => state.homeTopic.topicListMap);
  const pending = useAppSelector((state) => state.homeTopic.pending);
  const isRefreshing = useAppSelector((state) => state.homeTopic.isRefreshing);
  const recentPage = useAppSelector((state) => state.homeTopic.recentPage);

  const route = useRoute<RouteProp<ParamList, 'TabbarIndex'>>();

  const tab = useMemo(() => route.params?.tab, [route]);
  const refreshing = useMemo(() => isRefreshing === tab, [tab, isRefreshing]);
  const data = useMemo(() => topicListMap[tab], [topicListMap, tab]);
  const isLoading = useMemo(() => pending === tab, [tab, pending]);
  const hasMoreData = useMemo(() => tab === 'all', [tab]);

  useEffect(() => {
    dispatch(fetchTopicByTab({ tab: tab, refresh: false }));
  }, [dispatch, tab]);

  const listEmptyComponent = React.useMemo(() => {
    return (
      <View style={styles.loading}>
        {isLoading && <ActivityIndicator color={Colors.vi} size={48} />}
      </View>
    );
  }, [isLoading]);

  const listFooterComponent = React.useMemo(() => {
    if (isLoading || hasMoreData) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerText}>加载中</Text>
        </View>
      );
    }

    return (
      <View style={styles.footer}>
        {!hasMoreData && data && (
          <Text style={styles.footerText}>已经到底了</Text>
        )}
      </View>
    );
  }, [hasMoreData, data, isLoading]);

  return (
    <View style={styles.container}>
      <Topics
        data={data}
        isRefreshing={refreshing}
        ListEmptyComponent={listEmptyComponent}
        onControlRefresh={() => {
          dispatch(fetchTopicByTab({ tab: tab, refresh: true }));
        }}
        ListFooterComponent={listFooterComponent}
        onEndReached={() => {
          if (tab === 'all') {
            dispatch(fetchRecentTopics({ page: recentPage + 1 }));
          }
        }}
        onEndReachedThreshold={hasMoreData ? 0.1 : null}
      />
    </View>
  );
};

export default TabbarIndex;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  loading: {
    marginTop: '50%',
  },
  footer: {
    marginVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    color: Colors.secondaryText,
  },
});
