import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; methodId: string }> }
) {
  try {
    const { id, methodId } = await params;
    await prisma.paymentMethod.deleteMany({
      where: { id: methodId, userId: id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing payment method:", error);
    return NextResponse.json({ error: "Failed to remove payment method" }, { status: 500 });
  }
}
