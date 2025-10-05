"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CartDrawer, {
  type CartLine,
  formatCurrency,
} from "@/components/CartDrawer";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
};

export default function ShoppingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (e) {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cartLines: CartLine[] = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const p = products.find((x) => x.id === id);
        if (!p) return null;
        return {
          id: p.id,
          name: p.name,
          image: p.image,
          priceCents: p.priceCents,
          quantity: qty,
        } as CartLine;
      })
      .filter(Boolean) as CartLine[];
  }, [cart, products]);

  const totalCents = useMemo(
    () => cartLines.reduce((s, i) => s + i.priceCents * i.quantity, 0),
    [cartLines]
  );

  const handleAddToCart = (id: string) => {
    addToCart(id);
  };

  const increment = (id: string) => {
    updateQuantity(id, (cart[id] || 0) + 1);
  };

  const decrement = (id: string) => {
    const currentQty = cart[id] || 0;
    if (currentQty <= 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, currentQty - 1);
    }
  };

  const remove = (id: string) => {
    removeFromCart(id);
  };

  const checkout = async () => {
    try {
      setCheckingOut(true);
      const items = cartLines.map((l) => ({ id: l.id, quantity: l.quantity }));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed");
      alert(
        `Order ${data.orderId} placed! Total ${formatCurrency(data.totalCents)}`
      );
      clearCart();
    } catch (e: any) {
      alert(e.message || "Checkout failed");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              Browse products and add to your cart.
            </p>
          </div>
          <CartDrawer
            items={cartLines}
            onIncrement={increment}
            onDecrement={decrement}
            onRemove={remove}
            onCheckout={checkout}
            cartState={cart}
          />
        </div>
        <Separator />
        {loading ? (
          <p className="mt-8 text-muted-foreground">Loading products...</p>
        ) : error ? (
          <p className="mt-8 text-destructive">{error}</p>
        ) : (
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <li key={p.id} className="relative">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <Link href={`/products/${p.id}`}>
                      <CardTitle className="text-base leading-tight hover:underline cursor-pointer">
                        {p.name}
                      </CardTitle>
                    </Link>
                  </CardHeader>
                  <CardContent className="pt-0 flex-1">
                    <Link href={`/products/${p.id}`}>
                      <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted cursor-pointer hover:opacity-90 transition-opacity">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </Link>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                      {p.description}
                    </p>
                    <p className="mt-2 font-semibold">
                      {formatCurrency(p.priceCents)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(p.id)}
                      disabled={checkingOut}
                    >
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-10 flex items-center justify-end">
          <div className="text-sm text-muted-foreground">
            Subtotal:{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(totalCents)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
