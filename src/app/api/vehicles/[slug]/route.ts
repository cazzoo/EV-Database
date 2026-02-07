import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const vehicle = await prisma.electricVehicle.findFirst({
      where: {
        OR: [
          { id: slug },
          {
            AND: [
              { make: { contains: slug.split("-")[0] || "" } },
              { model: { contains: slug.split("-").slice(1).join(" ") || "" } },
            ],
          },
        ],
      },
      include: {
        charging: true,
        performance: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 20,
        },
        votes: true,
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      );
    }

    // Calculate vote score
    const voteScore = vehicle.votes.reduce((sum, vote) => sum + vote.value, 0);

    const vehicleWithStats = {
      ...vehicle,
      voteScore,
      voteCount: vehicle.votes.length,
      commentCount: vehicle.comments.length,
    };

    return NextResponse.json({
      success: true,
      data: vehicleWithStats,
    });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const data = await request.json();

    const updatedVehicle = await prisma.electricVehicle.update({
      where: { id: slug },
      data: {
        make: data.make,
        model: data.model,
        year: data.year,
        trim: data.trim,
        battery: data.battery,
        range: data.range,
        efficiency: data.efficiency,
        price: data.price,
        image: data.image,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedVehicle,
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return NextResponse.json(
      { error: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    await prisma.electricVehicle.delete({
      where: { id: slug },
    });

    return NextResponse.json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return NextResponse.json(
      { error: "Failed to delete vehicle" },
      { status: 500 }
    );
  }
}
