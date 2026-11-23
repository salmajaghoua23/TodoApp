import 'react-native-url-polyfill/auto';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_KEY, SUPABASE_URL } from './config';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage, // la session reste active après redémarrage
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Rafraîchit le token seulement quand l'app est au premier plan.


AppState.addEventListener('change', state => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh().catch(error => {
      console.error('Erreur démarrage auto-refresh:', error);
    });
  } else {
    supabase.auth.stopAutoRefresh().catch(error => {
      console.error('Erreur arrêt auto-refresh:', error);
    });
  }
});


