import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { initialUsers } from "../services/mockData";

const AuthContext = createContext(null);

export const STORAGE_USERS = "servease_users";
export const STORAGE_SESSION = "servease_session";

/** Pre-defined admin (simulation only — not in registered users list). */
export const ADMIN_EMAIL = "admin@gmail.com";
export const ADMIN_PASSWORD = "admin123";

const adminSessionUser = () => ({
  id: "admin",
  name: "Administrator",
  email: ADMIN_EMAIL,
  role: "admin",
});

export function getDashboardPath(role) {
  if (role === "admin") return "/admin-dashboard";
  if (role === "provider") return "/provider-dashboard";
  return "/user-dashboard";
}

function readUsersFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_USERS);
    if (!raw) return [...initialUsers];
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) && parsed.length ? parsed : [...initialUsers];
    return list
      .filter((u) => u.role !== "admin")
      .map((u) => ({ ...u, accountStatus: u.accountStatus ?? "active" }));
  } catch {
    return [...initialUsers];
  }
}

function sessionPayloadFromUser(nextUser) {
  return {
    isLoggedIn: true,
    id: nextUser.id,
    name: nextUser.name,
    email: nextUser.email,
    role: nextUser.role,
  };
}

function readSessionFromStorage(users) {
  try {
    const raw = localStorage.getItem(STORAGE_SESSION);
    if (!raw) return null;
    const s = JSON.parse(raw);
    const loggedIn = s?.isLoggedIn === true || (s?.role && s?.email && s?.id != null);
    if (!loggedIn) return null;

    if (s.role === "admin" && String(s.email).toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      return adminSessionUser();
    }
    const found = users.find(
      (u) =>
        u.id === s.id &&
        String(u.email).toLowerCase() === String(s.email).toLowerCase() &&
        u.role === s.role
    );
    if (!found) {
      localStorage.removeItem(STORAGE_SESSION);
      return null;
    }
    if ((found.accountStatus ?? "active") === "blocked") {
      localStorage.removeItem(STORAGE_SESSION);
      return null;
    }
    return { ...found };
  } catch {
    return null;
  }
}

function writeSessionToStorage(nextUser) {
  if (!nextUser) {
    localStorage.removeItem(STORAGE_SESSION);
    return;
  }
  localStorage.setItem(STORAGE_SESSION, JSON.stringify(sessionPayloadFromUser(nextUser)));
}

/** Removes persisted login session (does not delete registered users or bookings). */
export function clearAuthSession() {
  localStorage.removeItem(STORAGE_SESSION);
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(readUsersFromStorage);
  const [user, setUser] = useState(() => readSessionFromStorage(readUsersFromStorage()));

  useEffect(() => {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (!user || user.role === "admin") return;
    const fresh = users.find(
      (u) =>
        u.id === user.id &&
        String(u.email).toLowerCase() === String(user.email).toLowerCase() &&
        u.role === user.role
    );
    if (!fresh || (fresh.accountStatus ?? "active") === "blocked") {
      setUser(null);
      clearAuthSession();
    }
  }, [users, user]);

  const register = useCallback(({ name, email, password, role }) => {
    if (role === "admin") {
      return { success: false, message: "Admin accounts cannot be created through registration." };
    }
    const emailNorm = String(email).trim().toLowerCase();
    if (emailNorm === ADMIN_EMAIL.toLowerCase()) {
      return { success: false, message: "This email is reserved for the system administrator." };
    }
    const exists = users.some((u) => String(u.email).toLowerCase() === emailNorm);
    if (exists) {
      return { success: false, message: "User already exists. Please login." };
    }
    const base = {
      id: `u${Date.now()}`,
      name,
      email: String(email).trim(),
      password,
      role,
      accountStatus: "active",
    };
    const newUser =
      role === "provider" ? { ...base, approvalStatus: "pending" } : { ...base, approvalStatus: "approved" };
    setUsers((prev) => [...prev, newUser]);
    return { success: true };
  }, [users]);

  const login = useCallback(
    ({ email, password }) => {
      const emailNorm = String(email).trim().toLowerCase();
      if (emailNorm === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
        const admin = adminSessionUser();
        setUser(admin);
        writeSessionToStorage(admin);
        return { success: true, role: "admin" };
      }
      const found = users.find(
        (u) => String(u.email).toLowerCase() === emailNorm && u.password === password
      );
      if (!found) return { success: false, message: "Invalid email or password." };
      if ((found.accountStatus ?? "active") === "blocked") {
        return { success: false, message: "Your account has been blocked. Contact support." };
      }
      setUser({ ...found });
      writeSessionToStorage(found);
      return { success: true, role: found.role };
    },
    [users]
  );

  const logout = useCallback(() => {
    setUser(null);
    clearAuthSession();
  }, []);

  const setProviderApproval = useCallback((userId, approvalStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId && u.role === "provider" ? { ...u, approvalStatus } : u))
    );
  }, []);

  const setUserAccountStatus = useCallback((userId, status) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, accountStatus: status } : u))
    );
  }, []);

  const removeUser = useCallback(
    (userId) => {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setUser((current) => {
        if (current?.id === userId) {
          clearAuthSession();
          return null;
        }
        return current;
      });
    },
    [setUser]
  );

  const value = useMemo(
    () => ({
      user,
      users,
      register,
      login,
      logout,
      setProviderApproval,
      setUserAccountStatus,
      removeUser,
    }),
    [user, users, register, login, logout, setProviderApproval, setUserAccountStatus, removeUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
