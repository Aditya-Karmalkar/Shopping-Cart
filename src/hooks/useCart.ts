"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const LS_KEY = "cart_cart_v1";

export type CartState = Record<string, number>;

export function useCart() {
  const [cart, setCartState] = useState<CartState>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const isUpdatingFromStorage = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      
      if (stored) {
        const parsedCart = JSON.parse(stored);
        setCartState(parsedCart);
      }
    } catch (error) {
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || isUpdatingFromStorage.current) return;
    
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(cart));
      window.dispatchEvent(new StorageEvent('storage', {
        key: LS_KEY,
        newValue: JSON.stringify(cart),
        storageArea: localStorage
      }));
    } catch (error) {
    }
  }, [cart, isLoaded]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LS_KEY && e.newValue) {
        try {
          const newCart = JSON.parse(e.newValue);
          isUpdatingFromStorage.current = true;
          setCartState(newCart);
          setTimeout(() => {
            isUpdatingFromStorage.current = false;
          }, 0);
        } catch (error) {
          }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const setCart = useCallback((updater: CartState | ((prev: CartState) => CartState)) => {
    setCartState(prev => {
      const newCart = typeof updater === 'function' ? updater(prev) : updater;
      return newCart;
    });
  }, []);

  const addToCart = useCallback((id: string, quantity: number = 1) => {
    setCart(prev => ({
      ...prev,
      [id]: Math.min(99, (prev[id] || 0) + quantity)
    }));
  }, [setCart]);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      delete newCart[id];
      return newCart;
    });
  }, [setCart]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(prev => ({
        ...prev,
        [id]: Math.min(99, quantity)
      }));
    }
  }, [setCart, removeFromCart]);

  const clearCart = useCallback(() => {
    setCart({});
  }, [setCart]);

  const getItemCount = useCallback(() => {
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  }, [cart]);

  return {
    cart,
    setCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
    isLoaded
  };
}
