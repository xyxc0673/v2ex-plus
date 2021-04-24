import React, { useMemo } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabbarIndex } from '@/screens/index';
import { HOME_NODES } from '@/config/tabs';
import { useAppSelector } from '@/utils/hooks';
import { Colors } from '@/theme/colors';

const Tab = createMaterialTopTabNavigator();

const TopicTabs = () => {
  const isLogged = useAppSelector((state) => state.user.isLogged);

  // 部分节点需要登录后才可以查看
  const filterNodes = useMemo(
    () =>
      HOME_NODES.filter(
        (item) => !item.loginRequired || (item.loginRequired && isLogged),
      ),
    [isLogged],
  );

  return (
    <Tab.Navigator
      lazy
      tabBarOptions={{
        activeTintColor: '#200E32',
        inactiveTintColor: '#999999',
        scrollEnabled: true,
        style: {
          elevation: 0,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 10 }, // change this for more shadow
          shadowOpacity: 0.4,
          shadowRadius: 6,
          borderBottomWidth: 1,
          borderColor: Colors.lightGrey,
          backgroundColor: Colors.lightGrey,
        },
        tabStyle: {
          width: 60,
          padding: 0,
        },
        labelStyle: {
          padding: 0,
          fontSize: 16,
        },
        indicatorStyle: {
          backgroundColor: Colors.lightGrey,
        },
        indicatorContainerStyle: {},
      }}>
      {filterNodes.map((item) => (
        <Tab.Screen
          key={`node-${item.name}`}
          name={`node-${item.name}`}
          component={TabbarIndex}
          options={{
            title: item.title,
          }}
          initialParams={{
            tab: item.name,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TopicTabs;
