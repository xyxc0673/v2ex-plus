import { Avatar } from '@/components';
import { fetchUserTopics } from '@/store/reducers/user';
import { Colors } from '@/theme/colors';
import Layout from '@/theme/layout';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Topic from './components/topic';

type ParamList = {
  Detail: {
    userId: number;
    username: string;
  };
};

const Profile = () => {
  const route = useRoute<RouteProp<ParamList, 'Detail'>>();

  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const userTopicList = useAppSelector((state) => state.user.userTopicList);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: userInfo.username });
  }, [navigation, userInfo]);

  useEffect(() => {
    const { username } = route.params;
    dispatch(fetchUserTopics({ username, page: 1 }));
  }, [dispatch, route.params]);

  const renderHeader = React.useMemo(() => {
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
      </>
    );
  }, [userInfo]);

  return (
    <View style={[Layout.fill, styles.container]}>
      <Tabs.Container
        HeaderComponent={() => renderHeader}
        headerContainerStyle={styles.tabHeaderContainer}
        initialTabName="Topic"
        TabBarComponent={(props) => (
          <MaterialTabBar {...props} indicatorStyle={styles.tabIndicator} />
        )}>
        <Tabs.Tab name="Info" label="资料">
          <View />
        </Tabs.Tab>
        <Tabs.Tab name="Topic" label="帖子">
          <Tabs.FlatList
            data={userTopicList}
            contentContainerStyle={[styles.tabContent]}
            keyExtractor={(item) => `user_topic_${item.id}`}
            renderItem={({ item }) => <Topic item={item} />}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Reply" label="回复">
          <View />
        </Tabs.Tab>
      </Tabs.Container>
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
  tabHeaderContainer: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    elevation: 0,
  },
  tabIndicator: {
    backgroundColor: Colors.vi,
  },
  tabContent: {
    backgroundColor: Colors.lightGrey,
    flexGrow: 1,
  },
});
