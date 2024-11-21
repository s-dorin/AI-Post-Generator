import { supabase } from '../lib/supabase';
import { Content, ApiError, SocialPlatform } from '../types';

const AI_WEBHOOK_URL = 'https://n8n.multiseco.info/webhook/bf8a6b0e-6cd8-4e97-801d-54a677c4caac';

function formatGeneratedContent(content: string): string {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return parsed.map(item => item.formattedText).join('\n\n---\n\n');
    }
    return content;
  } catch {
    return content;
  }
}

export async function fetchContents(): Promise<Content[]> {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new ApiError('Failed to fetch content history: ' + error.message);
  }

  return data || [];
}

async function handleResponse(response: Response): Promise<string> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => 'No error details available');
    throw new ApiError(`Server error (${response.status}): ${errorText}`, response.status);
  }

  try {
    const text = await response.text();
    if (!text) {
      throw new ApiError('Empty response from AI service');
    }

    return formatGeneratedContent(text);
  } catch (error) {
    console.error('Response Processing Error:', error);
    throw new ApiError(
      'Failed to process AI service response: ' + (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}

export async function generateContent(prompt: string, platforms: SocialPlatform[], userId: string): Promise<string> {
  try {
    const response = await fetch(AI_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        platforms,
        userId,
        webhookSource: 'ai-content-generator'
      })
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Content Generation Error:', error);
    throw error instanceof ApiError ? error : new ApiError(
      'Failed to generate content: ' + (error instanceof Error ? error.message : 'Unknown error')
    );
  }
}

export async function saveContent(content: Omit<Content, 'id' | 'created_at'>): Promise<Content> {
  const { data, error } = await supabase
    .from('content')
    .insert([content])
    .select()
    .single();

  if (error) {
    throw new ApiError('Failed to save content: ' + error.message);
  }

  return data;
}

export async function updateContent(id: number, content: string): Promise<void> {
  const { error } = await supabase
    .from('content')
    .update({ generated_content: content })
    .eq('id', id);

  if (error) {
    throw new ApiError('Failed to update content: ' + error.message);
  }
}

export async function deleteContent(id: number): Promise<void> {
  const { error } = await supabase
    .from('content')
    .delete()
    .eq('id', id);

  if (error) {
    throw new ApiError('Failed to delete content: ' + error.message);
  }
}