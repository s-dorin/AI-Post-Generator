import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface WebhookResponse {
  generatedContent?: string;
  content?: string;
  response?: string;
  message?: string;
  text?: string;
  error?: string;
}

export function ContentGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const parseResponse = async (response: Response): Promise<string> => {
    const contentType = response.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('application/json')) {
        const data: WebhookResponse = await response.json();
        // Check various possible response formats
        return data.generatedContent || data.content || data.response || 
               data.message || data.text || JSON.stringify(data);
      }
      
      if (contentType.includes('text/xml') || contentType.includes('application/xml')) {
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        // Try to find content in common XML structures
        const content = xmlDoc.querySelector('content, response, message, text');
        return content ? content.textContent || text : text;
      }
      
      // Default to text for all other content types
      return await response.text();
    } catch (error) {
      console.error('Response parsing error:', error);
      throw new Error('Failed to parse response from AI service');
    }
  };

  const generateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const response = await fetch('https://n8n.multiseco.info/webhook/bf8a6b0e-6cd8-4e97-801d-54a677c4caac', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          userId: user.id,
          webhookSource: 'ai-content-generator',
          format: 'text'  // Request simple text format if possible
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Eroare server: ${response.status} - ${errorText}`);
      }

      const generatedContent = await parseResponse(response);
      
      if (!generatedContent || typeof generatedContent !== 'string') {
        throw new Error('Răspuns invalid sau gol de la serviciul AI');
      }

      const { error: saveError } = await supabase
        .from('content')
        .insert([{
          prompt: prompt.trim(),
          generated_content: generatedContent,
          user_id: user.id,
        }]);

      if (saveError) throw saveError;
      
      toast.success('Conținut generat și salvat cu succes!');
      setPrompt('');
    } catch (error) {
      console.error('Eroare de generare:', error);
      toast.error(
        error instanceof Error 
          ? error.message
          : 'Nu s-a reușit generarea conținutului. Vă rugăm să încercați din nou.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={generateContent} className="w-full max-w-2xl space-y-4">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          className="w-full h-32 p-4 rounded-lg bg-white/10 backdrop-blur border border-prussian-600/20 focus:border-prussian-500 focus:ring-2 focus:ring-prussian-500 resize-none text-gray-800 dark:text-white transition-all"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="absolute bottom-4 right-4 p-2 rounded-lg bg-gradient-to-r from-prussian-600 to-prussian-800 hover:from-prussian-700 hover:to-prussian-900 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Generare</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}