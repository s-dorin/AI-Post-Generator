import { useState } from 'react';
import { Send, Facebook, Linkedin, Instagram, Twitter, Music } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Button } from '../ui/Button';
import { SocialPlatform } from '../../types';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const PLATFORM_OPTIONS: { value: SocialPlatform; label: string; Icon: any }[] = [
  { value: 'facebook', label: 'Facebook', Icon: Facebook },
  { value: 'linkedin', label: 'LinkedIn', Icon: Linkedin },
  { value: 'instagram', label: 'Instagram', Icon: Instagram },
  { value: 'twitter', label: 'X (Twitter)', Icon: Twitter },
  { value: 'tiktok', label: 'TikTok', Icon: Music },
];

export function ContentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const { generateContent, isLoading } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || selectedPlatforms.length === 0) {
      toast.error('Selectează cel puțin o platformă și introduceți un prompt');
      return;
    }

    try {
      await generateContent(prompt.trim(), selectedPlatforms);
      setPrompt('');
      toast.success('Conținut generat cu succes!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Eroare la generarea conținutului');
    }
  };

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Selectați platformele
        </label>
        <div className="flex flex-wrap gap-3">
          {PLATFORM_OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => togglePlatform(value)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300',
                'border-2',
                selectedPlatforms.includes(value)
                  ? 'bg-primary-500 border-primary-600 text-white'
                  : 'bg-white/10 border-primary-200/30 hover:border-primary-300/50 text-gray-700 dark:text-gray-300'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Scrie aici cine este clientul tău ideal și care este subiectul postării..."
          className="w-full h-32 p-4 rounded-lg bg-white/10 backdrop-blur border border-prussian-600/20 
                   focus:border-prussian-500 focus:ring-2 focus:ring-primary-500 
                   resize-none text-gray-800 dark:text-gray-100 transition-all"
        />
        <Button
          type="submit"
          disabled={isLoading || !prompt.trim() || selectedPlatforms.length === 0}
          className="absolute bottom-4 right-4"
          isLoading={isLoading}
        >
          <Send className="w-4 h-4" />
          <span>Generare</span>
        </Button>
      </div>
    </form>
  );
}