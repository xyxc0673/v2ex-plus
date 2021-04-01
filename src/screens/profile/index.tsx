import { Avatar } from '@/components';
import {
  fetchUserProfile,
  fetchUserReplies,
  fetchUserTopics,
  profileActions,
} from '@/store/reducers/profile';
import { Colors } from '@/theme/colors';
import Layout from '@/theme/layout';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { MaterialTabBar, Tabs } from 'react-native-collapsible-tab-view';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Topic from './components/topic';
import Reply from './components/reply';
import Information from './components/Information';

type ParamList = {
  Detail: {
    userId: number;
    username: string;
  };
};

const Profile = () => {
  const route = useRoute<RouteProp<ParamList, 'Detail'>>();

  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.profile.userInfo);
  const userTopicList = useAppSelector((state) => state.profile.userTopicList);
  const userReplyList = useAppSelector((state) => state.profile.userReplyList);
  const user = useAppSelector((state) => state.user.user);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: userInfo.username });
  }, [navigation, userInfo]);

  useEffect(() => {
    const { username } = route.params;
    dispatch(fetchUserProfile(username));
    dispatch(fetchUserTopics({ username, page: 1 }));
    dispatch(fetchUserReplies({ username, page: 1 }));

    return () => {
      dispatch(profileActions.reset());
    };
  }, [dispatch, route.params]);

  const renderHeader = React.useMemo(() => {
    return (
      <>
        <View style={[Layout.row, styles.userInfoHeader]}>
          <View style={[Layout.row, Layout.fullWidth]}>
            <View style={styles.userInfoHeaderLeft}>
              <Avatar size={60} source={{ uri: userInfo.avatar }} />
              {userInfo.isOnline && <View style={styles.online} />}
            </View>
            <View style={styles.userInfoHeaderCenter}>
              <Text style={styles.username}>{userInfo.username}</Text>
              <Text style={styles.bio}>{userInfo.bio}</Text>
              <View />
            </View>
            <View>
              {userInfo.username !== user.username && (
                <>
                  <TouchableOpacity style={[styles.btn, styles.btnFollow]}>
                    <Text style={styles.btnText}>关注</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </>
    );
  }, [user, userInfo]);

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
          <Tabs.ScrollView contentContainerStyle={[styles.tabContent]}>
            <Information data={userInfo} />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name="Topic" label="主题">
          <Tabs.FlatList
            data={userTopicList}
            contentContainerStyle={[styles.tabContent]}
            keyExtractor={(item) => `user_topic_${item.id}`}
            renderItem={({ item }) => <Topic item={item} />}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Reply" label="回复">
          <Tabs.FlatList
            data={userReplyList}
            contentContainerStyle={[styles.tabContent]}
            keyExtractor={(item, index) => `user_topic_${index}`}
            renderItem={({ item }) => <Reply item={item} />}
          />
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
    padding: 16,
    paddingTop: 24,
    backgroundColor: Colors.white,
  },
  userInfoHeaderLeft: {
    alignItems: 'center',
  },
  userInfoHeaderCenter: {
    marginLeft: 12,
    justifyContent: 'flex-start',
    flex: 1,
  },
  username: {
    fontSize: 18,
  },
  bio: {
    fontSize: 14,
    marginTop: 4,
    color: Colors.secondaryText,
  },
  online: {
    fontSize: 12,
    marginTop: 4,
    width: 16,
    height: 16,
    borderRadius: 16,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: Colors.green,
  },

  btn: {
    backgroundColor: Colors.vi,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  btnText: {
    color: Colors.white,
    fontSize: 14,
  },
  btnFollow: {
    backgroundColor: Colors.vi,
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
    marginTop: 8,
  },
});
