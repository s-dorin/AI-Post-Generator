import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { AuthForm } from './components/AuthForm';
import { ContentGenerator } from './components/content/ContentGenerator';
import { ContentList } from './components/content/ContentList';
import { Header } from './components/Header';
import { Brain } from 'lucide-react';
import { useStore } from './store/useStore';
import { ThemeToggle } from './components/ThemeToggle';
import { addPlatformsColumn } from './services/migrations';

function App() {
  const { user, setUser } = useStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      // Run migrations if user is authenticated
      if (session?.user) {
        addPlatformsColumn().catch(console.error);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // Run migrations if user is authenticated
      if (session?.user) {
        addPlatformsColumn().catch(console.error);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-prussian-50 to-prussian-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
        <ThemeToggle />
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-prussian-600 dark:text-gray-300" />
            <h1 className="text-4xl font-bold text-prussian-900 dark:text-white">Generator de conținut AI</h1>
          </div>
          <p className="text-prussian-600 dark:text-gray-300">Înregistrează-te pentru a începe să generezi conținut extraordinar</p>
        </div>
        <AuthForm />
        <Toaster position="bottom-right" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-prussian-50 to-prussian-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-prussian-900 dark:text-white">Generează postări pentru Social Media</h2>
            <p className="text-prussian-600 dark:text-gray-300">Introdu datele în promptul de mai jos pentru a genera conținut bazat pe inteligență artificială</p>
          </div>
          <div className="flex justify-center">
            <ContentGenerator />
          </div>
        </section>

        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-prussian-900 dark:text-white">Istoricul conținutului</h2>
            <p className="text-prussian-600 dark:text-gray-300">Vizualizează și gestionează conținutul generat</p>
          </div>
          <ContentList />
        </section>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;