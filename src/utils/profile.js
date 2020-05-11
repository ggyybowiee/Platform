
export function getProfile() {
  const profile = localStorage.getItem('profile');

  return profile ? JSON.parse(profile) : null;
}

export function setProfile(profile) {
  return localStorage.setItem('profile', JSON.stringify(profile));
}
