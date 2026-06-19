import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        website: true,
        role: true,
        createdAt: true,
        notifications: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updateData: Record<string, string | null> = {};
    if (typeof data.name === "string") updateData.name = data.name;
    if (typeof data.email === "string") updateData.email = data.email;
    if (typeof data.image === "string") updateData.image = data.image;
    if (typeof data.bio === "string") updateData.bio = data.bio;
    if (typeof data.location === "string") updateData.location = data.location;
    if (typeof data.website === "string") updateData.website = data.website;

    if (updateData.email) {
      const existing = await prisma.user.findUnique({
        where: { email: updateData.email },
      });
      if (existing && existing.id !== id) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        website: true,
        role: true,
      },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json().catch(() => ({}));

    if (data.confirm !== true) {
      return NextResponse.json(
        { error: "Confirmation required" },
        { status: 400 }
      );
    }

    // Verify password if provided
    if (data.password) {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user || !user.password) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      const valid = await bcrypt.compare(data.password, user.password);
      if (!valid) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
      }
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting account:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
