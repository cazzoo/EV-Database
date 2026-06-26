import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get("vehicleId");
    const userId = searchParams.get("userId");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const where: any = {};
    if (vehicleId) {
      where.vehicleId = vehicleId;
    }
    if (userId) {
      where.userId = userId;
    }

    const comments = await prisma.comment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const totalCount = await prisma.comment.count({ where });

    return NextResponse.json({
      data: comments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be signed in to post a review" },
        { status: 401 }
      );
    }

    const data = await request.json();

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        userId: session.user.id,
        vehicleId: data.vehicleId,
      },
    });

    return NextResponse.json({
      success: true,
      data: comment,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
