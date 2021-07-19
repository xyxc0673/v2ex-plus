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
import store, { persistor } from '@/store';
import { PersistGate } from 'redux-persist/integration/react';
import { setCookie } from '@/services/request';
import { SafeAreaProvider } from 'react-native-safe-area-context';

dayjs.extend(relativeTime);
dayjs.locale(zhCN);

setCookie(store);

declare const global: { HermesInternal: null | {} };

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <ApplicationNavigations />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
