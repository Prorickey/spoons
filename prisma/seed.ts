import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const gamemasterEmails = [
  'bedson26t@ncssm.edu',
  'duong26l@ncssm.edu',
  'chen26r@ncssm.edu',
];

async function main() {
  // Seed game configuration
  await prisma.gameConfiguration.createMany({
    data: [
      { key: 'status', value: 'PREGAME' },
      { key: 'sign_ups_open', value: 'yes' },
    ],
    skipDuplicates: true,
  });

  // Create gamemaster accounts
  for (const email of gamemasterEmails) {
    await prisma.user.upsert({
      where: { email },
      update: { gamemaster: true },
      create: {
        email,
        gamemaster: true,
        nickname: email.split('@')[0],
        firstName: 'Gamemaster',
        lastName: email.split('@')[0],
        hallId: 'N/A',
        grade: 'S',
        phone: '0000000000',
      },
    });
    console.log(`Gamemaster created/updated: ${email}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
