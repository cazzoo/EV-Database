import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEFAULT_NOTIFICATIONS = {
  emailNotifications: true,
  pushNotifications: false,
  newsletter: true,
  contributionUpdates: true,
  achievementAlerts: true,
  creditLowAlert: true,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { notifications: true },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const settings = user.notifications
      ? { ...DEFAULT_NOTIFICATIONS, ...JSON.parse(user.notifications) }
      : DEFAULT_NOTIFICATIONS;

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    await prisma.user.update({
      where: { id },
      data: { notifications: JSON.stringify(data) },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error saving notifications:", error);
    return NextResponse.json({ error: "Failed to save notifications" }, { status: 500 });
  }
}
