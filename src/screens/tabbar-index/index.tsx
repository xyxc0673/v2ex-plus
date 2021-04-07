import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Header } from '@/components';
import { fetchTopicByTab } from '@/store/reducers/home-topic';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { Colors } from '@/theme/colors';
import { fetchBalance, fetchUserInfo } from '@/store/reducers/user';
import Topics from './components/topics';

const TabbarIndex = () => {
  const dispatch = useAppDispatch();
  const topicList = useAppSelector((state) => state.homeTopic.topicList);
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const isLoading = useAppSelector((state) => state.homeTopic.pending);
  const isRefreshing = useAppSelector((state) => state.homeTopic.isRefreshing);

  useEffect(() => {
    dispatch(fetchTopicByTab({ tab: 'all', refresh: false }));
    if (isLogged) {
      dispatch(fetchUserInfo());
      dispatch(fetchBalance());
    }
  }, [dispatch, isLogged]);

  const listEmptyComponent = React.useMemo(() => {
    return (
      <View style={styles.loading}>
        {isLoading === 'pending' && (
          <ActivityIndicator color={Colors.vi} size={48} />
        )}
      </View>
    );
  }, [isLoading]);

  return (
    <View style={styles.container}>
      <Header />
      <Topics
        data={topicList}
        refreshing={isRefreshing}
        ListEmptyComponent={listEmptyComponent}
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
