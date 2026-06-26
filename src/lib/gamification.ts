// Gamification constants and utilities

export const ROLES = [
  { name: "Newcomer", minXP: 0, color: "badge-neutral" },
  { name: "Contributor", minXP: 100, color: "badge-info" },
  { name: "Expert", minXP: 500, color: "badge-primary" },
  { name: "Moderator", minXP: 2000, color: "badge-warning" },
  { name: "Champion", minXP: 5000, color: "badge-error" },
  { name: "Legend", minXP: 15000, color: "badge-success" },
] as const;

type Role = (typeof ROLES)[number];

// Match Prisma schema ContributionType enum
export const CONTRIBUTION_TYPES: Record<string, { xp: number; credits: number }> = {
  ADD_VEHICLE: { xp: 25, credits: 5 },
  UPDATE_SPECS: { xp: 10, credits: 2 },
  ADD_PHOTO: { xp: 15, credits: 3 },
  REVIEW: { xp: 20, credits: 4 },
  FIX_DATA: { xp: 30, credits: 6 },
};

export function getLevel(xp: number) {
  let currentRole: Role = ROLES[0];
  let nextRole: Role = ROLES[1];
  
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
