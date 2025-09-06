import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

prisma.gameConfiguration.createMany({
  data: [
    { key: 'status', value: 'PREGAME' },
    { key: 'sign_ups_open', value: 'no' },
  ],
});
