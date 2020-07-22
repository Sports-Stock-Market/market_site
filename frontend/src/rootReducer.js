import { combineReducers } from 'redux';
import auth from './reducers/auth';
import teams from './reducers/teams';

export default combineReducers({
  auth,
  teams
});