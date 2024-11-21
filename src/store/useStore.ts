import { create } from 'zustand';
import { Content, User, SocialPlatform } from '../types';
import * as api from '../services/api';

interface State {
  user: User | null;
  contents: Content[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  fetchContents: () => Promise<void>;
  generateContent: (prompt: string, platforms: SocialPlatform[]) => Promise<void>;
  updateContent: (id: number, content: string) => Promise<void>;
  deleteContent: (id: number) => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
  user: null,
  contents: [],
  isLoading: false,
  error: null,
  
  setUser: (user) => set({ user }),
  
  fetchContents: async () => {
    const { user } = get();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      const contents = await api.fetchContents();
      set({ contents });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch contents' });
    } finally {
      set({ isLoading: false });
    }
  },
  
  generateContent: async (prompt, platforms) => {
    const { user } = get();
    if (!user) throw new Error('User not authenticated');
    
    set({ isLoading: true, error: null });
    try {
      const generatedContent = await api.generateContent(prompt, platforms, user.id);
      const newContent = await api.saveContent({
        prompt,
        generated_content: generatedContent,
        user_id: user.id,
        platforms: platforms.join(',')
      });
      set(state => ({ contents: [newContent, ...state.contents] }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to generate content' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  updateContent: async (id, content) => {
    const { user } = get();
    if (!user) throw new Error('User not authenticated');

    set({ isLoading: true, error: null });
    try {
      await api.updateContent(id, content);
      set(state => ({
        contents: state.contents.map(item =>
          item.id === id ? { ...item, generated_content: content } : item
        )
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update content' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  deleteContent: async (id) => {
    const { user } = get();
    if (!user) throw new Error('User not authenticated');

    set({ isLoading: true, error: null });
    try {
      await api.deleteContent(id);
      set(state => ({
        contents: state.contents.filter(item => item.id !== id)
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete content' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  }
}));