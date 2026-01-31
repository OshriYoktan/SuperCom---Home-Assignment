import { useState } from 'react';
import { loadUser, saveUser, clearUser } from '../services/authStorage';

export const useAuth = () => {
  const [user, setUser] = useState(loadUser());

  const login = (userData) => {
    saveUser(userData);
    setUser(userData);
  };

  const logout = () => {
    clearUser();
    setUser(null);
  };

  return { user, login, logout };
};
