import { store } from './';

function authHeader(){
  // return authorization header with jwt token
  const user = JSON.parse(localStorage.getItem('user'));
  //const user = store.getState().authentication.user;
  if (user && user.token) {
    return { 'Authorization': 'Bearer ' + user.token };
  } else {
    return {};
  }
}

export { authHeader };
