// see https://github.com/thecodingmachine/react-native-boilerplate/

import { ROUTES } from '@/config/route';
import {
  CommonActions,
  NavigationContainerRef,
} from '@react-navigation/native';
import React from 'react';

export const navigationRef = React.createRef<NavigationContainerRef>();

export function goBack() {
  navigationRef.current?.goBack();
}

export function navigate(name: ROUTES, params: any) {
  navigationRef.current?.navigate(name, params);
}

export function navigateAndReset(routes = [], index = 0) {
  navigationRef.current?.dispatch(CommonActions.reset({ index, routes }));
}

export function navigateAndSimpleReset(name: string, index = 0) {
  navigationRef.current?.dispatch(
    CommonActions.reset({ index, routes: [{ name }] }),
  );
}
