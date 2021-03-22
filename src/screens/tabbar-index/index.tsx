import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Header } from '@/components';
import { fetchTopicByTab } from '@/store/reducers/topic';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { Colors } from '@/theme/colors';
import Topic from './components/topic';
import { fetchBalance, fetchUserInfo } from '@/store/reducers/user';

const TabbarIndex = () => {
  const dispatch = useAppDispatch();
  const topicList = useAppSelector((state) => state.topic.topicList);
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const isLoading = useAppSelector((state) => state.topic.pending);
  const isRefreshing = useAppSelector((state) => state.topic.isRefreshing);

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

      <FlatList
        contentContainerStyle={styles.topicList}
        data={topicList}
        keyExtractor={(item) => `topic_${item.id}`}
        renderItem={({ item }) => <Topic item={item} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              dispatch(fetchTopicByTab({ tab: 'all', refresh: true }));
            }}
            colors={[Colors.vi]}
            tintColor={Colors.vi}
          />
        }
        ListEmptyComponent={() => listEmptyComponent}
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
  topicList: {
    marginHorizontal: 16,
  },
  loading: {
    marginTop: '50%',
  },
});
