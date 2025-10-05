"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import {
  GooglePayLogo,
  ApplePayLogo,
  PayPalLogo,
  StripeLogo,
  CashOnDeliveryLogo,
  CreditCardLogos,
} from "@/components/PaymentLogos";
import type { CartLine } from "@/components/CartDrawer";
import { formatCurrency } from "@/components/CartDrawer";
import { useCart } from "@/hooks/useCart";

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "googlepay" | "applepay" | "stripe" | "cod">("card");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

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

  const subtotalCents = useMemo(() => cartLines.reduce((s, i) => s + i.priceCents * i.quantity, 0), [cartLines]);
  const shippingCents = useMemo(() => {
    if (subtotalCents === 0) return 0;
    if (subtotalCents >= 5000) return 0;
    return 799;
  }, [subtotalCents]);
  const taxCents = useMemo(() => Math.round(subtotalCents * 0.08), [subtotalCents]);
  const totalCents = useMemo(() => subtotalCents + shippingCents + taxCents, [subtotalCents, shippingCents, taxCents]);

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

  const placeOrder = async () => {
    if (cartLines.length === 0) return;
    setPaymentError(null);

    if (paymentMethod === "card" || paymentMethod === "stripe") {
      const cleanNumber = cardNumber.replace(/\s|-/g, "");
      const numberOk = /^\d{13,19}$/.test(cleanNumber);
      const expiryOk = /^(0[1-9]|1[0-2])\/(\d{2})$/.test(expiry);
      const cvcOk = /^\d{3,4}$/.test(cvc);
      if (!cardName || !numberOk || !expiryOk || !cvcOk) {
        setPaymentError(
          "Please enter a valid card name, number, expiry (MM/YY), and CVC."
        );
        return;
      }
    }
    try {
      setPlacing(true);
      const items = cartLines.map((l) => ({ id: l.id, quantity: l.quantity }));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          paymentMethod,
          subtotal: subtotalCents,
          shipping: shippingCents,
          tax: taxCents,
          total: totalCents,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed");
      clearCart();
      alert(
        `Order ${data.orderId} placed! Total ${formatCurrency(data.totalCents)}`
      );
      router.push("/");
    } catch (e: any) {
      alert(e.message || "Checkout failed");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Checkout</h1>
            <p className="text-muted-foreground">
              Review your items and place your order.
            </p>
          </div>
          <Button variant="secondary" onClick={() => router.push("/")}>
            Continue Shopping
          </Button>
        </div>
        <Separator />

        {loading ? (
          <p className="mt-8 text-muted-foreground">Loading cart...</p>
        ) : error ? (
          <p className="mt-8 text-destructive">{error}</p>
        ) : cartLines.length === 0 ? (
          <div className="mt-8">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button className="mt-4" onClick={() => router.push("/")}>
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartLines.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-20 w-20 rounded-md object-cover bg-muted"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium leading-tight">
                              {item.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(item.priceCents)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Remove ${item.name}`}
                            onClick={() => remove(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => decrement(item.id)}
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
                              onClick={() => increment(item.id)}
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      {formatCurrency(subtotalCents)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Shipping</span>
                    <span className="font-medium">
                      {shippingCents === 0
                        ? "Free"
                        : formatCurrency(shippingCents)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Tax</span>
                    <span className="font-medium">
                      {formatCurrency(taxCents)}
                    </span>
                  </div>
                  {subtotalCents >= 5000 && (
                    <div className="text-xs text-green-600 font-medium">
                      🎉 You qualify for free shipping!
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-lg font-bold">
                      {formatCurrency(totalCents)}
                    </span>
                  </div>

                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Payment Method</h3>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) => setPaymentMethod(value as any)}
                    >
                      <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50">
                        <RadioGroupItem value="card" id="card" />
                        <CreditCardLogos className="h-4 w-auto" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="font-medium">Credit/Debit Card</div>
                          <div className="text-xs text-muted-foreground">
                            Visa, Mastercard, American Express
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <StripeLogo className="h-4 w-auto" />
                        <Label
                          htmlFor="stripe"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">Stripe</div>
                          <div className="text-xs text-muted-foreground">
                            Secure payment processing
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <PayPalLogo className="h-4 w-auto" />
                        <Label
                          htmlFor="paypal"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">PayPal</div>
                          <div className="text-xs text-muted-foreground">
                            Pay with your PayPal account
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50">
                        <RadioGroupItem value="googlepay" id="googlepay" />
                        <GooglePayLogo className="h-4 w-auto" />
                        <Label
                          htmlFor="googlepay"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">Google Pay</div>
                          <div className="text-xs text-muted-foreground">
                            Quick and secure mobile payment
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50">
                        <RadioGroupItem value="applepay" id="applepay" />
                        <ApplePayLogo className="h-4 w-auto" />
                        <Label
                          htmlFor="applepay"
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">Apple Pay</div>
                          <div className="text-xs text-muted-foreground">
                            Touch ID or Face ID
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-muted/50">
                        <RadioGroupItem value="cod" id="cod" />
                        <CashOnDeliveryLogo className="h-5 w-5" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-xs text-muted-foreground">
                            Pay when your order arrives
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    {(paymentMethod === "card" ||
                      paymentMethod === "stripe") && (
                      <div className="mt-4 space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input
                            id="cardName"
                            type="text"
                            placeholder="John Doe"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            inputMode="numeric"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input
                              id="expiry"
                              type="text"
                              placeholder="MM/YY"
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input
                              id="cvc"
                              type="text"
                              placeholder="123"
                              value={cvc}
                              onChange={(e) => setCvc(e.target.value)}
                              inputMode="numeric"
                            />
                          </div>
                        </div>
                        {paymentError && (
                          <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">
                            {paymentError}
                          </div>
                        )}
                      </div>
                    )}

                    {paymentMethod === "paypal" && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>PayPal Payment</strong>
                          <br />
                          You will be redirected to PayPal to complete your
                          payment securely.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "googlepay" && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">
                          <strong>Google Pay</strong>
                          <br />
                          Use your saved payment methods and shipping info for a
                          faster checkout.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "applepay" && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-800">
                          <strong>Apple Pay</strong>
                          <br />
                          Pay securely with Touch ID, Face ID, or your device
                          passcode.
                        </p>
                      </div>
                    )}

                    {paymentMethod === "cod" && (
                      <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <p className="text-sm text-orange-800">
                          <strong>Cash on Delivery</strong>
                          <br />
                          Pay with cash when your order is delivered to your
                          doorstep.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={cartLines.length === 0 || placing}
                    onClick={placeOrder}
                  >
                    {placing
                      ? "Placing order..."
                      : `Place Order • ${formatCurrency(totalCents)}`}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
