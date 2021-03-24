import { Header } from '@/components';
import Loading from '@/components/loading';
import { fetchUserNotifications } from '@/store/reducers/notification';
import { Colors } from '@/theme/colors';
import Layout from '@/theme/layout';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text } from 'react-native';
import Notification from './components/notification';

const TabbarNotice = () => {
  const dispatch = useAppDispatch();
  const notificationList = useAppSelector((state) => state.notification.list);
  const pending = useAppSelector((state) => state.notification.pending);
  const isRefreshing = useAppSelector(
    (state) => state.notification.isRefreshing,
  );
  const maxPage = useAppSelector((state) => state.notification.maxPage);
  const currentPage = useAppSelector((state) => state.notification.currentPage);

  const noMore = maxPage === currentPage;

  useEffect(() => {
    dispatch(fetchUserNotifications({ refresh: false, isFirstFetching: true }));
  }, [dispatch]);

  const listEmptyComponent = React.useMemo(() => {
    return (
      <View style={styles.loading}>
        <Loading visible={pending === 'pending'} />
      </View>
    );
  }, [pending]);

  const ListFooterComponent = React.useMemo(() => {
    return (
      <View style={styles.listFooter}>
        <Text>{noMore ? '没有更多的消息了' : '加载中'}</Text>
      </View>
    );
  }, [noMore]);

  return (
    <View style={Layout.fill}>
      <Header />
      <FlatList
        contentContainerStyle={styles.container}
        data={notificationList}
        keyExtractor={(_, index) => `notification_${index}`}
        renderItem={({ item }) => <Notification item={item} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              dispatch(fetchUserNotifications({ refresh: true }));
            }}
            colors={[Colors.vi]}
            tintColor={Colors.vi}
          />
        }
        ListEmptyComponent={() => listEmptyComponent}
        onEndReached={() =>
          dispatch(fetchUserNotifications({ refresh: false }))
        }
        onEndReachedThreshold={noMore ? null : 0.1}
        ListFooterComponent={() => ListFooterComponent}
      />
    </View>
  );
};

export default TabbarNotice;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 16,
    flexGrow: 1,
  },
  loading: {
    marginTop: '50%',
  },
  listFooter: {
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
});
