import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const make = searchParams.get("make");
    const model = searchParams.get("model");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const rangeMin = searchParams.get("rangeMin");
    const rangeMax = searchParams.get("rangeMax");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";

    const where: any = {};
    if (make) {
      where.make = { contains: make };
    }
    if (model) {
      where.model = { contains: model };
    }
    if (priceMin || priceMax) {
      where.price = {};
      if (priceMin) where.price.gte = Number(priceMin);
      if (priceMax) where.price.lte = Number(priceMax);
    }
    if (rangeMin || rangeMax) {
      where.range = {};
      if (rangeMin) where.range.gte = Number(rangeMin);
      if (rangeMax) where.range.lte = Number(rangeMax);
    }

    const vehicles = await prisma.electricVehicle.findMany({
      where,
      include: {
        charging: true,
        performance: true,
        votes: {
          select: {
            value: true,
          },
        },
      },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const totalCount = await prisma.electricVehicle.count({ where });

    const vehiclesWithStats = vehicles.map((vehicle) => {
      const voteScore = vehicle.votes.reduce((sum, vote) => sum + vote.value, 0);

      return {
        ...vehicle,
        voteScore,
        voteCount: vehicle.votes.length,
        votes: undefined,
      };
    });

    return NextResponse.json({
      data: vehiclesWithStats,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const vehicle = await prisma.electricVehicle.create({
      data: {
        make: data.make,
        model: data.model,
        year: data.year,
        trim: data.trim,
        battery: data.battery || 0,
        range: data.range || 0,
        efficiency: data.efficiency || 0,
        price: data.price,
        image: data.image,
      },
    });

    return NextResponse.json({
      success: true,
      data: vehicle,
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
