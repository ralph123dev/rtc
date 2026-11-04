import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ShopProduct } from '@/data/shop-products';

const STORAGE_KEY = '@rtc_active_ticket';
const ACTIVE_TICKETS_STORAGE_KEY = '@rtc_active_tickets';
const REMAINING_TICKETS_STORAGE_KEY = '@rtc_remaining_tickets';

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

export type PurchasedTicket = {
  id: string;
  productId: string;
  title: string;
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
  activeTickets: ActiveTicket[];
  remainingTickets: PurchasedTicket[];
  isLoaded: boolean;
  activateTicket: (
    product: Partial<ShopProduct> & { title: string; id?: string },
    customDurationSeconds?: number,
    forceNew?: boolean,
  ) => ActiveTicket;
  addPurchasedTickets: (products: readonly ShopProduct[]) => Promise<void>;
  activatePurchasedTicket: (ticketId: string) => Promise<ActiveTicket | null>;
  clearActiveTicket: () => Promise<void>;
  refreshFromStorage: () => Promise<void>;
};

const ActiveTicketContext = createContext<ActiveTicketContextValue | null>(null);

export function ActiveTicketProvider({ children }: { children: ReactNode }) {
  const [activeTickets, setActiveTickets] = useState<ActiveTicket[]>([]);
  const [remainingTickets, setRemainingTickets] = useState<PurchasedTicket[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const nextTicketId = useRef(0);
  const activatingTicketIds = useRef(new Set<string>());

  const loadTicket = useCallback(async () => {
    try {
      const [activeTicketJson, activeTicketsJson, remainingTicketsJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(ACTIVE_TICKETS_STORAGE_KEY),
        AsyncStorage.getItem(REMAINING_TICKETS_STORAGE_KEY),
      ]);
      const parsedActiveTickets = activeTicketsJson
        ? (JSON.parse(activeTicketsJson) as ActiveTicket[])
        : activeTicketJson
          ? [JSON.parse(activeTicketJson) as ActiveTicket]
          : [];
      const unexpiredTickets = parsedActiveTickets.filter(
        (ticket) => ticket.expiresAt > Date.now(),
      );
      setActiveTickets(unexpiredTickets);
      if (unexpiredTickets.length !== parsedActiveTickets.length || !activeTicketsJson) {
        await AsyncStorage.setItem(
          ACTIVE_TICKETS_STORAGE_KEY,
          JSON.stringify(unexpiredTickets),
        );
      }
      if (remainingTicketsJson) {
        setRemainingTickets(JSON.parse(remainingTicketsJson) as PurchasedTicket[]);
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

  const activeTicket = activeTickets[activeTickets.length - 1] ?? null;

  const activateTicket = useCallback(
    (
      product: Partial<ShopProduct> & { title: string; id?: string },
      customDurationSeconds?: number,
      forceNew = false,
    ): ActiveTicket => {
      // If a ticket is already active and not expired, keep it so countdown continues!
      const existingTicket = activeTickets.find(
        (ticket) =>
          (!product.id || ticket.productId === product.id || ticket.title === product.title) &&
          ticket.expiresAt > Date.now(),
      );
      if (!forceNew && existingTicket) {
        return existingTicket;
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

      const updatedTickets = [...activeTickets, newTicket];
      setActiveTickets(updatedTickets);
      void AsyncStorage.setItem(ACTIVE_TICKETS_STORAGE_KEY, JSON.stringify(updatedTickets));
      return newTicket;
    },
    [activeTickets],
  );

  const addPurchasedTickets = useCallback(
    async (products: readonly ShopProduct[]) => {
      if (products.length === 0) return;

      const newTickets = products.map((product) => {
        nextTicketId.current += 1;
        return {
          id: `purchased-${Date.now()}-${nextTicketId.current}`,
          productId: product.id,
          title: product.title,
        };
      });
      const updatedTickets = [...remainingTickets, ...newTickets];
      await AsyncStorage.setItem(
        REMAINING_TICKETS_STORAGE_KEY,
        JSON.stringify(updatedTickets),
      );
      setRemainingTickets(updatedTickets);
    },
    [remainingTickets],
  );

  const activatePurchasedTicket = useCallback(
    async (ticketId: string): Promise<ActiveTicket | null> => {
      if (activatingTicketIds.current.has(ticketId)) {
        return activeTickets.find((ticket) => ticket.id === ticketId) ?? null;
      }

      const purchasedTicket = remainingTickets.find((ticket) => ticket.id === ticketId);
      if (!purchasedTicket) return null;

      activatingTicketIds.current.add(ticketId);
      try {
        const now = Date.now();
        const durationSeconds = parseTicketDurationSeconds(purchasedTicket.title);
        const ticket: ActiveTicket = {
          id: purchasedTicket.id,
          productId: purchasedTicket.productId,
          title: purchasedTicket.title,
          quantity: 1,
          activatedAt: now,
          expiresAt: now + durationSeconds * 1000,
          durationSeconds,
          controlCode: generateRandomCode(),
          expiredControlCode: generateExpiredCode(),
        };
        const updatedTickets = remainingTickets.filter((item) => item.id !== ticketId);
        const updatedActiveTickets = [...activeTickets, ticket];

        await AsyncStorage.multiSet([
          [ACTIVE_TICKETS_STORAGE_KEY, JSON.stringify(updatedActiveTickets)],
          [REMAINING_TICKETS_STORAGE_KEY, JSON.stringify(updatedTickets)],
        ]);
        setActiveTickets(updatedActiveTickets);
        setRemainingTickets(updatedTickets);
        return ticket;
      } finally {
        activatingTicketIds.current.delete(ticketId);
      }
    },
    [activeTickets, remainingTickets],
  );

  const clearActiveTicket = useCallback(async () => {
    setActiveTickets([]);
    try {
      await AsyncStorage.multiRemove([STORAGE_KEY, ACTIVE_TICKETS_STORAGE_KEY]);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (activeTickets.length === 0) return;

    const timer = setInterval(() => {
      setActiveTickets((currentTickets) => {
        const unexpiredTickets = currentTickets.filter(
          (ticket) => ticket.expiresAt > Date.now(),
        );
        if (unexpiredTickets.length !== currentTickets.length) {
          void AsyncStorage.setItem(
            ACTIVE_TICKETS_STORAGE_KEY,
            JSON.stringify(unexpiredTickets),
          );
        }
        return unexpiredTickets;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTickets.length]);

  const value = useMemo(
    () => ({
      activeTicket,
      activeTickets,
      remainingTickets,
      isLoaded,
      activateTicket,
      addPurchasedTickets,
      activatePurchasedTicket,
      clearActiveTicket,
      refreshFromStorage: loadTicket,
    }),
    [
      activeTicket,
      activeTickets,
      remainingTickets,
      isLoaded,
      activateTicket,
      addPurchasedTickets,
      activatePurchasedTicket,
      clearActiveTicket,
      loadTicket,
    ],
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
