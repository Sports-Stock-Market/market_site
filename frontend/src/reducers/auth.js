import { SET_USR } from '../actions/types';
import { isEmpty } from '../utils/jsUtils';

const initialState = {
  isAuthenticated: false,
  token: '',
  user: {}
};

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case SET_USR:
      return {
        isAuthenticated: !isEmpty(action.user),
        user: action.user
      };
    default: return state;
  }
}