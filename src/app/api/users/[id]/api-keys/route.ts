import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

const TIER_RATE_LIMITS: Record<string, number> = {
  FREE: 100,
  BASIC: 5000,
  PRO: 100000,
  ENTERPRISE: 1000000,
};

function generateKey(tier: string): string {
  const prefix = tier === "FREE" ? "pk_test_ev_hub_" : "pk_ev_hub_";
  return prefix + crypto.randomBytes(12).toString("hex");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const keys = await prisma.apiKey.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
    });

    const masked = keys.map((k) => ({
      ...k,
      key: k.key.slice(0, k.key.length - 4).replace(/.(?!$)/g, "*") + k.key.slice(-4),
    }));

    return NextResponse.json({ success: true, data: masked });
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, tier, expiresInDays } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Key name is required" }, { status: 400 });
    }

    const keyTier = (tier || "FREE");
    const plainKey = generateKey(keyTier);
    const expiresAt = expiresInDays
      ? new Date(Date.now() + Number(expiresInDays) * 24 * 60 * 60 * 1000)
      : null;

    const apiKey = await prisma.apiKey.create({
      data: {
        key: plainKey,
        name,
        tier: keyTier as any,
        rateLimit: TIER_RATE_LIMITS[keyTier] || 100,
        userId: id,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      data: { ...apiKey, key: plainKey },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating API key:", error);
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 });
  }
}
