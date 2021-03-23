import { Header } from '@/components';
import Loading from '@/components/loading';
import { fetchUserNotifications } from '@/store/reducers/notification';
import { Colors } from '@/theme/colors';
import Layout from '@/theme/layout';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import Notification from './components/notification';

const TabbarNotice = () => {
  const dispatch = useAppDispatch();
  const notificationList = useAppSelector((state) => state.notification.list);
  const pending = useAppSelector((state) => state.notification.pending);
  const isRefreshing = useAppSelector(
    (state) => state.notification.isRefreshing,
  );

  useEffect(() => {
    dispatch(fetchUserNotifications({ refresh: false }));
  }, [dispatch]);

  const listEmptyComponent = React.useMemo(() => {
    return (
      <View style={styles.loading}>
        <Loading visible={pending === 'pending'} />
      </View>
    );
  }, [pending]);

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
});
