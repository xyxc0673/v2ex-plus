import { combineReducers } from 'redux';

import topicReducer from './topic';
import userReducer from './user';
import notificationReducer from './notification';

const rootReducer = combineReducers({
  topic: topicReducer,
  user: userReducer,
  notification: notificationReducer,
});

export default rootReducer;
