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

export const findUserByUsername = async (
  username: string
): Promise<User | undefined> => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  return result[0];
};

export const getAllUsers = async (): Promise<User[]> => {
  return await db.select().from(users);
};

export const getUserById = async (id: number): Promise<User | undefined> => {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
};
