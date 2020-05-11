
export default {
  setItem(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  },
  getItem(key) {
    const result = sessionStorage.getItem(key);

    return result ? JSON.parse(result) : null;
  },
}
