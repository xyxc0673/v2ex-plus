import { applyMiddleware, configureStore } from '@reduxjs/toolkit';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import { topicReducer, userReducer } from './reducers';
function createStore() {
  const middlewares = [thunkMiddleware, loggerMiddleware];
  const middlewareEnhancers = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancers];

  const store = configureStore({
    reducer: { topic: topicReducer, user: userReducer },
    enhancers: enhancers,
  });

  return store;
}

const store = createStore();

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
