import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { ShopProduct } from '@/data/shop-products';

export type CartEntry = {
  id: string;
  product: ShopProduct;
};

export type GroupedCartItem = {
  product: ShopProduct;
  quantity: number;
  subtotalInCents: number;
};

type ShopCartContextValue = {
  items: CartEntry[];
  groupedItems: GroupedCartItem[];
  itemCount: number;
  totalInCents: number;
  addItem: (product: ShopProduct) => void;
  removeItem: (productId: string) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
  getItemCount: (productId: string) => number;
  toastMessage: string | null;
  showToast: (message: string) => void;
  dismissToast: () => void;
};

const ShopCartContext = createContext<ShopCartContextValue | null>(null);

export function ShopCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartEntry[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const nextId = useRef(0);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const showToast = useCallback(
    (message: string) => {
      setToastMessage(message);
    },
    [],
  );

  const addItem = useCallback((product: ShopProduct) => {
    nextId.current += 1;
    setItems((currentItems) => [
      ...currentItems,
      { id: `${product.id}-${nextId.current}`, product },
    ]);
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) => {
      const index = currentItems.findLastIndex
        ? currentItems.findLastIndex((e) => e.product.id === productId)
        : currentItems.map((e) => e.product.id).lastIndexOf(productId);
      if (index === -1) return currentItems;
      const copy = [...currentItems];
      copy.splice(index, 1);
      return copy;
    });
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setItems((currentItems) => currentItems.filter((e) => e.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemCount = useCallback(
    (productId: string) => {
      return items.filter((entry) => entry.product.id === productId).length;
    },
    [items],
  );

  const groupedItems = useMemo<GroupedCartItem[]>(() => {
    const map = new Map<string, GroupedCartItem>();
    for (const entry of items) {
      const existing = map.get(entry.product.id);
      if (existing) {
        existing.quantity += 1;
        existing.subtotalInCents += entry.product.priceInCents;
      } else {
        map.set(entry.product.id, {
          product: entry.product,
          quantity: 1,
          subtotalInCents: entry.product.priceInCents,
        });
      }
    }
    return Array.from(map.values());
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      groupedItems,
      itemCount: items.length,
      totalInCents: items.reduce((total, entry) => total + entry.product.priceInCents, 0),
      addItem,
      removeItem,
      removeProduct,
      clearCart,
      getItemCount,
      toastMessage,
      showToast,
      dismissToast,
    }),
    [items, groupedItems, addItem, removeItem, removeProduct, clearCart, getItemCount, toastMessage, showToast, dismissToast],
  );

  return <ShopCartContext.Provider value={value}>{children}</ShopCartContext.Provider>;
}

export function useShopCart(): ShopCartContextValue {
  const context = useContext(ShopCartContext);
  if (context === null) {
    throw new Error('useShopCart doit être utilisé dans ShopCartProvider.');
  }
  return context;
}
