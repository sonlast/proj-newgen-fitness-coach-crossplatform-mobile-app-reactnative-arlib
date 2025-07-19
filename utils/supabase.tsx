// import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Ensure environment variables are defined
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // storage: typeof window !== 'undefined' ? AsyncStorage: undefined,
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// export const fetchData = async (table: string, columns: string = '*') => {
//   const { data, error } = await supabase
//     .from(table)
//     .select(columns);

//   if (error) throw new Error(error.message);
//   return data;
// };
export const fetchData = async (bucketName: string) => {
  try {
    const { data, error } = await supabase.storage.from(bucketName).list();

    if (error) throw error;

    console.log("Fetched files:", data);
    return data;
  } catch (err) {
    console.error("Error fetching files:", err);
    return [];
  }
};


// Insert data into Supabase
export const insertData = async (table: string, payload: object) => {
  const { data, error } = await supabase
    .from(table)
    .insert(payload);

  if (error) throw new Error(error.message);
  return data;
};

// Update data in Supabase
export const updateData = async (table: string, payload: object, filter: object) => {
  const { data, error } = await supabase
    .from(table)
    .update(payload)
    .match(filter);

  if (error) throw new Error(error.message);
  return data;
};

// Delete data from Supabase
export const deleteData = async (table: string, filter: object) => {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .match(filter);

  if (error) throw new Error(error.message);
  return data;
};

export const uploadAudio = async (filePath: any, fileBlob: any) => {
  try {
    // Uploading audio recording in supabase
    const { data, error } = await supabase.storage
      .from('ar-fitcoach')
      .upload(filePath, fileBlob, {
        contentType: "audio/m4a",
        upsert: true, // Allows overwriting files if needed
      });

    if (error) {
      throw error;
    }
    console.log("File uploaded successfully:", data);
    return data;
  } catch (err) {
    console.error("Upload error:", err);
  }
};