import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        xp: true,
        credits: true,
        totalEarned: true,
        level: true,
        streak: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user contributions count
    const totalContributions = await prisma.contribution.count({
      where: {
        userId: id,
        status: "APPROVED",
      },
    });

    // Get user contributions
    const contributions = await prisma.contribution.findMany({
      where: {
        userId: id,
        status: "APPROVED",
      },
      select: {
        id: true,
        type: true,
        status: true,
        createdAt: true,
        xpReward: true,
        creditsCost: true,
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Recent contributions
    });

    // Get user achievements through UserAchievement
    const userAchievements = await prisma.userAchievement.findMany({
      where: {
        userId: id,
      },
      include: {
        achievement: {
          select: {
            id: true,
            name: true,
            description: true,
            icon: true,
            xpReward: true,
          },
        },
      },
      orderBy: {
        earnedAt: "desc",
      },
    });

    const achievements = userAchievements.map((ua) => ({
      id: ua.achievement.id,
      name: ua.achievement.name,
      description: ua.achievement.description,
      icon: ua.achievement.icon,
      xpReward: ua.achievement.xpReward,
      earnedAt: ua.earnedAt,
    }));

    // Calculate contribution statistics
    const contributionTypes = await prisma.contribution.groupBy({
      by: ["type"],
      where: {
        userId: id,
        status: "APPROVED",
      },
      _count: {
        id: true,
      },
    });

    // Get weekly activity
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyContributions = await prisma.contribution.count({
      where: {
        userId: id,
        status: "APPROVED",
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    });

    // Get monthly activity
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    const monthlyContributions = await prisma.contribution.count({
      where: {
        userId: id,
        status: "APPROVED",
        createdAt: {
          gte: oneMonthAgo,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          ...user,
          totalContributions,
        },
        contributions,
        achievements,
        contributionTypes,
        weeklyContributions,
        monthlyContributions,
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user stats" },
      { status: 500 }
    );
  }
}
