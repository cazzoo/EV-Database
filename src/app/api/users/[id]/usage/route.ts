import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") || "30"; // default 30 days

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Get API usage statistics
    const apiUsage = await prisma.apiUsage.findMany({
      where: {
        userId: id,
        createdAt: { gte: daysAgo },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate statistics
    const totalCalls = apiUsage.length;
    const totalCreditsUsed = apiUsage.reduce((sum, usage) => sum + usage.creditsUsed, 0);
    const successfulCalls = apiUsage.filter((u) => u.statusCode >= 200 && u.statusCode < 300).length;
    const failedCalls = apiUsage.filter((u) => u.statusCode >= 400).length;
    const avgResponseTime = apiUsage.length > 0
      ? Math.round(apiUsage.reduce((sum, u) => sum + u.responseTime, 0) / apiUsage.length)
      : 0;

    // Group by endpoint
    const endpointUsage = apiUsage.reduce((acc, usage) => {
      const key = `${usage.method} ${usage.endpoint}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Daily usage trend
    const dailyUsage = apiUsage.reduce((acc, usage) => {
      const date = usage.createdAt.toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = { calls: 0, credits: 0 };
      }
      acc[date].calls += 1;
      acc[date].credits += usage.creditsUsed;
      return acc;
    }, {} as Record<string, { calls: number; credits: number }>);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalCalls,
          totalCreditsUsed,
          successfulCalls,
          failedCalls,
          successRate: totalCalls > 0 ? Math.round((successfulCalls / totalCalls) * 100) : 100,
          avgResponseTime,
        },
        endpointUsage: Object.entries(endpointUsage)
          .map(([endpoint, count]) => ({ endpoint, count }))
          .sort((a, b) => b.count - a.count),
        dailyUsage: Object.entries(dailyUsage)
          .map(([date, stats]) => ({ date, ...stats }))
          .sort((a, b) => a.date.localeCompare(b.date)),
        recentCalls: apiUsage.slice(0, 100),
      },
    });
  } catch (error) {
    console.error("Error fetching API usage:", error);
    return NextResponse.json(
      { error: "Failed to fetch API usage" },
      { status: 500 }
    );
  }
}
