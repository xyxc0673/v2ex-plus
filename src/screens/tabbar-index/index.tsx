import React, { useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  fetchRecentTopics,
  fetchTopicByTab,
} from '@/store/reducers/home-topic';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { Colors } from '@/theme/colors';
import Topics from './components/topics';
import { RouteProp, useRoute } from '@react-navigation/core';
import { navigate } from '@/navigations/root';
import { ROUTES } from '@/config/route';

type ParamList = {
  TabbarIndex: {
    tab: string;
  };
};

const TabbarIndex = () => {
  const dispatch = useAppDispatch();
  const topicListMap = useAppSelector((state) => state.homeTopic.topicListMap);
  const recentPage = useAppSelector((state) => state.homeTopic.recentPage);
  const isLogged = useAppSelector((state) => state.user.isLogged);

  const route = useRoute<RouteProp<ParamList, 'TabbarIndex'>>();

  const tab = useMemo(() => route.params?.tab, [route]);
  const refreshing = useMemo(() => topicListMap[tab].refreshing, [
    tab,
    topicListMap,
  ]);
  const data = useMemo(() => topicListMap[tab].data, [topicListMap, tab]);
  const isLoading = useMemo(() => topicListMap[tab].pending === 'pending', [
    tab,
    topicListMap,
  ]);
  const hasMoreData = useMemo(() => tab === 'all' && isLogged, [tab, isLogged]);
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

    if (tab === 'all' && !hasMoreData) {
      return (
        <TouchableOpacity
          style={styles.footer}
          onPress={() => navigate(ROUTES.LOGIN, null)}>
          <Text style={styles.footerText}>登录 V2EX 以查看更多的主题</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.footer}>
        {!hasMoreData && data && (
          <Text style={styles.footerText}>已经到底了</Text>
        )}
      </View>
    );
  }, [hasMoreData, data, isLoading, tab]);

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
          if (hasMoreData) {
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
