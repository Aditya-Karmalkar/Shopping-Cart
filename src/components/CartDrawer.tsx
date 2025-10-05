"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";

export type CartLine = {
  id: string;
  name: string;
  priceCents: number;
  image: string;
  quantity: number;
};

type Props = {
  items: CartLine[];
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  onCheckout: () => Promise<void> | void;
  cartState?: Record<string, number>;
};

export function formatCurrency(paise: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(paise / 100);
}

export default function CartDrawer({
  items,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
  cartState,
}: Props) {
  const router = useRouter();
  const totalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0),
    [items]
  );

  const handleCheckout = () => {
    const currentCart =
      cartState ||
      items.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {} as Record<string, number>);

    try {
      localStorage.setItem("orchids_cart_v1", JSON.stringify(currentCart));
      const verification = localStorage.getItem("orchids_cart_v1");
      window.dispatchEvent(new Event("storage"));
      router.push("/checkout");
    } catch (error) {
      router.push("/checkout");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" className="relative">
          <ShoppingCart className="h-4 w-4 mr-2" /> Cart
          {items.length > 0 && (
            <span className="absolute -right-2 -top-2 h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-xs grid place-items-center px-1">
              {items.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4">
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <Separator />
        <ScrollArea className="flex-1 p-4">
          {items.length === 0 ? (
            <p className="text-muted-foreground">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-md object-cover bg-muted"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium leading-tight">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(item.priceCents)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => onRemove(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDecrement(item.id)}
                          aria-label={`Decrease ${item.name}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onIncrement(item.id)}
                          aria-label={`Increase ${item.name}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(item.priceCents * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
        <Separator />
        <SheetFooter className="p-4 gap-3">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="text-base font-semibold">
              {formatCurrency(totalCents)}
            </span>
          </div>
          <div className="flex gap-2 w-full">
            <Button
              onClick={handleCheckout}
              disabled={items.length === 0}
              className="flex-1"
            >
              Checkout Now
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
