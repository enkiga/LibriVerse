import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { auth } from "@/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create a memoized refresh function
  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await auth.getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    // First load check
    refreshUser();

    // Auto-refresh when window regains focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshUser();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      window.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [refreshUser]);

  // Memoize context value
  const memoizedValue = useMemo(
    () => ({
      user,
      loading,
      refreshUser, // Expose refresh function
      setUser,
    }),
    [user, loading, refreshUser]
  );

  return (
    <UserContext.Provider value={memoizedValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
