import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  NavigationState,
  PartialState,
  Route,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import Tabs from './tabs';
import { Colors, defaultTheme } from '@/theme/colors';
import {
  FavTopic,
  Follow,
  History,
  Login,
  NodeTopic,
  Profile,
  Topic,
} from '@/screens';
import { navigationRef } from './root';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '@/utils/hooks';
import { fetchBalance, fetchUserInfo } from '@/store/reducers/user';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

// 根据不同的 route 返回不同的标题
function getHeaderTitle(
  route: Partial<Route<string>> & {
    state?: PartialState<NavigationState>;
  },
) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'index';
  switch (routeName) {
    case 'index':
      return 'V2EX';
    case 'node':
      return '节点';
    case 'notice':
      return '消息';
    case 'me':
      return '我的';
  }
}

const Stack = createStackNavigator();

const ApplicationNavigations = () => {
  const dispatch = useAppDispatch();
  const isLogged = useAppSelector((state) => state.user.isLogged);

  useEffect(() => {
    if (isLogged) {
      dispatch(fetchUserInfo());
      dispatch(fetchBalance());
    }
  }, [dispatch, isLogged]);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer theme={defaultTheme} ref={navigationRef}>
        <Stack.Navigator initialRouteName="TabNavigator">
          <Stack.Screen
            name="TabNavigator"
            component={Tabs}
            options={({ route }) => ({
              headerTitle: getHeaderTitle(route),
              headerStyle: {
                shadowOpacity: 0, // remove shadow on iOS
                elevation: 0, // remove shadow on Android,
                backgroundColor: Colors.lightGrey,
                height: 50,
              },
            })}
          />
          <Stack.Screen
            name="login"
            component={Login}
            options={{
              title: '登录',
            }}
          />
          <Stack.Screen
            name="topic"
            component={Topic}
            options={{
              title: '主题正文',
            }}
          />
          <Stack.Screen
            name="profile"
            component={Profile}
            options={{
              title: '',
            }}
          />
          <Stack.Screen
            name="history"
            component={History}
            options={{
              title: '已读主题',
            }}
          />
          <Stack.Screen
            name="nodeTopic"
            component={NodeTopic}
            options={{
              title: '节点',
            }}
          />
          <Stack.Screen
            name="favTopic"
            component={FavTopic}
            options={{
              title: '收藏的主题',
            }}
          />
          <Stack.Screen
            name="follow"
            component={Follow}
            options={{
              title: '关注',
            }}
          />
        </Stack.Navigator>
        <Toast ref={(ref) => Toast.setRef(ref)} />
        <StatusBar
          backgroundColor={Colors.lightGrey}
          barStyle={'dark-content'}
        />
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default ApplicationNavigations;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
