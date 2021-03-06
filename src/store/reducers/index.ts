import { combineReducers } from 'redux';

import topicReducer from './topic';
import userReducer from './user';

const rootReducer = combineReducers({
  topic: topicReducer,
  user: userReducer,
});

export default rootReducer;
