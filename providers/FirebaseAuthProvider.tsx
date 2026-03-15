"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  firebaseUser: User | null;
  authLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  authLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const FirebaseAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
