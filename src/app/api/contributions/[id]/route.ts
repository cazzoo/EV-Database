import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateXPForContribution, calculateCreditsForContribution } from "@/lib/gamification";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const contribution = await prisma.contribution.findUnique({
      where: { id },
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
    });

    if (!contribution) {
      return NextResponse.json(
        { error: "Contribution not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: contribution,
    });
  } catch (error) {
    console.error("Error fetching contribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch contribution" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Handle status transitions
    if (data.status === "APPROVED") {
      const contribution = await prisma.contribution.findUnique({
        where: { id },
      });

      if (contribution) {
        // Calculate rewards
        const xp = calculateXPForContribution(contribution.type);
        const credits = calculateCreditsForContribution(contribution.type);

        // Update user XP and credits
        await prisma.user.update({
          where: { id: contribution.userId },
          data: {
            xp: { increment: xp },
            credits: { increment: credits },
            totalEarned: { increment: credits },
          },
        });

        // Handle specific contribution types
        if (contribution.type === "ADD_VEHICLE" && contribution.content) {
          try {
            const vehicleData = JSON.parse(contribution.content);
            // Create vehicle from contribution data
            await prisma.electricVehicle.create({
              data: {
                make: vehicleData.make,
                model: vehicleData.model,
                year: vehicleData.year,
                trim: vehicleData.trim,
                battery: vehicleData.battery || 0,
                range: vehicleData.range || 0,
                efficiency: vehicleData.efficiency || 0,
                price: vehicleData.price,
              },
            });
          } catch (e) {
            console.error("Error parsing vehicle data:", e);
          }
        } else if (contribution.type === "UPDATE_SPECS" && contribution.vehicleId && contribution.content) {
          try {
            const updateData = JSON.parse(contribution.content);
            // Update vehicle specifications
            await prisma.electricVehicle.update({
              where: { id: contribution.vehicleId },
              data: updateData,
            });
          } catch (e) {
            console.error("Error parsing update data:", e);
          }
        }
      }
    }

    const updateData: Record<string, unknown> = {};
    if (data.status) updateData.status = data.status;
    if (data.content) updateData.content = data.content;
    if (data.xpReward !== undefined) updateData.xpReward = data.xpReward;
    if (data.creditsCost !== undefined) updateData.creditsCost = data.creditsCost;
    if (data.status === "APPROVED" || data.status === "REJECTED") {
      updateData.reviewedAt = new Date();
    }

    const updatedContribution = await prisma.contribution.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedContribution,
    });
  } catch (error) {
    console.error("Error updating contribution:", error);
    return NextResponse.json(
      { error: "Failed to update contribution" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.contribution.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Contribution deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contribution:", error);
    return NextResponse.json(
      { error: "Failed to delete contribution" },
      { status: 500 }
    );
  }
}
