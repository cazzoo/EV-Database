"use client";

import { ACHIEVEMENTS } from "@/lib/gamification";

interface Achievement {
  id: string;
  unlockedAt?: Date;
}

interface AchievementsProps {
  userAchievements: Achievement[];
}

export default function Achievements({ userAchievements }: AchievementsProps) {
  const unlockedIds = new Set(userAchievements.map((a) => a.id));
  
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">
          <span className="text-2xl">🏆</span> Achievements
          <div className="badge badge-primary">
            {unlockedIds.size}/{ACHIEVEMENTS.length}
          </div>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlockedIds.has(achievement.id);
            
            return (
              <div
                key={achievement.id}
                className={`tooltip tooltip-top tooltip-primary w-full`}
                data-tip={
                  isUnlocked
                    ? `Unlocked! +${achievement.xpReward} XP`
                    : `Locked: ${achievement.description}`
                }
              >
                <div
                  className={`card bg-base-200 p-4 text-center transition-all ${
                    isUnlocked
                      ? "ring-2 ring-primary ring-offset-2"
                      : "opacity-50 grayscale"
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
      </div>
    </div>
  );
}
