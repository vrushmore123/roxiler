import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const userToken = localStorage.getItem("userToken");
      if (userToken) {
        const userData = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to parse user info from localStorage", error);
      localStorage.clear();
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("userToken", userData.token);
    localStorage.setItem("userInfo", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
