import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('medihelp_token') || null);
  const [loading, setLoading] = useState(true);
  const [savedConditions, setSavedConditions] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await axiosClient.get('/api/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
          setSavedConditions(response.data.user.savedConditions || []);
        }
      } catch (err) {
        console.warn('Auto profile fetch unauthenticated');
        localStorage.removeItem('medihelp_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const login = async (email, password) => {
    const response = await axiosClient.post('/api/auth/login', { email, password });
    if (response.data.success) {
      const newToken = response.data.token;
      localStorage.setItem('medihelp_token', newToken);
      setToken(newToken);
      setUser(response.data.user);
      setSavedConditions(response.data.user.savedConditions || []);
      return response.data;
    }
    throw new Error(response.data.error || 'Login failed');
  };

  const register = async (name, email, password) => {
    const response = await axiosClient.post('/api/auth/register', { name, email, password });
    if (response.data.success) {
      const newToken = response.data.token;
      localStorage.setItem('medihelp_token', newToken);
      setToken(newToken);
      setUser(response.data.user);
      setSavedConditions(response.data.user.savedConditions || []);
      return response.data;
    }
    throw new Error(response.data.error || 'Registration failed');
  };

  const logout = async () => {
    try {
      await axiosClient.post('/api/auth/logout');
    } catch (e) {
      // Ignore
    }
    localStorage.removeItem('medihelp_token');
    setToken(null);
    setUser(null);
    setSavedConditions([]);
  };

  const toggleBookmark = async (disease) => {
    if (!user) {
      throw new Error('Please sign in to save conditions to your bookmarks');
    }

    const diseaseId = disease._id || disease;
    const exists = savedConditions.some(item => (item._id || item) === diseaseId);

    let updated;
    if (exists) {
      updated = savedConditions.filter(item => (item._id || item) !== diseaseId);
    } else {
      updated = [...savedConditions, disease];
    }
    setSavedConditions(updated);

    try {
      const response = await axiosClient.post(`/api/tools/user/bookmark/${diseaseId}`);
      if (response.data.success) {
        setSavedConditions(response.data.savedConditions || updated);
      }
    } catch (err) {
      setSavedConditions(savedConditions);
      throw err;
    }
  };

  const isBookmarked = (diseaseId) => {
    return savedConditions.some(item => (item._id || item) === diseaseId);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      savedConditions,
      login,
      register,
      logout,
      toggleBookmark,
      isBookmarked
    }}>
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
