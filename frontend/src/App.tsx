import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Finance } from './components/Finance';
import { Lifestyle } from './components/Lifestyle';
import { Media } from './components/Media';
import { Tasks } from './components/Tasks';
import { Vault } from './components/Vault';
import { Settings } from './components/Settings';
import { Coding } from './components/Coding';
import { Auth } from './components/Auth';
import { ReminderListener } from './components/ReminderListener';
import { AIAssistant } from './components/AIAssistant';
import { useStore } from './store/useStore';


export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, theme, accentColor } = useStore();

  // Apply visual settings globally
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.setProperty('--primary-color', accentColor);
  }, [theme, accentColor]);

  if (!user) return <Auth />;

  return (
    <div className={`flex flex-col md:flex-row h-screen bg-[var(--color-background)] overflow-hidden font-sans text-[var(--color-card-foreground)] selection:bg-[var(--color-primary)]/30 transition-colors duration-300`}>

      <ReminderListener />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />


      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header activeTab={activeTab} />

        <div className="flex-1 overflow-y-auto hide-scrollbar px-4 md:px-10 pb-24 md:pb-10">

          <div className="max-w-[1600px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'finance' && <Finance />}
                {activeTab === 'coding' && <Coding />}
                {activeTab === 'lifestyle' && <Lifestyle />}
                {activeTab === 'media' && <Media />}
                {activeTab === 'tasks' && <Tasks />}
                {activeTab === 'vault' && <Vault />}
                {activeTab === 'settings' && <Settings />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
      <AIAssistant />
    </div>
  );
}
