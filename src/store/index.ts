import {
  applyMiddleware,
  configureStore,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import rootReducer from './reducers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

function createStore() {
  const middlewares = [thunkMiddleware, loggerMiddleware];

  if (__DEV__) {
    const reduxDebugger = require('redux-middleware-flipper').default;
    middlewares.push(reduxDebugger({ actionsBlacklist: [] }));
  }

  const middlewareEnhancers = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancers];

  const store = configureStore({
    reducer: persistReducer(persistConfig, rootReducer),
    enhancers: enhancers,
    middleware: getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  });

  return store;
}

const store = createStore();

export default store;

export const persistor = persistStore(store);

export type TStore = typeof store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
