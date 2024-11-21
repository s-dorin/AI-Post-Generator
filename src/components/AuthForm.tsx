import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export function AuthForm() {
  return (
    <div className="w-full max-w-md p-8 rounded-xl bg-white/20 backdrop-blur-lg shadow-xl border border-primary-200/30 dark:border-primary-700/30">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'rgb(14, 165, 233)',
                brandAccent: 'rgb(217, 70, 239)',
              },
            },
          },
          className: {
            container: 'auth-container',
            button: 'auth-button',
            input: 'auth-input',
          },
        }}
        providers={[]}
        onError={(error) => {
          toast.error(error.message);
        }}
      />
    </div>
  );
}