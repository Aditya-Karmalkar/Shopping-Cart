"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
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
  sizes?: string[];
};

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data.products || []);
        const found = data.products.find((p: Product) => p.id === params.id);
        if (!found) {
          setError("Product not found");
        } else {
          setProduct(found);
          if (found.sizes && found.sizes.length > 0) {
            setSelectedSize(found.sizes[0]);
          }
        }
      } catch (e) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

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

  const handleAddToCart = (productId: string) => {
    if (product?.sizes && !selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(productId);
    alert("Added to cart!");
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

  const buyNow = (productId: string) => {
    if (product?.sizes && !selectedSize) {
      alert("Please select a size");
      return;
    }
    addToCart(productId);
    router.push("/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen py-10">
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen py-10">
        <div className="container mx-auto px-4">
          <p className="text-destructive">{error || "Product not found"}</p>
          <Button asChild className="mt-4">
            <Link href="/">Back to Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </Button>
          <CartDrawer
            items={cartLines}
            onIncrement={increment}
            onDecrement={decrement}
            onRemove={remove}
            onCheckout={checkout}
            cartState={cart}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="mt-2 text-2xl font-semibold text-primary">
              {formatCurrency(product.priceCents)}
            </p>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium mb-2">Description</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium mb-3">Select Size</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        onClick={() => setSelectedSize(size)}
                        className="min-w-[60px]"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={() => handleAddToCart(product.id)}
                  variant="outline"
                  className="flex-1"
                  disabled={checkingOut}
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={() => buyNow(product.id)}
                  className="flex-1"
                  disabled={checkingOut}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
