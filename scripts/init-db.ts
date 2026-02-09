/**
 * Database Initialization Script
 * 
 * This script runs on server start to ensure:
 * 1. Prisma client is generated
 * 2. Database schema is synchronized
 * 3. Seed data is created if the database is empty
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import path from "path";

const DB_FILE = "ev-database.db";

/**
 * Log with timestamp
 */
function log(message: string, type: "info" | "success" | "error" | "warn" = "info") {
  const timestamp = new Date().toISOString();
  const emoji = {
    info: "📋",
    success: "✅",
    error: "❌",
    warn: "⚠️",
  };
  console.log(`${emoji[type]} [${timestamp}] ${message}`);
}

/**
 * Initialize the embedded SQLite database
 */
async function initializeDatabase() {
  log("Starting database initialization...", "info");

  try {
    // 1. Check if database file exists
    const dbPath = path.join(process.cwd(), DB_FILE);
    const dbExists = existsSync(dbPath);
    
    if (!dbExists) {
      log(`Database file not found at ${dbPath}`, "warn");
      log("Creating new database...", "info");
    } else {
      log(`Database file found at ${dbPath}`, "success");
    }

    // 2. Ensure Prisma client is generated
    log("Generating Prisma client...", "info");
    try {
      execSync("npx prisma generate", { stdio: "inherit" });
      log("Prisma client generated successfully", "success");
    } catch (error) {
      log("Failed to generate Prisma client", "error");
      throw error;
    }

    // 3. Synchronize database schema
    log("Synchronizing database schema...", "info");
    try {
      execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
      log("Database schema synchronized", "success");
    } catch (error) {
      log("Failed to synchronize database schema", "error");
      throw error;
    }

    // 4. Seed the database if it's new or empty
    if (!dbExists) {
      log("Running database seed...", "info");
      try {
        execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
        log("Database seeded successfully", "success");
      } catch (error) {
        log("Failed to seed database", "warn");
        // Don't throw here - seeding failure shouldn't prevent server start
      }
    } else {
      log("Database already exists, skipping seed", "info");
    }

    log("Database initialization complete!", "success");
    return true;
  } catch (error) {
    log(`Database initialization failed: ${error}`, "error");
    throw error;
  }
}

/**
 * Main entry point
 */
async function main() {
  const shouldInitialize = process.env.SKIP_DB_INIT === "true";
  
  if (shouldInitialize) {
    log("Skipping database initialization (SKIP_DB_INIT=true)", "warn");
    return;
  }

  await initializeDatabase();
}

// Run initialization
main().catch((error) => {
  console.error("Database initialization failed:", error);
  process.exit(1);
});
