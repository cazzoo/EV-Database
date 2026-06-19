// Shared helpers for vehicles

export function vehicleSlug(vehicle: {
  make: string;
  model: string;
}): string {
  return `${vehicle.make} ${vehicle.model}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function voteScore(votes: { value: number }[]): number {
  return votes.reduce((sum, v) => sum + v.value, 0);
}
