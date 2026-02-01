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
      { key: 'show_real_names', value: 'false' },
    ],
    skipDuplicates: true,
  });

  // Set gamemaster privileges (creates account if doesn't exist, otherwise just updates gamemaster flag)
  for (const email of gamemasterEmails) {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      await prisma.user.update({
        where: { email },
        data: { gamemaster: true },
      });
      console.log(`Gamemaster privilege granted to existing user: ${email}`);
    } else {
      await prisma.user.create({
        data: {
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
      console.log(`Gamemaster account created: ${email}`);
    }
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
