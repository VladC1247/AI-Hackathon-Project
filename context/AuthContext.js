import React, { createContext, useState, useContext } from 'react';
import { authenticateUser, updateUser as updateUserInDb, createUser } from '../utils/database';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    const authenticatedUser = authenticateUser(email, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (name, email, password) => {
    const result = createUser(name, email, password);
    if (result.success) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (user) {
      const updatedUser = updateUserInDb(user.id, updates);
      if (updatedUser) {
        setUser(updatedUser);
        return { success: true };
      }
    }
    return { success: false, error: 'Failed to update profile' };
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
