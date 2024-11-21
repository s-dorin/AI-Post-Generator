import { LogOut, Brain } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ThemeToggle } from './ThemeToggle';
import toast from 'react-hot-toast';

export function Header() {
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      toast.error('Eroare la deconectare');
    }
  };

  return (
    <header className="w-full bg-white/10 backdrop-blur-lg border-b border-prussian-600/20 dark:border-prussian-400/20">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-prussian-600 dark:text-prussian-400" />
          <h1 className="text-2xl font-bold text-prussian-900 dark:text-white">Generator de conținut AI</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-prussian-100 hover:bg-prussian-200 text-prussian-800 dark:bg-prussian-800/50 dark:hover:bg-prussian-700/50 dark:text-prussian-100 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span>Deconectare</span>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}