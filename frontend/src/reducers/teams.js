import { INIT_TEAMS } from '../actions/types';
import { SET_NAMES } from '../actions/types';

const initialState = {
  teams: {},
  names: {}
};

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case INIT_TEAMS:
      return {
        teams: action.teams,
        names: state.names
      };
    case SET_NAMES:
      return {
        names: action.names,
        teams: state.teams
      };
    default: return state;
  }
}