import { Header } from '@/components';
import { fetchUserNotifications } from '@/store/reducers/notification';
import { Colors } from '@/theme/colors';
import Layout from '@/theme/layout';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Notification from './components/notification';

const TabbarNotice = () => {
  const dispatch = useAppDispatch();
  const notificationList = useAppSelector((state) => state.notification.list);

  useEffect(() => {
    dispatch(fetchUserNotifications({ refresh: false }));
  }, [dispatch]);

  return (
    <View style={Layout.fill}>
      <Header />
      <FlatList
        contentContainerStyle={styles.container}
        data={notificationList}
        keyExtractor={(_, index) => `notification_${index}`}
        renderItem={({ item }) => <Notification item={item} />}
      />
    </View>
  );
};

export default TabbarNotice;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 16,
  },
});
