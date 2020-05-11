
export default {
  setItem(key, value) {
    return sessionStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    return sessionStorage.removeItem(key);
  },
  getItem(key) {
    const result = sessionStorage.getItem(key);

    return result ? JSON.parse(result) : null;
  },
}
