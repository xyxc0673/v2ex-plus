import React, { useMemo } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TabbarIndex } from '@/screens/index';
import { HOME_NODES } from '@/config/tabs';
import { useAppSelector } from '@/utils/hooks';

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

        tabStyle: {
          width: 60,
          padding: 0,
        },
        labelStyle: {
          padding: 0,
        },
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
