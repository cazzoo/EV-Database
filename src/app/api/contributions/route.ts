import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  calculateXPForContribution,
  calculateCreditsForContribution,
} from "@/lib/gamification";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const vehicleId = searchParams.get("vehicleId");
    const status = searchParams.get("status");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (vehicleId) {
      where.vehicleId = vehicleId;
    }
    if (status) {
      where.status = status;
    }

    const contributions = await prisma.contribution.findMany({
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

    const totalCount = await prisma.contribution.count({ where });

    return NextResponse.json({
      data: contributions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate contribution type - match Prisma enum
    const validTypes = [
      "ADD_VEHICLE",
      "UPDATE_SPECS",
      "ADD_PHOTO",
      "REVIEW",
      "FIX_DATA",
    ];
    
    if (!validTypes.includes(data.type)) {
      return NextResponse.json(
        { error: "Invalid contribution type" },
        { status: 400 }
      );
    }

    // Create contribution
    const contribution = await prisma.contribution.create({
      data: {
        type: data.type,
        content: data.content || "",
        userId: data.userId || "anonymous", // Should get from auth
        vehicleId: data.vehicleId,
        status: data.status || "PENDING",
        xpReward: calculateXPForContribution(data.type),
        creditsCost: calculateCreditsForContribution(data.type),
      },
      include: {
        vehicle: {
          select: { id: true, make: true, model: true, year: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: contribution,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating contribution:", error);
    return NextResponse.json(
      { error: "Failed to create contribution" },
      { status: 500 }
    );
  }
}
