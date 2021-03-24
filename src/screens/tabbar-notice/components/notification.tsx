import { Avatar } from '@/components';
import { INotification } from '@/interfaces/notification';
import { navigate } from '@/navigations/root';
import { Colors } from '@/theme/colors';
import Layout from '@/theme/layout';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IProps {
  item: INotification;
}

const TYPE = {
  reply: '回复了你',
  refer: '提到了你',
  collect: '收藏了你发布的主题',
  thanks: '感谢了你发布的主题',
};

const Notification = ({ item: notification }: IProps) => {
  const openTopic = (topicId: number) => {
    navigate('topic', { topic: { id: topicId } });
  };

  return (
    <View style={[Layout.row, Layout.fullWidth, styles.notification]}>
      <Avatar
        username={notification.username}
        source={{ uri: notification.avatar }}
        size={28}
      />
      <View style={styles.notificationInfo}>
        <View style={[Layout.row, Layout.fullWidth, styles.usernameContainer]}>
          <Text style={styles.username}>{notification.username}</Text>
          <Text style={styles.createdAt}>{notification.createdAt}</Text>
        </View>
        <Text style={styles.type}>{TYPE[notification.type]}</Text>
        {notification.payload !== '' && (
          <Text style={styles.payload}>{notification.payload}</Text>
        )}
        <TouchableOpacity onPress={() => openTopic(notification.topicId)}>
          <Text style={styles.topicTitle}>{notification.topicTitle}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(Notification);

const styles = StyleSheet.create({
  notification: {
    marginBottom: 24,
  },
  notificationInfo: {
    flex: 1,
    marginLeft: 8,
  },
  usernameContainer: {
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 14,
  },
  createdAt: {
    fontSize: 10,
    color: Colors.secondaryText,
  },
  type: {
    fontSize: 12,
    marginTop: 2,
    color: Colors.secondaryText,
  },
  payload: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.black,
  },
  topicTitle: {
    marginTop: 8,
    padding: 8,
    backgroundColor: Colors.lightGrey,
    color: Colors.secondaryText,
    fontSize: 12,
    borderRadius: 4,
  },
});
