import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchTopicByTab } from '@/store/reducers/home-topic';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { Colors } from '@/theme/colors';
import { fetchBalance, fetchUserInfo } from '@/store/reducers/user';
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
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const pending = useAppSelector((state) => state.homeTopic.pending);
  const isRefreshing = useAppSelector((state) => state.homeTopic.isRefreshing);

  const route = useRoute<RouteProp<ParamList, 'TabbarIndex'>>();

  const tab = useMemo(() => route.params?.tab, [route]);
  const refreshing = useMemo(() => isRefreshing === tab, [tab, isRefreshing]);
  const data = useMemo(() => topicListMap[tab], [topicListMap, tab]);

  useEffect(() => {
    dispatch(fetchTopicByTab({ tab: tab, refresh: false }));
    if (isLogged) {
      dispatch(fetchUserInfo());
      dispatch(fetchBalance());
    }
  }, [dispatch, isLogged, tab]);

  const listEmptyComponent = React.useMemo(() => {
    return (
      <View style={styles.loading}>
        {pending === tab && <ActivityIndicator color={Colors.vi} size={48} />}
      </View>
    );
  }, [pending, tab]);

  return (
    <View style={styles.container}>
      <Topics
        data={data}
        isRefreshing={refreshing}
        ListEmptyComponent={listEmptyComponent}
        onControlRefresh={() => {
          dispatch(fetchTopicByTab({ tab: tab, refresh: true }));
        }}
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
});
