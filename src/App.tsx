import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { AppState } from './types';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [appState, setAppState] = useState<AppState>({
    sessionString: localStorage.getItem('tg_session') || null,
    apiId: localStorage.getItem('tg_api_id') || '',
    apiHash: localStorage.getItem('tg_api_hash') || '',
  });

  useEffect(() => {
    // Initialize Telegram Web App
    if (WebApp.initData) {
      WebApp.ready();
      WebApp.expand();
      if (WebApp.colorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const handleLoginSuccess = (sessionString: string, apiId: string, apiHash: string) => {
    localStorage.setItem('tg_session', sessionString);
    localStorage.setItem('tg_api_id', apiId);
    localStorage.setItem('tg_api_hash', apiHash);
    setAppState({ sessionString, apiId, apiHash });
  };

  const handleLogout = () => {
    localStorage.removeItem('tg_session');
    setAppState({ ...appState, sessionString: null });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      <header className="px-6 py-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.18-.08-.05-.19-.02-.27 0-.11.03-1.84 1.18-5.22 3.47-.49.33-.94.5-1.34.49-.45-.01-1.3-.25-1.94-.46-.78-.26-1.4-.4-1.35-.85.03-.23.33-.47.92-.72 3.6-1.56 5.99-2.59 7.18-3.09 3.42-1.42 4.13-1.67 4.59-1.68.1 0 .32.02.44.11.1.07.13.16.14.25.01.07 0 .15-.01.24z"/>
            </svg>
          </div>
          <h1 className="text-lg font-semibold tracking-tight">StreamBot Control</h1>
        </div>
        {appState.sessionString && (
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        )}
      </header>

      <main className="flex-1 p-6 flex flex-col max-w-lg mx-auto w-full">
        <AnimatePresence mode="wait">
          {!appState.sessionString ? (
            <LoginForm 
              key="login" 
              onSuccess={handleLoginSuccess} 
              savedApiId={appState.apiId}
              savedApiHash={appState.apiHash}
            />
          ) : (
            <Dashboard 
              key="dashboard" 
              appState={appState} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
