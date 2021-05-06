import Loading from '@/components/loading';
import { ROUTES } from '@/config/route';
import { navigate } from '@/navigations/root';
import { fetchUserNotifications } from '@/store/reducers/notification';
import { Colors } from '@/theme/colors';
import Common from '@/theme/common';
import Layout from '@/theme/layout';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import React, { useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import Notification from './components/notification';

const TabbarNotice = () => {
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector((state) => state.user.isLogged);
  const notificationList = useAppSelector((state) => state.notification.list);
  const pending = useAppSelector((state) => state.notification.pending);
  const isRefreshing = useAppSelector(
    (state) => state.notification.isRefreshing,
  );
  const maxPage = useAppSelector((state) => state.notification.maxPage);
  const currentPage = useAppSelector((state) => state.notification.currentPage);

  const noMore = maxPage === currentPage;

  useEffect(() => {
    if (isLogged) {
      dispatch(
        fetchUserNotifications({ refresh: false, isFirstFetching: true }),
      );
    }
  }, [isLogged, dispatch]);

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
    <View style={[Layout.fill, styles.screen]}>
      {!isLogged && (
        <View style={styles.notLogged}>
          <Text>空空如也</Text>
          <TouchableOpacity
            onPress={() => {
              navigate(ROUTES.LOGIN, null);
            }}>
            <Text style={styles.notLoggedText}>点击此处登录 V2EX 账号</Text>
          </TouchableOpacity>
        </View>
      )}
      {isLogged && (
        <FlatList
          contentContainerStyle={styles.container}
          data={notificationList}
          keyExtractor={(_, index) => `notification_${index}`}
          renderItem={({ item }) => (
            <>
              <Notification item={item} />
              <View style={Common.divider} />
            </>
          )}
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
      )}
    </View>
  );
};

export default TabbarNotice;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.white,
    flexGrow: 1,
  },
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
  notLogged: {
    marginTop: '50%',
    alignSelf: 'center',

    alignItems: 'center',
  },
  notLoggedText: {
    backgroundColor: Colors.lightGrey,
    marginTop: 16,
    padding: 10,
    borderRadius: 4,
    fontSize: 12,
  },
});
