"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, getIdToken } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { BackendUser, getUserByEmail } from "@/lib/userService";

interface AuthContextType {
  firebaseUser: User | null;
  dbUser: BackendUser | null;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  dbUser: null,
  authLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const FirebaseAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<BackendUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      
      if (user && user.email) {
        try {
          const token = await getIdToken(user);
          const backendUser = await getUserByEmail(user.email, token);
          setDbUser(backendUser);
        } catch (error) {
          console.error("Failed to fetch backend user data:", error);
          setDbUser(null);
        }
      } else {
        setDbUser(null);
      }
      
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, dbUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
