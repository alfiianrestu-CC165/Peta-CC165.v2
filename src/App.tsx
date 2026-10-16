/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { LoginPage, AuthUser } from './components/LoginPage';
import { AnimatePresence, motion } from 'framer-motion';

const SESSION_STORAGE_KEY = 'care_center_165_session';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check saved session on initial load
  useEffect(() => {
    try {
      const localData = localStorage.getItem(SESSION_STORAGE_KEY);
      const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
      const stored = localData || sessionData;

      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.username) {
          setCurrentUser(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to restore session:', e);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const handleLoginSuccess = (user: AuthUser, rememberMe: boolean) => {
    try {
      const json = JSON.stringify(user);
      if (rememberMe) {
        localStorage.setItem(SESSION_STORAGE_KEY, json);
        sessionStorage.removeItem(SESSION_STORAGE_KEY);
      } else {
        sessionStorage.setItem(SESSION_STORAGE_KEY, json);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to store session:', e);
    }
    setCurrentUser(user);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear session:', e);
    }
    setCurrentUser(null);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-medium tracking-wide">Memuat sesi...</span>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!currentUser ? (
        <motion.div
          key="login-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full min-h-screen"
        >
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        </motion.div>
      ) : (
        <motion.div
          key="dashboard-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full h-screen overflow-hidden"
        >
          <Dashboard user={currentUser} onLogout={handleLogout} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
