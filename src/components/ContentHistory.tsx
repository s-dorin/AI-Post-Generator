import { useState, useEffect } from 'react';
import { Edit2, Trash2, Save, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Content {
  id: number;
  prompt: string;
  generated_content: string;
  created_at: string;
}

export function ContentHistory() {
  const [contents, setContents] = useState<Content[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('A eșuat preluarea istoricului conținutului);
      return;
    }

    setContents(data || []);
  };

  const handleEdit = async (id: number) => {
    if (editingId === id) {
      try {
        const { error } = await supabase
          .from('content')
          .update({ generated_content: editedContent })
          .eq('id', id);

        if (error) throw error;
        toast.success('Conținut actualizat cu succes');
        fetchContents();
        setEditingId(null);
      } catch (error) {
        toast.error('A eșuat actualizarea conținutului');
      }
    } else {
      const content = contents.find(c => c.id === id);
      if (content) {
        setEditedContent(content.generated_content);
        setEditingId(id);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Conținut șters cu succes');
      fetchContents();
    } catch (error) {
      toast.error('Eșec la ștergerea conținutului');
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <h2 className="text-2xl font-bold text-prussian-900 dark:text-white">Content History</h2>
      <div className="space-y-4">
        {contents.map((content) => (
          <div
            key={content.id}
            className="p-6 rounded-xl bg-white/10 backdrop-blur-lg shadow-lg border border-prussian-600/20 hover:border-prussian-500/40 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {formatDistanceToNow(new Date(content.created_at), { addSuffix: true })}
                </p>
                <p className="font-medium text-prussian-800 dark:text-prussian-200 mb-4">
                  {content.prompt}
                </p>
              </div>
              <div className="flex gap-2">
                {editingId === content.id ? (
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(content.id)}
                      className="p-2 rounded-lg hover:bg-prussian-100 dark:hover:bg-prussian-900/20 text-prussian-600 dark:text-prussian-400 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
            {editingId === content.id ? (
              <div className="space-y-4">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-32 p-4 rounded-lg bg-white/5 backdrop-blur border border-prussian-600/20 focus:border-prussian-500 focus:ring-2 focus:ring-prussian-500 resize-none text-gray-800 dark:text-white transition-all"
                />
                <button
                  onClick={() => handleEdit(content.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-prussian-600 to-prussian-800 hover:from-prussian-700 hover:to-prussian-900 text-white transition-all duration-300"
                >
                  <Save className="w-5 h-5" />
                  <span>Salvați modificările</span>
                </button>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                {content.generated_content}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}