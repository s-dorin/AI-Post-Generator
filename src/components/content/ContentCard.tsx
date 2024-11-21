import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Edit2, Trash2, Save, X, Facebook, Linkedin, Instagram, Twitter, Music } from 'lucide-react';
import { Content } from '../../types';
import { Button } from '../ui/Button';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const PLATFORM_ICONS: Record<string, any> = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  tiktok: Music,
};

interface ContentCardProps {
  content: Content;
}

export function ContentCard({ content }: ContentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content.generated_content);
  const { updateContent, deleteContent } = useStore();

  const platforms = content.platforms?.split(',').filter(Boolean) || [];

  const handleSave = async () => {
    try {
      await updateContent(content.id, editedContent);
      setIsEditing(false);
      toast.success('Conținut actualizat cu succes');
    } catch (error) {
      toast.error('A eșuat actualizarea conținutului');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContent(content.id);
      toast.success('Conținut șters cu succes');
    } catch (error) {
      toast.error('Eșec la ștergerea conținutului');
    }
  };

  const formatContent = (text: string) => {
    return text.split('---').map((section, index) => (
      <div key={index} className="mb-6 last:mb-0">
        <div className="prose prose-sm max-w-none dark:prose-invert prose-p:text-gray-800 dark:prose-p:text-gray-200 [&>p]:my-1 [&>h1]:mb-2 [&>h2]:mb-2 [&>h3]:mb-2 [&>h4]:mb-2">
          <ReactMarkdown>{section.trim()}</ReactMarkdown>
        </div>
      </div>
    ));
  };

  return (
    <div className="rounded-xl bg-white/10 backdrop-blur-lg shadow-lg border border-prussian-600/20 hover:border-prussian-500/40 transition-all duration-300 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              {platforms.map((platform) => {
                const Icon = PLATFORM_ICONS[platform.trim()];
                return Icon ? (
                  <Icon 
                    key={platform} 
                    className="w-5 h-5 text-gray-600 dark:text-gray-300" 
                    title={platform}
                  />
                ) : null;
              })}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {formatDistanceToNow(new Date(content.created_at), { addSuffix: true })}
            </p>
          </div>
          <p className="font-medium text-gray-800 dark:text-gray-100 mb-4">
            {content.prompt}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <Button
              variant="secondary"
              onClick={() => {
                setEditedContent(content.generated_content);
                setIsEditing(false);
              }}
            >
              <X className="w-4 h-4" />
              <span>Anulează</span>
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
              >
                <Edit2 className="w-4 h-4" />
                <span>Editează</span>
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
                <span>Șterge</span>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <div className="relative">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full min-h-[400px] p-6 rounded-lg bg-white/5 backdrop-blur border border-prussian-600/20 
                       focus:border-prussian-500 focus:ring-2 focus:ring-prussian-500 
                       resize-vertical text-gray-800 dark:text-gray-200 transition-all 
                       font-mono text-sm leading-relaxed
                       scrollbar-thin scrollbar-thumb-prussian-400 scrollbar-track-transparent
                       focus:shadow-lg dark:bg-gray-800/50"
              style={{ 
                tabSize: 2,
                lineHeight: '1.6',
                letterSpacing: '0.3px'
              }}
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button onClick={handleSave} className="shadow-lg">
                <Save className="w-4 h-4" />
                <span>Salvați modificările</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-gray-800 dark:text-gray-200 bg-white/5 dark:bg-gray-800/50 rounded-lg p-6">
          {formatContent(content.generated_content)}
        </div>
      )}
    </div>
  );
}