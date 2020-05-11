import CONFIG from '../config';

export default {
  getCurrentId() {
    return platform.services.services.platform.store.get(['auth', 'currentUser', CONFIG.get('userIdField')]);
  },
};
