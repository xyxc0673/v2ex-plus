import { combineReducers } from 'redux';

import topicReducer from './topic';
import userReducer from './user';
import notificationReducer from './notification';
import nodeReducer from './node';
import historyReducer from './history';
import nodeTopicReducer from './node-topic';
import profileReducer from './profile';
import homeTopicReducer from './home-topic';

const rootReducer = combineReducers({
  topic: topicReducer,
  user: userReducer,
  notification: notificationReducer,
  node: nodeReducer,
  history: historyReducer,
  nodeTopic: nodeTopicReducer,
  profile: profileReducer,
  homeTopic: homeTopicReducer,
});

export default rootReducer;
