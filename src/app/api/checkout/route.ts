import { NextResponse } from "next/server";
import { getProductById } from "../products/route";

export type CartItem = {
  id: string;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as { items: CartItem[] };

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    let totalCents = 0;

    for (const item of items) {
      const product = getProductById(item.id);
      if (!product) {
        return NextResponse.json({ error: `Invalid product id: ${item.id}` }, { status: 400 });
      }
      const qty = Math.max(0, Math.min(99, Math.floor(item.quantity || 0)));
      if (qty <= 0) {
        return NextResponse.json({ error: `Invalid quantity for ${item.id}` }, { status: 400 });
      }
      totalCents += product.priceCents * qty;
    }

    await new Promise((r) => setTimeout(r, 600));

    const orderId = `ord_${Math.random().toString(36).slice(2, 10)}`;

    return NextResponse.json({ success: true, orderId, totalCents });
  } catch (e) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}