import { supabase } from '../lib/supabase';

export async function addPlatformsColumn() {
  // First check if the column exists
  const { data: columns, error: checkError } = await supabase
    .from('content')
    .select()
    .limit(1);

  if (checkError) {
    console.error('Error checking table structure:', checkError);
    throw checkError;
  }

  // If the column doesn't exist in the result, add it
  if (columns && !columns[0]?.hasOwnProperty('platforms')) {
    const { error: alterError } = await supabase
      .from('content')
      .update({ platforms: 'facebook' }) // Set a default value for existing rows
      .is('platforms', null);

    if (alterError) {
      console.error('Error updating table:', alterError);
      throw alterError;
    }
  }
}