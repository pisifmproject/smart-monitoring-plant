// src/auth/auth.repository.ts
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  name: string;
  role: string;
  plantAccess: string[];
  isActive: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// IMPORTANT:
// Drizzle returns keys based on schema property names (camelCase),
// NOT the DB column names (snake_case).
function mapUser(u: any): User {
  return {
    id: u.id,
    username: u.username,
    passwordHash: u.passwordHash,     // ✅ correct (from schema key)
    name: u.name,
    role: u.role,
    plantAccess: u.plantAccess ?? [], // ✅ correct
    isActive: u.isActive ?? true,     // ✅ correct
    createdAt: u.createdAt ?? null,
    updatedAt: u.updatedAt ?? null,
  };
}

export const findUserByUsername = async (
  username: string
): Promise<User | undefined> => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  const u = result[0];
  if (!u) return undefined;
  return mapUser(u);
};

export const getAllUsers = async (): Promise<User[]> => {
  const result = await db.select().from(users);
  return result.map(mapUser);
};

export const getUserById = async (id: number): Promise<User | undefined> => {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  const u = result[0];
  if (!u) return undefined;
  return mapUser(u);
};
