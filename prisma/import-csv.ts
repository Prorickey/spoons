import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// Map CSV hall names to database hall IDs
const hallMap: Record<string, string> = {
  '1st hunt': '1H',
  'first hunt': '1H',
  '2nd west': '2WH',
  'second west': '2WH',
  '2nd west hunt': '2WH',
  '2nd east': '2EH',
  'second east': '2EH',
  '2nd east hunt': '2EH',
  '3rd west': '3WH',
  'third west': '3WH',
  '3rd west hunt': '3WH',
  '3rd east': '3EH',
  'third east': '3EH',
  '3rd east hunt': '3EH',
  '4th west': '4WH',
  'fourth west': '4WH',
  '4th west hunt': '4WH',
  '4th east': '4EH',
  'fourth east': '4EH',
  '4th east hunt': '4EH',
  '1st hill': '1HI',
  'first hill': '1HI',
  '2nd hill': '2HI',
  'second hill': '2HI',
  '2nd bryan': '2BR',
  'second bryan': '2BR',
  '3rd bryan': '3BR',
  'third bryan': '3BR',
  '4th bryan': '4BR',
  'fourth bryan': '4BR',
  '1st beall': '1BE',
  'first beall': '1BE',
  '2nd beall': '2BE',
  'second beall': '2BE',
  '3rd beall': '3BE',
  'third beall': '3BE',
  'ground reynolds': 'RE1',
  'reynolds 1c2c1d': 'RE2',
  'reynolds 1e2e2d': 'RE3',
  'royall': 'RO',
};

function resolveHall(csvHall: string): string {
  const normalized = csvHall.trim().toLowerCase();
  const match = hallMap[normalized];
  if (match) return match;

  // Fuzzy fallback: check if any key is contained in the input
  for (const [key, value] of Object.entries(hallMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }

  console.warn(`  WARNING: Could not map hall "${csvHall}", defaulting to "N/A"`);
  return 'N/A';
}

function parseGrade(email: string): string {
  if (email.includes('26')) return 'S';
  if (email.includes('27')) return 'J';
  console.warn(`  WARNING: Could not determine grade from email "${email}", defaulting to "S"`);
  return 'S';
}

const adjectives = [
  'Sneaky', 'Cosmic', 'Fuzzy', 'Turbo', 'Wobbly', 'Mystic', 'Crunchy',
  'Bouncy', 'Spicy', 'Frosty', 'Dizzy', 'Groovy', 'Rusty', 'Zesty',
  'Crispy', 'Stormy', 'Salty', 'Bubbly', 'Witty', 'Toasty', 'Jolly',
  'Zippy', 'Dusty', 'Funky', 'Breezy', 'Tangy', 'Nifty', 'Chunky',
  'Vivid', 'Gleeful', 'Plucky', 'Snappy', 'Wacky', 'Peppy', 'Quirky',
  'Dapper', 'Fierce', 'Gentle', 'Hasty', 'Mighty', 'Noble', 'Rapid',
  'Silent', 'Tricky', 'Valiant', 'Wicked', 'Ancient', 'Blazing', 'Clever',
];

const nouns = [
  'Penguin', 'Waffle', 'Tornado', 'Pickle', 'Cactus', 'Noodle', 'Biscuit',
  'Mango', 'Falcon', 'Pretzel', 'Comet', 'Dumpling', 'Badger', 'Pebble',
  'Gecko', 'Muffin', 'Otter', 'Turnip', 'Raven', 'Walrus', 'Taco',
  'Yeti', 'Lobster', 'Acorn', 'Moose', 'Pirate', 'Sphinx', 'Toaster',
  'Goblin', 'Parrot', 'Nugget', 'Squid', 'Pancake', 'Hedgehog', 'Bandit',
  'Wombat', 'Blizzard', 'Chimera', 'Donut', 'Gopher', 'Jackal', 'Kraken',
  'Llama', 'Mammoth', 'Narwhal', 'Ocelot', 'Phoenix', 'Raccoon', 'Serpent',
];

const usedNicknames = new Set<string>();

async function generateNickname(): Promise<string> {
  // Load existing nicknames from DB on first call
  if (usedNicknames.size === 0) {
    const existing = await prisma.user.findMany({ select: { nickname: true } });
    for (const u of existing) usedNicknames.add(u.nickname);
  }

  let attempts = 0;
  while (attempts < 1000) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const nickname = `${adj}${noun}`;
    if (!usedNicknames.has(nickname)) {
      usedNicknames.add(nickname);
      return nickname;
    }
    attempts++;
  }
  // Fallback with random number suffix
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const nickname = `${adj}${noun}${Math.floor(Math.random() * 999)}`;
  usedNicknames.add(nickname);
  return nickname;
}

function parseName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  };
}

// Simple CSV line parser that handles quoted fields with commas/newlines
function parseCSV(content: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < content.length; i++) {
    const ch = content[i];

    if (inQuotes) {
      if (ch === '"' && content[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(current);
        current = '';
      } else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && content[i + 1] === '\n') i++;
        row.push(current);
        current = '';
        if (row.length > 1 || row[0] !== '') {
          rows.push(row);
        }
        row = [];
      } else {
        current += ch;
      }
    }
  }

  // Last row
  row.push(current);
  if (row.length > 1 || row[0] !== '') {
    rows.push(row);
  }

  return rows;
}

async function main() {
  const csvPath = resolve(__dirname, '..', 'Spoons Signup.csv');
  const content = readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);

  // Skip header row
  const header = rows[0];
  console.log('CSV columns:', header);
  const dataRows = rows.slice(1);

  // Deduplicate by email (lowercase), keeping the latest entry
  const byEmail = new Map<
    string,
    { name: string; hall: string; email: string }
  >();

  for (const row of dataRows) {
    const name = row[1];
    const hall = row[2];
    const email = row[3].trim().toLowerCase();

    if (!email || !email.includes('@')) continue;

    byEmail.set(email, { name, hall, email });
  }

  console.log(
    `\nParsed ${dataRows.length} rows, ${byEmail.size} unique players by email.\n`
  );

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const { name, hall, email } of byEmail.values()) {
    const { firstName, lastName } = parseName(name);
    const hallId = resolveHall(hall);
    const grade = parseGrade(email);
    const nickname = await generateNickname();

    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      if (existing.gamemaster) {
        console.log(`  SKIP (gamemaster): ${email}`);
        skipped++;
        continue;
      }
      await prisma.user.update({
        where: { email },
        data: { firstName, lastName, hallId, grade, nickname, phone: '0000000000' },
      });
      console.log(`  UPDATED: ${firstName} ${lastName} -> "${nickname}" (${email}) -> ${hallId}, ${grade}`);
      updated++;
    } else {
      await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          nickname,
          hallId,
          grade,
          phone: '0000000000',
        },
      });
      console.log(`  CREATED: ${firstName} ${lastName} -> "${nickname}" (${email}) -> ${hallId}, ${grade}`);
      created++;
    }
  }

  console.log(`\nDone! Created: ${created}, Updated: ${updated}, Skipped: ${skipped}`);
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
