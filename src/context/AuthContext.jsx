import { createContext, useContext, useMemo, useState } from "react";
import { initialUsers } from "../services/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [user, setUser] = useState(null);
  const register = ({ name, email, password, role }) => {
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: "User already exists with this email." };
    }
    const newUser = { id: `u${Date.now()}`, name, email, password, role };
    setUsers((prev) => [...prev, newUser]);
    return { success: true };
  };

  const login = ({ email, password, role }) => {
    const found = users.find((u) => u.email === email && u.password === password && u.role === role);
    if (!found) return { success: false, message: "Invalid email or password." };
    setUser(found);
    return { success: true, role: found.role };
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, users, register, login, logout }), [user, users]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
