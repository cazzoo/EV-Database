"use client";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity?: string;
  earnedAt?: string | Date;
}

interface AchievementsProps {
  achievements: Achievement[];
}

const RARITY_STYLES: Record<string, string> = {
  COMMON: "ring-base-300",
  UNCOMON: "ring-info",
  RARE: "ring-primary",
  EPIC: "ring-secondary",
  LEGENDARY: "ring-accent",
};

export default function Achievements({ achievements }: AchievementsProps) {
  const unlocked = achievements.filter((a) => a.earnedAt);

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">
          <span className="text-2xl">🏆</span> Achievements
          <div className="badge badge-primary">
            {unlocked.length}/{achievements.length}
          </div>
        </h2>

        {achievements.length === 0 ? (
          <p className="text-base-content/60 py-6 text-center">
            No achievements available yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {achievements.map((achievement) => {
              const isUnlocked = !!achievement.earnedAt;
              return (
                <div
                  key={achievement.id}
                  className="tooltip tooltip-top tooltip-primary w-full"
                  data-tip={
                    isUnlocked
                      ? `${achievement.description} (+${achievement.xpReward} XP)`
                      : `Locked: ${achievement.description}`
                  }
                >
                  <div
                    className={`card bg-base-200 p-4 text-center transition-all ring-2 ${
                      isUnlocked
                        ? `${RARITY_STYLES[achievement.rarity || "COMMON"] || "ring-primary"} ring-offset-2`
                        : "opacity-50 grayscale ring-transparent"
                    }`}
                  >
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <div className="font-semibold text-sm">{achievement.name}</div>
                    <div className="text-xs text-base-content/60 mt-1">
                      {isUnlocked ? `+${achievement.xpReward} XP` : "🔒 Locked"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
