import { combineReducers } from 'redux';

import topicReducer from './topic';
import userReducer from './user';
import notificationReducer from './notification';
import nodeReducer from './node';

const rootReducer = combineReducers({
  topic: topicReducer,
  user: userReducer,
  notification: notificationReducer,
  node: nodeReducer,
});

export default rootReducer;
