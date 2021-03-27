import { combineReducers } from 'redux';

import topicReducer from './topic';
import userReducer from './user';
import notificationReducer from './notification';
import nodeReducer from './node';
import historyReducer from './history';

const rootReducer = combineReducers({
  topic: topicReducer,
  user: userReducer,
  notification: notificationReducer,
  node: nodeReducer,
  history: historyReducer,
});

export default rootReducer;
