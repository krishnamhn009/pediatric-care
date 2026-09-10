import React, { createContext, useContext, useState, ReactNode } from "react";

export type Role = "Executive" | "Nurse" | "Pediatrician" | "Specialist" | "Parent" | "Admin";

export interface User {
  id: string;
  name: string;
  role: Role;
  specialty?: string;
}

export interface AuthState {
  user: User | null;
  isBreakGlassActive: boolean;
  breakGlassReason: string | null;
}

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
  activateBreakGlass: (reason: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isBreakGlassActive, setIsBreakGlassActive] = useState(false);
  const [breakGlassReason, setBreakGlassReason] = useState<string | null>(null);

  const login = (newUser: User) => {
    setUser(newUser);
    setIsBreakGlassActive(false);
    setBreakGlassReason(null);
  };

  const logout = () => {
    setUser(null);
    setIsBreakGlassActive(false);
    setBreakGlassReason(null);
  };

  const activateBreakGlass = (reason: string) => {
    setIsBreakGlassActive(true);
    setBreakGlassReason(reason);
  };

  return (
    <AuthContext.Provider value={{ user, isBreakGlassActive, breakGlassReason, login, logout, activateBreakGlass }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
