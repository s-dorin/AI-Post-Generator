import { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { ContentCard } from './ContentCard';
import { Loader2 } from 'lucide-react';

export function ContentList() {
  const { contents, isLoading, error, fetchContents } = useStore();

  useEffect(() => {
    fetchContents();
  }, [fetchContents]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-prussian-600 dark:text-prussian-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-400">
        Niciun conținut generat încă. Începeți prin a introduce un prompt mai sus!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contents.map((content) => (
        <ContentCard key={content.id} content={content} />
      ))}
    </div>
  );
}