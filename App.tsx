/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { Provider } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import zhCN from 'dayjs/locale/zh-cn';

import { ApplicationNavigations } from '@/navigations';
import store from '@/store';

dayjs.extend(relativeTime);
dayjs.locale(zhCN);

declare const global: { HermesInternal: null | {} };

const App = () => {
  return (
    <Provider store={store}>
      <ApplicationNavigations />
    </Provider>
  );
};

export default App;
