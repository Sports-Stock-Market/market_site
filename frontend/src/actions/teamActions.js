import { INIT_TEAMS, SET_NAMES, UPDATE_PRICES } from './types';

export function initTeamData(data) {
    return {
        type: INIT_TEAMS,
        teams: data
    }
}

export function setNames(data) {
    return {
        type: SET_NAMES,
        names: data
    }
}

export function initAllTeams() {
    return async function(dispatch) {
        const opts = {
            method: 'GET',
            headers: {'Content-type': 'application/JSON'},
            credentials: 'include'
        }
        const res = await fetch('http://localhost:3000/api/teams/allTeamData', opts);
        const data = await res.json()
        dispatch(initTeamData(data));
    }
}

export function setAllNames() {
    return async function(dispatch) {
        const opts = {
            method: 'GET',
            headers: {'Content-Type': 'application/JSON'},
            credentials: 'include'
        }
        const res = await fetch('http://localhost:3000/api/teams/teamNames', opts);
        const data = await res.json();
        dispatch(setNames(data));
    }
}

export function updatePrices(updates) {
    return dispatch => {
        dispatch({type: UPDATE_PRICES, updates: updates});
    }
}