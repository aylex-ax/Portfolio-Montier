"use client";
import { useEffect, useState } from "react";
import { auth, isMockMode } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import LoginForm from "@/components/admin/LoginForm";
import Dashboard from "@/components/admin/Dashboard";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMockMode) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser((prev) => prev?.uid === "dev-admin-id" ? prev : currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black-pure flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black-pure flex items-center justify-center font-sans">
      {!user ? (
        <LoginForm onLoginSuccess={(user) => { if(user) setUser(user); }} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
