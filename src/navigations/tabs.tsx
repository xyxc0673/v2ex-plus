import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabbarIndex, TabbarNotice, TabbarMe } from '../screens';
import { Image } from 'react-native';

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
            renderIcon(
              focused,
              require('../assets/home.png'),
              require('../assets/home-inactive.png'),
            ),
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
              require('../assets/notification.png'),
              require('../assets/notification-inactive.png'),
            ),
        }}
      />
      <Tab.Screen
        name="me"
        component={TabbarMe}
        options={{
          title: '我',
          tabBarIcon: ({ focused }) =>
            renderIcon(
              focused,
              require('../assets/profile.png'),
              require('../assets/profile-inactive.png'),
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
