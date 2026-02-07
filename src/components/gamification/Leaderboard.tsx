"use client";

import { getLevel } from "@/lib/gamification";

interface LeaderboardEntry {
  rank: number;
  userId?: string;
  username: string;
  xp: number;
  contributions: number;
  avatar?: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  title: string;
  timeframe: string;
}

export default function Leaderboard({
  entries,
  currentUserId,
  title,
  timeframe,
}: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };
  
  const getRowColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-50";
      case 2:
        return "bg-gray-50";
      case 3:
        return "bg-orange-50";
      default:
        return "";
    }
  };
  
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title">
            <span className="text-2xl">🏆</span> {title}
          </h2>
          <div className="badge badge-outline">{timeframe}</div>
        </div>
        
        <div className="overflow-x-auto mt-4">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th className="w-16">Rank</th>
                <th>User</th>
                <th className="text-right">Level</th>
                <th className="text-right">XP</th>
                <th className="text-right">Contributions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => {
                const level = getLevel(entry.xp);
                const isCurrentUser = entry.userId === currentUserId;
                
                return (
                  <tr
                    key={entry.rank}
                    className={`${getRowColor(entry.rank)} ${
                      isCurrentUser ? "font-bold" : ""
                    }`}
                  >
                    <td className="text-lg">
                      {getRankIcon(entry.rank)}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                            <span className="text-sm">
                              {entry.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{entry.username}</div>
                          <span className={`badge badge-xs ${level.current.color}`}>
                            {level.current.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-right">
                      <span className={`badge ${level.current.color}`}>
                        {level.current.name}
                      </span>
                    </td>
                    <td className="text-right font-mono">
                      {entry.xp.toLocaleString()}
                    </td>
                    <td className="text-right font-mono">
                      {entry.contributions.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
