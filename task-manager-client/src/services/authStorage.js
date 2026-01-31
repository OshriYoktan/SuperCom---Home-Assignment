const KEY = 'auth_user';

export const saveUser = (user) => {
  localStorage.setItem(KEY, JSON.stringify(user));
};

export const loadUser = () => {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearUser = () => {
  localStorage.removeItem(KEY);
};
