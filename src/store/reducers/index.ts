import { combineReducers } from 'redux';

import topicReducer from './topic';
import userReducer from './user';
import notificationReducer from './notification';
import nodeReducer from './node';
import historyReducer from './history';
import nodeTopicReducer from './node-topic';

const rootReducer = combineReducers({
  topic: topicReducer,
  user: userReducer,
  notification: notificationReducer,
  node: nodeReducer,
  history: historyReducer,
  nodeTopic: nodeTopicReducer,
});

export default rootReducer;
