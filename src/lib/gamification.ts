// Gamification constants and utilities

export const ROLES = [
  { name: "Newcomer", minXP: 0, color: "badge-neutral" },
  { name: "Contributor", minXP: 100, color: "badge-info" },
  { name: "Expert", minXP: 500, color: "badge-primary" },
  { name: "Moderator", minXP: 2000, color: "badge-warning" },
  { name: "Champion", minXP: 5000, color: "badge-error" },
  { name: "Legend", minXP: 15000, color: "badge-success" },
] as const;

export const ACHIEVEMENTS = [
  {
    id: "first_edit",
    name: "First Steps",
    description: "Make your first contribution",
    xpReward: 10,
    icon: "✏️",
  },
  {
    id: "data_master",
    name: "Data Master",
    description: "Add 10 new EV entries",
    xpReward: 100,
    icon: "📊",
  },
  {
    id: "quality_contributor",
    name: "Quality Contributor",
    description: "Have 5 contributions approved",
    xpReward: 50,
    icon: "✅",
  },
  {
    id: "streak_week",
    name: "Consistent",
    description: "Contribute for 7 days in a row",
    xpReward: 75,
    icon: "🔥",
  },
  {
    id: "streak_month",
    name: "Dedicated",
    description: "Contribute for 30 days in a row",
    xpReward: 300,
    icon: "⭐",
  },
  {
    id: "reviewer",
    name: "Quality Guardian",
    description: "Review 25 contributions",
    xpReward: 125,
    icon: "🔍",
  },
  {
    id: "helpful",
    name: "Helpful Hand",
    description: "Receive 10 upvotes on contributions",
    xpReward: 50,
    icon: "👍",
  },
  {
    id: "expert_verifier",
    name: "Expert Verifier",
    description: "Verify 50 contributions",
    xpReward: 250,
    icon: "🎯",
  },
] as const;

// Match Prisma schema ContributionType enum
export const CONTRIBUTION_TYPES: Record<string, { xp: number; credits: number }> = {
  ADD_VEHICLE: { xp: 25, credits: 5 },
  UPDATE_SPECS: { xp: 10, credits: 2 },
  ADD_PHOTO: { xp: 15, credits: 3 },
  REVIEW: { xp: 20, credits: 4 },
  FIX_DATA: { xp: 30, credits: 6 },
};

export function getLevel(xp: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentRole: any = ROLES[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let nextRole: any = ROLES[1];
  
  for (let i = 0; i < ROLES.length; i++) {
    if (xp >= ROLES[i].minXP) {
      currentRole = ROLES[i];
      nextRole = ROLES[i + 1] || ROLES[i];
    }
  }
  
  const progress = nextRole.minXP > currentRole.minXP
    ? ((xp - currentRole.minXP) / (nextRole.minXP - currentRole.minXP)) * 100
    : 100;
  
  return {
    current: currentRole,
    next: nextRole,
    progress: Math.min(progress, 100),
    xpToNext: Math.max(nextRole.minXP - xp, 0),
  };
}

export function calculateXPForContribution(type: string): number {
  return CONTRIBUTION_TYPES[type]?.xp || 10;
}

export function calculateCreditsForContribution(type: string): number {
  return CONTRIBUTION_TYPES[type]?.credits || 1;
}
