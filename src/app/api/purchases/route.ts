import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (type) {
      where.type = type;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const totalCount = await prisma.transaction.count({ where });

    return NextResponse.json({
      data: transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Create a purchase transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: data.userId,
        type: "PURCHASE_CREDITS",
        amount: data.amount || 0,
        description: data.description || "Credit purchase",
      },
    });

    // If this is an immediate purchase (not pending payment), add credits
    if (data.immediate) {
      await prisma.user.update({
        where: { id: data.userId },
        data: {
          credits: { increment: data.amount },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: transaction,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
