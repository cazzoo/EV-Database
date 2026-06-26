import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getLevel } from "@/lib/gamification";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe") || "monthly"; // weekly, monthly, allTime
    const limit = searchParams.get("limit") || "20";
    const userId = searchParams.get("userId");

    let dateFilter: any = {};
    
    if (timeframe === "weekly") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      dateFilter = {
        contributions: {
          some: {
            createdAt: { gte: oneWeekAgo },
            status: "APPROVED",
          },
        },
      };
    } else if (timeframe === "monthly") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
      dateFilter = {
        contributions: {
          some: {
            createdAt: { gte: oneMonthAgo },
            status: "APPROVED",
          },
        },
      };
    }

    const users = await prisma.user.findMany({
      where: {
        ...dateFilter,
        NOT: { role: "ADMIN" }, // Exclude admins from public leaderboards
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        xp: true,
        totalEarned: true,
        contributions: {
          where: timeframe === "allTime" 
            ? { status: "APPROVED" }
            : { 
                status: "APPROVED",
                ...(timeframe === "weekly" ? {
                  createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                } : timeframe === "monthly" ? {
                  createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
                } : {}),
            },
          select: {
            id: true,
          },
        },
      },
      orderBy: { xp: "desc" },
      take: Number(limit),
    });

    // Calculate current contributions for the timeframe
    const leaderboard = users.map((user, index) => {
      const level = getLevel(user.xp);
      
      return {
        rank: index + 1,
        userId: user.id,
        name: user.name,
        image: user.image,
        xp: user.xp,
        contributions: user.contributions.length,
        level: level.current.name,
        nextLevel: level.next.name,
        progress: level.progress,
      };
    });

    return NextResponse.json({
      success: true,
      data: leaderboard,
      timeframe,
      meta: {
        totalContributors: await prisma.user.count({
          where: { NOT: { role: "ADMIN" } },
        }),
        yourRank: userId
          ? (await computeUserRank(userId))
          : null,
      },
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

async function computeUserRank(targetUserId: string): Promise<{
  rank: number;
  xp: number;
  contributions: number;
} | null> {
  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { xp: true },
  });
  if (!target) return null;

  const higher = await prisma.user.count({
    where: { xp: { gt: target.xp }, NOT: { role: "ADMIN" } },
  });

  const approvedCount = await prisma.contribution.count({
    where: { userId: targetUserId, status: "APPROVED" },
  });

  return { rank: higher + 1, xp: target.xp, contributions: approvedCount };
}
