import React, { createContext, useState, useContext, useEffect } from 'react';
import { authenticateUser, updateUser as updateUserInDb, createUser, initDatabase } from '../utils/database';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initDatabase();
      setIsReady(true);
    };
    init();
  }, []);

  const login = async (email, password) => {
    const authenticatedUser = await authenticateUser(email, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = async (name, email, password) => {
    const result = await createUser(name, email, password);
    if (result.success) {
      setUser(result.user);
      return { success: true };
    }
    return { success: false, error: result.error };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async (updates) => {
    if (user) {
      const updatedUser = await updateUserInDb(user.id, updates);
      if (updatedUser) {
        setUser(updatedUser);
        return { success: true };
      }
    }
    return { success: false, error: 'Failed to update profile' };
  };

  if (!isReady) {
    return null; // Or a loading spinner
  }

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
