import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tabs } from './index';
import { StyleSheet } from 'react-native';
import { defaultTheme } from '@/theme/colors';

const Stack = createStackNavigator();

const ApplicationNavigations = () => {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer theme={defaultTheme}>
        <Stack.Navigator initialRouteName="TabNavigator">
          <Stack.Screen name="TabNavigator" component={Tabs} />
        </Stack.Navigator>
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
