import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [contacts, setContacts] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mb_user');
    const storedStatus = localStorage.getItem('mb_isLoggedIn');
    const storedContacts = localStorage.getItem('mb_contacts');
    
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedStatus === 'true') setIsLoggedIn(true);
    if (storedContacts) setContacts(JSON.parse(storedContacts));
    else {
      // default contacts so new users have something to look at in the tracker
      setContacts([
        { id: 1, name: 'Rahul Sharma (Brother)', phone: '+91 9876543210' }
      ]);
    }
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('mb_user', JSON.stringify(userData));
    localStorage.setItem('mb_isLoggedIn', 'true');
  };

  const logoutUser = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('mb_user');
    localStorage.setItem('mb_isLoggedIn', 'false');
  };

  const updateProfile = (newData) => {
    const updated = { ...user, ...newData };
    setUser(updated);
    localStorage.setItem('mb_user', JSON.stringify(updated));
  };

  const updateContacts = (newContacts) => {
    setContacts(newContacts);
    localStorage.setItem('mb_contacts', JSON.stringify(newContacts));
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, loginUser, logoutUser, updateProfile, contacts, updateContacts }}>
      {children}
    </UserContext.Provider>
  );
};
