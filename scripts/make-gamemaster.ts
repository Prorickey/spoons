import { PrismaClient } from '../prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const email = process.argv[2];

if (!email) {
  console.error('Usage: npx tsx scripts/make-gamemaster.ts <email>');
  console.error('Example: npx tsx scripts/make-gamemaster.ts john.doe@ncssm.edu');
  process.exit(1);
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    console.error(`User with email "${email}" not found.`);
    console.error('The user must sign in at least once before being made a gamemaster.');
    process.exit(1);
  }

  if (user.gamemaster) {
    console.log(`User "${email}" is already a gamemaster.`);
    process.exit(0);
  }

  await prisma.user.update({
    where: { email },
    data: { gamemaster: true },
  });

  console.log(`Successfully made "${email}" a gamemaster.`);
}

main()
  .catch((e) => {
    console.error('Error:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
