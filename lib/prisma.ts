import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function getAccelerateUrl(databaseUrl: string) {
  if (databaseUrl.startsWith("prisma+postgress://")) {
    return databaseUrl.replace("prisma+postgress://", "prisma+postgres://");
  }

  if (
    databaseUrl.startsWith("prisma://") ||
    databaseUrl.startsWith("prisma+postgres://")
  ) {
    return databaseUrl;
  }

  return null;
}

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to initialize Prisma.");
  }

  const accelerateUrl = getAccelerateUrl(databaseUrl);

  if (accelerateUrl) {
    return new PrismaClient({ accelerateUrl });
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV === "development") {
  globalForPrisma.prisma = prisma;
}
