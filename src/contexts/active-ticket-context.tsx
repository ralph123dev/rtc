import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ShopProduct } from '@/data/shop-products';

const STORAGE_KEY = '@rtc_active_ticket';

export type ActiveTicket = {
  id: string;
  productId: string;
  title: string;
  category?: string;
  quantity: number;
  activatedAt: number; // timestamp in ms
  expiresAt: number;   // timestamp in ms
  durationSeconds: number;
  controlCode: string;
  expiredControlCode: string;
};

export function parseTicketDurationSeconds(title: string): number {
  const lower = title.toLowerCase();
  if (lower.includes('90 jours')) {
    return 90 * 24 * 60 * 60; // 90 days in seconds
  }
  if (lower.includes('30 jours') || lower.includes('mensuel')) {
    return 30 * 24 * 60 * 60; // 30 days
  }
  if (lower.includes('5 jours')) {
    return 5 * 24 * 60 * 60; // 5 days
  }
  if (lower.includes('1 jour')) {
    return 24 * 60 * 60; // 1 day
  }
  if (lower.includes('week-end')) {
    return 48 * 60 * 60; // 48 hours
  }
  if (lower.includes('1 passage') || lower.includes('passage') || lower.includes('billet')) {
    return 90 * 60; // 90 minutes (standard RTC transit transfer/validity)
  }
  // Default fallback for any duration
  return 90 * 60;
}

function generateRandomCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 11; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateExpiredCode(): string {
  const hex = '0123456789ABCDEF';
  let result = '1-';
  for (let i = 0; i < 12; i++) {
    result += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return result;
}

type ActiveTicketContextValue = {
  activeTicket: ActiveTicket | null;
  isLoaded: boolean;
  activateTicket: (
    product: Partial<ShopProduct> & { title: string; id?: string },
    customDurationSeconds?: number,
    forceNew?: boolean,
  ) => ActiveTicket;
  clearActiveTicket: () => Promise<void>;
  refreshFromStorage: () => Promise<void>;
};

const ActiveTicketContext = createContext<ActiveTicketContextValue | null>(null);

export function ActiveTicketProvider({ children }: { children: ReactNode }) {
  const [activeTicket, setActiveTicket] = useState<ActiveTicket | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadTicket = useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const parsed = JSON.parse(json) as ActiveTicket;
        setActiveTicket(parsed);
      }
    } catch {
      // ignore
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    void loadTicket();
  }, [loadTicket]);

  const activateTicket = useCallback(
    (
      product: Partial<ShopProduct> & { title: string; id?: string },
      customDurationSeconds?: number,
      forceNew = false,
    ): ActiveTicket => {
      // If a ticket is already active and not expired, keep it so countdown continues!
      if (
        !forceNew &&
        activeTicket &&
        (!product.id || activeTicket.productId === product.id || activeTicket.title === product.title) &&
        activeTicket.expiresAt > Date.now()
      ) {
        return activeTicket;
      }

      const now = Date.now();
      const durationSeconds = customDurationSeconds ?? parseTicketDurationSeconds(product.title);
      const expiresAt = now + durationSeconds * 1000;

      const newTicket: ActiveTicket = {
        id: `ticket-${now}`,
        productId: product.id || 'rtc-custom',
        title: product.title,
        quantity: 1,
        activatedAt: now,
        expiresAt,
        durationSeconds,
        controlCode: generateRandomCode(),
        expiredControlCode: generateExpiredCode(),
      };

      setActiveTicket(newTicket);
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newTicket));
      return newTicket;
    },
    [activeTicket],
  );

  const clearActiveTicket = useCallback(async () => {
    setActiveTicket(null);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      activeTicket,
      isLoaded,
      activateTicket,
      clearActiveTicket,
      refreshFromStorage: loadTicket,
    }),
    [activeTicket, isLoaded, activateTicket, clearActiveTicket, loadTicket],
  );

  return (
    <ActiveTicketContext.Provider value={value}>
      {children}
    </ActiveTicketContext.Provider>
  );
}

export function useActiveTicket(): ActiveTicketContextValue {
  const context = useContext(ActiveTicketContext);
  if (!context) {
    throw new Error('useActiveTicket must be used within an ActiveTicketProvider');
  }
  return context;
}
