import { Avatar } from '@/components';
import { fetchUserInfoById, fetchUserTopics } from '@/store/reducers/user';
import { Colors } from '@/theme/colors';
import Layout from '@/theme/layout';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Topic from './components/topic';

type ParamList = {
  Detail: {
    userId: number;
    username: string;
  };
};

const TAB = [
  {
    key: 'topic',
    name: '主题',
  },
  {
    key: 'reply',
    name: '回复',
  },
  {
    key: 'about',
    name: '关于',
  },
];

const Profile = () => {
  const [currTab, setCurrTab] = useState(TAB[0].key);
  const route = useRoute<RouteProp<ParamList, 'Detail'>>();

  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const userTopicList = useAppSelector((state) => state.user.userTopicList);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: userInfo.username });
  }, [navigation, userInfo]);

  useEffect(() => {
    const { userId, username } = route.params;
    dispatch(fetchUserInfoById(userId));
    dispatch(fetchUserTopics(username));
  }, [dispatch, route.params]);

  const renderHeader = React.useMemo(() => {
    if (!userInfo.id) {
      return <View />;
    }
    return (
      <>
        <View style={[Layout.row, styles.userInfoHeader]}>
          <View style={[Layout.row, Layout.fullWidth]}>
            <Avatar size={60} source={{ uri: userInfo.avatar_large }} />
            <View style={styles.userInfoHeaderCenter}>
              <Text style={styles.username}>{userInfo.username}</Text>
              <View>
                <Text style={styles.created}>{`${userInfo.id} 号会员`}</Text>
                <Text style={styles.created}>
                  {`加入于 ${dayjs
                    .unix(userInfo.created)
                    .format('YYYY-MM-DD HH:mm:ss')}`}
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity style={styles.follow}>
                <Text style={styles.followText}>关注</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={[Layout.row, styles.tabs]}>
          {TAB.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, currTab === tab.key && styles.tabActive]}
              onPress={() => setCurrTab(tab.key)}>
              <Text
                style={[
                  styles.tabTitle,
                  currTab === tab.key && styles.tabTitleActive,
                ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </>
    );
  }, [currTab, userInfo]);

  return (
    <View style={[Layout.fill, styles.container]}>
      <FlatList
        data={userTopicList}
        contentContainerStyle={[styles.tabContent]}
        ListHeaderComponent={renderHeader}
        keyExtractor={(item) => `user_topic_${item.id}`}
        renderItem={({ item }) => <Topic item={item} />}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  userInfoHeader: {
    paddingHorizontal: 8,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  userInfoHeaderCenter: {
    marginLeft: 8,
    justifyContent: 'space-between',
    flex: 1,
  },
  username: {
    fontSize: 18,
  },
  created: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginRight: 8,
  },
  follow: {
    backgroundColor: Colors.vi,
    paddingVertical: 4,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  followText: {
    color: Colors.black,
    fontSize: 12,
  },
  tabs: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.white,
  },
  tab: {
    paddingVertical: 2,
    marginRight: 32,
    justifyContent: 'center',
  },
  tabActive: {},
  tabTitle: {
    fontSize: 16,
  },
  tabTitleActive: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContent: {
    backgroundColor: Colors.lightGrey,
    flexGrow: 1,
  },
});
