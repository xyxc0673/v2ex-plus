import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabbarIndex, TabbarNotice, TabbarMe } from '@/screens/index';
import { Image } from 'react-native';
import Images from '@/theme/images';

const Tab = createBottomTabNavigator();

const renderIcon = (
  focused: boolean,
  activeIcon: any,
  inactiveIcon: any,
): Element => {
  const icon = focused ? activeIcon : inactiveIcon;
  return <Image source={icon} />;
};

const Tabs = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#200E32',
        inactiveTintColor: '#999999',
      }}>
      <Tab.Screen
        name="index"
        component={TabbarIndex}
        options={{
          title: '帖子',
          tabBarIcon: ({ focused }) =>
            renderIcon(focused, Images.home, Images.homeInactive),
        }}
      />
      <Tab.Screen
        name="notice"
        component={TabbarNotice}
        options={{
          title: '消息',
          tabBarIcon: ({ focused }) =>
            renderIcon(
              focused,
              Images.notification,
              Images.notificationInactive,
            ),
        }}
      />
      <Tab.Screen
        name="me"
        component={TabbarMe}
        options={{
          title: '我',
          tabBarIcon: ({ focused }) =>
            renderIcon(focused, Images.profile, Images.profileInactive),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
