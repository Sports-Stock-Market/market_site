import { INIT_TEAMS } from './types';

export function initTeamData(data) {
    return {
        type: INIT_TEAMS,
        teams: data
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