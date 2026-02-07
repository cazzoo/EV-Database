import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Get user achievements through UserAchievement join table
    const userAchievements = await prisma.userAchievement.findMany({
      where: {
        userId: id,
      },
      include: {
        achievement: true,
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
      rarity: ua.achievement.rarity,
      earnedAt: ua.earnedAt,
    }));

    return NextResponse.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { achievementId } = await request.json();

    // Award an achievement to the user
    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId: id,
        achievementId: achievementId,
      },
      include: {
        achievement: true,
      },
    });

    // Award XP from the achievement
    await prisma.user.update({
      where: { id },
      data: {
        xp: { increment: userAchievement.achievement.xpReward },
      },
    });

    return NextResponse.json({
      success: true,
      data: userAchievement,
    }, { status: 201 });
  } catch (error) {
    console.error("Error awarding achievement:", error);
    return NextResponse.json(
      { error: "Failed to award achievement" },
      { status: 500 }
    );
  }
}
