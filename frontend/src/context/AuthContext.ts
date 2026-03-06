import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";


type DecodedToken = {
  sub: string;
  roles: string[];
  exp: number;
};

interface AuthContextType {
  token: string | null;
  user: string | null;
  roles: string[];
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  roles: [],
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    if (token) {
      try {    
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded.sub);
        setRoles(decoded.roles || []);
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    } else {
      setUser(null);
      setRoles([]);
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setRoles([]);
  };

  const value: AuthContextType = {
    token,
    login,
    logout,
    isAuthenticated: !!token,
    user,
    roles
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};
