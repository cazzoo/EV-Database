"use client";

import { getLevel, ROLES } from "@/lib/gamification";

interface UserStatsProps {
  username: string;
  xp: number;
  credits: number;
  contributions: number;
  level?: number;
}

export default function UserStats({
  username,
  xp,
  credits,
  contributions,
}: UserStatsProps) {
  const level = getLevel(xp);
  
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <div className="flex items-center gap-4">
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-12 h-12">
              <span className="text-lg">{username.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">{username}</h3>
            <span className={`badge ${level.current.color}`}>
              {level.current.name}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="stat bg-base-200 rounded-lg p-3">
            <div className="stat-title text-xs">Experience</div>
            <div className="stat-value text-xl text-primary">{xp.toLocaleString()} XP</div>
            <div className="text-xs text-base-content/60">
              {level.xpToNext.toLocaleString()} XP to {level.next.name}
            </div>
          </div>
          
          <div className="stat bg-base-200 rounded-lg p-3">
            <div className="stat-title text-xs">Credits</div>
            <div className="stat-value text-xl text-secondary">{credits.toLocaleString()}</div>
            <div className="text-xs text-base-content/60">Available balance</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress to {level.next.name}</span>
            <span>{level.progress.toFixed(1)}%</span>
          </div>
          <progress 
            className="progress progress-primary w-full" 
            value={level.progress} 
            max="100"
          ></progress>
        </div>
        
        <div className="mt-4">
          <div className="text-sm text-base-content/70">
            <span className="font-semibold">{contributions}</span> contributions made
          </div>
        </div>
      </div>
    </div>
  );
}
