import { SET_USR } from './types.js';
export function setUsr(user) {
  return {
    type: SET_USR,
    user: user
  }
}

export function authReq(name, opts) {
  return async function(dispatch) {
    const res = await fetch('http://localhost:5000/api/auth/' + name, opts);
    const user = await res.json();
    if (user.hasOwnProperty('message')) {
      dispatch(setUsr({}));
    } else {
      console.log(user);
      dispatch(setUsr(user));
    }
    return user;
  }
}

export function logout(token) {
  return dispatch => {
    const requestOpts = {
      method: 'DELETE',
      headers: {'Content-type': 'application/JSON', 'Authorization': 'Bearer ' + token},
      credentials: 'include'
    }
    return fetch('http://localhost:5000/api/auth/logout', requestOpts).then(res => {
      res.json().then(_ =>
        dispatch(setUsr({}))
      );
    });
  }
}

export function refreshToken(csrfToken) {
  return dispatch => {
    const requestOpts = {
      method: 'POST',
      headers: {'Content-type': 'application/JSON', 'X-CSRF-Token': csrfToken},
      credentials: 'include'
    }
    return fetch('http://localhost:5000/api/auth/refresh', requestOpts).then(res => {
      res.json().then(data => {
        if (data.hasOwnProperty('msg')) {
          dispatch(setUsr({}));
        } else {
          dispatch(setUsr(data));
        }
      });
    });
  }
}