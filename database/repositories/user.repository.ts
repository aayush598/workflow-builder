import { PrismaClient, Prisma } from '@prisma/client';

type DbClient = PrismaClient | Prisma.TransactionClient;

export class UserRepository {
  async upsertByClerkId(
    db: DbClient,
    params: {
      clerkId: string;
      email?: string;
    }
  ) {
    return db.user.upsert({
      where: { clerkId: params.clerkId },
      update: {
        email: params.email,
      },
      create: {
        clerkId: params.clerkId,
        email: params.email,
      },
    });
  }

  async findByClerkId(db: DbClient, clerkId: string) {
    return db.user.findUnique({
      where: { clerkId },
    });
  }

  async findById(db: DbClient, id: string) {
    return db.user.findUnique({
      where: { id },
    });
  }
}

export const userRepository = new UserRepository();
