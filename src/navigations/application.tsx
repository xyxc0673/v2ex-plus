import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import {
  NavigationContainer,
  NavigationState,
  PartialState,
  Route,
} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import Tabs from './tabs';
import { Colors, defaultTheme } from '@/theme/colors';
import {
  About,
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
import { ROUTES } from '@/config/route';

// 根据不同的 route 返回不同的标题
function getHeaderTitle(
  route: Partial<Route<string>> & {
    state?: PartialState<NavigationState>;
  },
) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? ROUTES.TAB_INDEX;
  switch (routeName) {
    case ROUTES.TAB_INDEX:
      return 'V2EX';
    case ROUTES.TAB_NODE:
      return '节点';
    case ROUTES.TAB_NOTICE:
      return '消息';
    case ROUTES.TAB_ME:
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
    <NavigationContainer theme={defaultTheme} ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={ROUTES.TABS}
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen
          name={ROUTES.TABS}
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
          name={ROUTES.LOGIN}
          component={Login}
          options={{
            title: '登录',
          }}
        />
        <Stack.Screen
          name={ROUTES.TOPIC}
          component={Topic}
          options={{
            title: '主题正文',
          }}
        />
        <Stack.Screen
          name={ROUTES.PROFILE}
          component={Profile}
          options={{
            title: '',
          }}
        />
        <Stack.Screen
          name={ROUTES.HISTORY}
          component={History}
          options={{
            title: '已读主题',
          }}
        />
        <Stack.Screen
          name={ROUTES.NODE_TOPIC}
          component={NodeTopic}
          options={{
            title: '节点',
          }}
        />
        <Stack.Screen
          name={ROUTES.FAV_TOPIC}
          component={FavTopic}
          options={{
            title: '收藏的主题',
          }}
        />
        <Stack.Screen
          name={ROUTES.FOLLOW}
          component={Follow}
          options={{
            title: '关注',
          }}
        />
        <Stack.Screen
          name={ROUTES.ABOUT}
          component={About}
          options={{
            title: '关于',
          }}
        />
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <StatusBar backgroundColor={Colors.lightGrey} barStyle={'dark-content'} />
    </NavigationContainer>
  );
};

export default ApplicationNavigations;
