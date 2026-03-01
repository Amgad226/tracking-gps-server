import "dotenv/config";
import { PrismaClient } from "@prisma/client";

export const PrismaService = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL,
});