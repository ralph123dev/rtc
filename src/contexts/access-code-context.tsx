import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/auth-context';

export const ADMIN_EMAIL = 'rtcmailpro@gmail.com';

type AccessCodeContextValue = {
  isUnlocked: boolean;
  isLoading: boolean;
  unlock: () => void;
  lock: () => Promise<void>;
  validateCode: (code: string) => Promise<{ success: boolean; error?: string }>;
  recheckAccess: () => Promise<boolean>;
};

const AccessCodeContext = createContext<AccessCodeContextValue | null>(null);

export function AccessCodeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkAccessForUser = useCallback(async (userId: string, email?: string): Promise<boolean> => {
    if (email?.trim().toLowerCase() === ADMIN_EMAIL) {
      return true;
    }

    try {
      const storedCode = await AsyncStorage.getItem(`@rtc_access_code_${userId}`);
      if (!storedCode) {
        return false;
      }

      const { data, error } = await supabase.rpc('verify_access_code', {
        entered_code: storedCode.trim(),
      });

      if (!error && typeof data === 'boolean') {
        if (!data) {
          await AsyncStorage.removeItem(`@rtc_access_code_${userId}`);
        }
        return data;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('access_code')
        .eq('id', userId)
        .single();

      if (!profileError && profileData?.access_code) {
        const matches = profileData.access_code.trim() === storedCode.trim();
        if (!matches) {
          await AsyncStorage.removeItem(`@rtc_access_code_${userId}`);
        }
        return matches;
      }
    } catch {
      return false;
    }

    return false;
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      if (!user) {
        if (isMounted) {
          setIsUnlocked(false);
          setIsLoading(false);
        }
        return;
      }

      if (user.email?.trim().toLowerCase() === ADMIN_EMAIL) {
        if (isMounted) {
          setIsUnlocked(true);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      const hasAccess = await checkAccessForUser(user.id, user.email);
      if (isMounted) {
        setIsUnlocked(hasAccess);
        setIsLoading(false);
      }
    }

    void init();

    return () => {
      isMounted = false;
    };
  }, [user, checkAccessForUser]);

  const validateCode = useCallback(
    async (code: string): Promise<{ success: boolean; error?: string }> => {
      const trimmed = code.trim();
      if (!trimmed) {
        return { success: false, error: 'Veuillez saisir un code.' };
      }

      if (!user) {
        return { success: false, error: 'Vous devez être connecté.' };
      }

      if (user.email?.trim().toLowerCase() === ADMIN_EMAIL) {
        setIsUnlocked(true);
        return { success: true };
      }

      try {
        const { data, error } = await supabase.rpc('verify_access_code', {
          entered_code: trimmed,
        });

        if (!error && typeof data === 'boolean') {
          if (data === true) {
            await AsyncStorage.setItem(`@rtc_access_code_${user.id}`, trimmed);
            setIsUnlocked(true);
            return { success: true };
          } else {
            return {
              success: false,
              error: 'Code incorrect ou invalidé. Veuillez demander votre nouveau code à l’administrateur.',
            };
          }
        }
      } catch {
        // Fallback below
      }

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('access_code')
          .eq('id', user.id)
          .single();

        if (!profileError && profileData?.access_code) {
          if (profileData.access_code.trim() === trimmed) {
            await AsyncStorage.setItem(`@rtc_access_code_${user.id}`, trimmed);
            setIsUnlocked(true);
            return { success: true };
          }
        }
      } catch {
        // Ignore
      }

      return {
        success: false,
        error: 'Code incorrect ou inexistant. Veuillez contacter l’administrateur de l’application.',
      };
    },
    [user],
  );

  const unlock = useCallback(() => {
    setIsUnlocked(true);
  }, []);

  const lock = useCallback(async () => {
    if (user) {
      try {
        await AsyncStorage.removeItem(`@rtc_access_code_${user.id}`);
      } catch {
        // Ignore
      }
    }
    setIsUnlocked(false);
  }, [user]);

  const recheckAccess = useCallback(async (): Promise<boolean> => {
    if (!user) {
      setIsUnlocked(false);
      return false;
    }
    const hasAccess = await checkAccessForUser(user.id, user.email);
    setIsUnlocked(hasAccess);
    return hasAccess;
  }, [user, checkAccessForUser]);

  const value = useMemo(
    () => ({
      isUnlocked,
      isLoading,
      unlock,
      lock,
      validateCode,
      recheckAccess,
    }),
    [isUnlocked, isLoading, unlock, lock, validateCode, recheckAccess],
  );

  return <AccessCodeContext.Provider value={value}>{children}</AccessCodeContext.Provider>;
}

export function useAccessCode() {
  const context = useContext(AccessCodeContext);
  if (context === null) {
    throw new Error('useAccessCode doit être utilisé dans un AccessCodeProvider.');
  }
  return context;
}
