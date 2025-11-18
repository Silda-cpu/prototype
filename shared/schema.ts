import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export interface Company {
  id: string;
  name: string;
  description: string;
  category: string;
  score: number;
  status: 'support' | 'neutral' | 'boycott';
  website?: string;
  politicalLean?: 'progressive' | 'neutral' | 'conservative';
  politicalInfo: {
    donations: {
      available: boolean;
      pacName?: string;
      totalDonations?: number;
      lastDonationDate?: string;
      partyBreakdown?: Array<{
        party: string;
        amount: number;
      }>;
      topRecipients?: Array<{
        name: string;
        amount: number;
      }>;
      source?: string;
    };
    lobbying: {
      available: boolean;
      totalLobbyingSpend?: number;
      lastFilingYear?: number;
      topIssues?: string[];
    };
    statements: {
      available: boolean;
      tags?: string[];
    };
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  companies: Company[];
  userStores?: string[];
}

export interface UserSpending {
  companyId: string;
  companyName: string;
  categoryId: string;
  amount: number;
  date: string;
}

export interface Notification {
  id: string;
  companyName: string;
  oldScore: number;
  newScore: number;
  trend: 'up' | 'down';
  reason: string;
  date: string;
  newsUrl?: string;
}

export interface WhiteLabelSettings {
  appName: string;
  color: string;
  mantra: string;
  logo?: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  overallScore: number;
  categoryScores: Record<string, number>;
  userSpending: UserSpending[];
  notifications: Notification[];
  categoryOrder: string[];
  categoryVisibility: Record<string, boolean>;
  whiteLabelSettings: WhiteLabelSettings;
  maxStoresPerCategory: number;
}
