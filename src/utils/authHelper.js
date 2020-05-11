import Cookies from 'js-cookie';
import SessionStore from './SessionStore';

export function get() {
  return SessionStore.getItem('auth') || Cookies.getJSON('remember_user_auth');
}
