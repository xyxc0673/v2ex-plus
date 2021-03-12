import { Header } from '@/components';
import { fetchUserNotifications } from '@/store/reducers/user';
import { Colors } from '@/theme/colors';
import Layout from '@/theme/layout';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Notification from './components/notification';

const TabbarNotice = () => {
  const dispatch = useAppDispatch();
  const notificationList = useAppSelector(
    (state) => state.user.notificationList,
  );

  useEffect(() => {
    dispatch(fetchUserNotifications(1));
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
