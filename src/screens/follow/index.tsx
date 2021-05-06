import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { Colors } from '@/theme/colors';
import { Avatar } from '@/components';
import { fetchFollowing, followingActions } from '@/store/reducers/following';
import Layout from '@/theme/layout';
import Common from '@/theme/common';
import { navigate } from '@/navigations/root';
import { ROUTES } from '@/config/route';

type ParamList = {
  NodeTopic: {
    nodeName: string;
    nodeTitle: string;
  };
};

const Follow = () => {
  const dispatch = useAppDispatch();
  const followingList = useAppSelector(
    (state) => state.following.followingList,
  );
  const isLoading = useAppSelector((state) => state.following.pending);
  const refreshing = useAppSelector((state) => state.following.isRefreshing);

  useEffect(() => {
    dispatch(fetchFollowing({ refresh: true }));

    return () => {
      dispatch(followingActions.reset());
    };
  }, [dispatch]);

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
      <FlatList
        data={followingList}
        refreshing={refreshing}
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.username}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || false}
            colors={[Colors.vi]}
            tintColor={Colors.vi}
          />
        }
        renderItem={({ item }) => {
          return (
            <>
              <TouchableOpacity
                style={[Layout.row, styles.item]}
                onPress={() => {
                  navigate(ROUTES.PROFILE, { username: item.username });
                }}>
                <Avatar
                  size={48}
                  source={{ uri: item.avatar }}
                  username={item.username}
                />
                <Text style={styles.username}>{item.username}</Text>
              </TouchableOpacity>
              <View style={Common.divider} />
            </>
          );
        }}
      />
    </View>
  );
};

export default Follow;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGrey,
    flex: 1,
  },
  loading: {
    marginTop: '50%',
  },
  listContainer: {
    flexGrow: 1,
    overflow: 'hidden',
    paddingTop: 16,
    backgroundColor: Colors.white,
  },
  item: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  username: {
    marginLeft: 16,
    fontSize: 18,
  },
});
