import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function detectBrand(number: string): string {
  const n = number.replace(/\s/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^6/.test(n)) return "Discover";
  return "Card";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const methods = await prisma.paymentMethod.findMany({
      where: { userId: id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ success: true, data: methods });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json({ error: "Failed to fetch payment methods" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { number, expMonth, expYear, isDefault } = await request.json();

    if (!number || !expMonth || !expYear) {
      return NextResponse.json(
        { error: "Card number and expiration are required" },
        { status: 400 }
      );
    }

    const brand = detectBrand(number);
    const last4 = number.replace(/\s/g, "").slice(-4);

    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const method = await prisma.paymentMethod.create({
      data: {
        userId: id,
        brand,
        last4,
        expMonth: Number(expMonth),
        expYear: Number(expYear),
        isDefault: !!isDefault,
      },
    });

    return NextResponse.json({ success: true, data: method }, { status: 201 });
  } catch (error) {
    console.error("Error adding payment method:", error);
    return NextResponse.json({ error: "Failed to add payment method" }, { status: 500 });
  }
}
