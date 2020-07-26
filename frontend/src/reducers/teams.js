import { INIT_TEAMS } from '../actions/types';
import { SET_NAMES } from '../actions/types';
import { UPDATE_PRICES } from '../actions/types';

import { isEmpty } from '../utils/jsUtils';

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
    case UPDATE_PRICES:
      if (isEmpty(state.teams)) {
        return {
          names: state.names,
          teams: state.teams
        };
      } else {
        action.updates.forEach(update => {
          let abr = Object.keys(update)[0];
          state.teams[abr]['price'] = update[abr];
          state.teams[abr]['graph']['1D'] = [...state.teams[abr]['graph']['1D'], update[abr]];
        });
        return {
          names: state.names,
          teams: state.teams
        };
      }
    default: return state;
  }
}