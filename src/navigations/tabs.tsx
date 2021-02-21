import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabbarIndex, TabbarNotice, TabbarMe } from '@/screens/index';
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
              require('../assets/images/home.png'),
              require('../assets/images/home-inactive.png'),
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
              require('../assets/images/notification.png'),
              require('../assets/images/notification-inactive.png'),
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
              require('../assets/images/profile.png'),
              require('../assets/images/profile-inactive.png'),
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
