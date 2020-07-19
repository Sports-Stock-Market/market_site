import { INIT_TEAMS } from '../actions/types';

const initialState = {
  teams: {}
};

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case INIT_TEAMS:
      return {
        teams: action.teams
      };
    default: return state;
  }
}