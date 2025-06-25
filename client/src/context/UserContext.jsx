import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { auth } from "@/api"; // auth contains signin, signout, getCurrentUser

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This function is now only for checking an existing session on page load
  const refreshUserOnLoad = useCallback(async () => {
    try {
      // getCurrentUser returns { success: true, user: { ... } }
      const response = await auth.getCurrentUser();
      if (response.success) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    refreshUserOnLoad().finally(() => setLoading(false));
  }, [refreshUserOnLoad]);

  // The new, more efficient login function
  const login = useCallback(async (credentials) => {
    try {
      // The improved signin API now returns the user data directly
      const response = await auth.signin(credentials);
      if (response.success) {
        setUser(response.user); // Set user immediately
        return { success: true };
      }
      // This case handles potential (but unlikely) non-error failures
      return { success: false, error: response.message };
    } catch (error) {
      setUser(null);
      return { success: false, error: error.message || "Login failed" };
    }
  }, []);

  // Logout function remains the same
  const logout = useCallback(async () => {
    try {
      await auth.signout();
    } catch (error) {
      console.error("Signout API call failed, logging out on client:", error);
    } finally {
      setUser(null); // Ensure user is logged out on the client regardless of API success
    }
  }, []);

  const memoizedValue = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
    }),
    [user, loading, login, logout]
  );

  return (
    <UserContext.Provider value={memoizedValue}>
      {children}
    </UserContext.Provider>
  );
};

// The useUser hook remains unchanged
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
