import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type UserProfile = {
  id: string;
  clientId: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null; data?: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function generateDeterministicClientId(userId: string): string {
  // Créer un identifiant numérique à 6 chiffres à partir de l'UUID si aucun n'est encore stocké
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) % 900000;
  }
  return String(100000 + Math.abs(hash));
}

function getDisplayName(currentUser: User): string {
  const emailName = currentUser.email?.split('@')[0]?.trim();
  return emailName || currentUser.user_metadata?.full_name || 'Utilisateur';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (!error && data) {
        setProfile({
          id: currentUser.id,
          clientId: data.client_id || generateDeterministicClientId(currentUser.id),
          fullName: getDisplayName(currentUser),
          email: data.email || currentUser.email || '',
          avatarUrl: data.avatar_url || currentUser.user_metadata?.avatar_url || null,
        });
        return;
      }
    } catch {
      // Ignorer l'erreur réseau ou table non encore créée
    }

    // Profil par défaut à partir des métadonnées Supabase Auth
    setProfile({
      id: currentUser.id,
      clientId: generateDeterministicClientId(currentUser.id),
      fullName: getDisplayName(currentUser),
      email: currentUser.email || '',
      avatarUrl: currentUser.user_metadata?.avatar_url || null,
    });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        void fetchProfile(session.user);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        void fetchProfile(session.user);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        return { error: error ? new Error(error.message) : null };
      } catch (err: any) {
        return { error: new Error(err.message || 'Erreur lors de la connexion') };
      }
    },
    [],
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        const message =
          error?.code === 'over_email_send_rate_limit'
            ? "La limite d’envoi des e-mails Supabase est atteinte. Réessayez plus tard ou configurez un serveur SMTP personnalisé dans Supabase."
            : error?.message;
        return {
          error: error ? new Error(message) : null,
          data,
        };
      } catch (err: any) {
        return { error: new Error(err.message || "Erreur lors de l'inscription") };
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setSession(null);
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user);
    }
  }, [fetchProfile, user]);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      isLoading,
      signIn,
      signUp,
      signOut,
      refreshProfile,
    }),
    [session, user, profile, isLoading, signIn, signUp, signOut, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé au sein de AuthProvider');
  }
  return context;
}
