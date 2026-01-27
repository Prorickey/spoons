import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'fast-csv';
import { fileURLToPath } from 'url';
import { halls } from '@/app/api/auth/[...nextauth]/halls';
import { PrismaClient } from './prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomInt } from 'node:crypto';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface rawDataRow {
  Timestamp: never;
  name: string;
  email: string;
  hall: string;
}

interface parsedStructure {
  firstName: string;
  lastName: string;
  hallId: string;
  email: string;
  grade: string;
  phone: string;
  nickname: string;
}

const adjs = [
  'Blue',
  'Red',
  'Big',
  'Hefty',
  'Green',
  'Tiny',
  'Massive',
  'Quick',
  'Slow',
  'Loud',
  'Quiet',
  'Fierce',
  'Gentle',
  'Clever',
  'Bold',
  'Sneaky',
  'Brave',
  'Calm',
  'Dashing',
  'Silly',
];

const nicknames = [
  'Penguin',
  'Yapper',
  'Nerd',
  'Geek',
  'Unicorn',
  'Tiger',
  'Sloth',
  'Phoenix',
  'Wizard',
  'Ninja',
  'Pirate',
  'Dragon',
  'Knight',
  'Panda',
  'Falcon',
  'Raven',
  'Monkey',
  'Fox',
  'Shark',
  'Eagle',
];

function genNickname(takenAlready: string[]) {
  const nick = adjs[randomInt(0, 19)] + nicknames[randomInt(0, 19)];
  if (takenAlready.includes(nick)) return genNickname(takenAlready);
  else return nick;
}

const rows: parsedStructure[] = [];

fs.createReadStream(path.resolve(__dirname, 'spoons.csv'))
  .pipe(csv.parse({ headers: true }))
  .on('error', (error) => console.error(error))
  .on('data', (row: rawDataRow) => {
    let firstName: string;
    let lastName: string;
    const nameSplit = row.name.trim().split(' ');
    if (nameSplit.length === 2) {
      firstName = nameSplit[0].trim();
      lastName = nameSplit[1].trim();
    } else {
      return console.error(`Row with odd name:`, row);
    }

    if (!halls.map((d) => d.value).includes(row.hall))
      return console.error(`Row with bad hall id:`, row);

    const regexp = new RegExp('\d+');
    let year;
    try {
      year = parseInt((regexp.exec(row.email) as string[])[0]);
    } catch {
      return console.error(`Row with bad email:`, row);
    }

    if (!row.email.endsWith('@ncssm.edu'))
      return console.error(`Row with bad email:`, row);

    if (rows.map((r) => r.email).includes(row.email))
      return console.error(`Duplicate row:`, row);

    rows.push({
      email: row.email,
      firstName: firstName,
      lastName: lastName,
      hallId: row.hall,
      grade: year == 26 ? 'J' : 'S',
      phone: '0000000000',
      nickname: '',
    });
  })
  .on('end', async (rowCount: number) => {
    console.log(`Parsed ${rowCount} rows`);
    const prisma = new PrismaClient({ adapter });

    const data = await prisma.user.findMany({
      select: {
        nickname: true,
        email: true,
      },
    });

    const takenNicknames: string[] = data.map((d) => d.nickname);
    const alreadyInDb: string[] = data.map((d) => d.email);

    const dataPrepared = rows.map((row) => {
      const nick = genNickname(takenNicknames);
      takenNicknames.push(nick);
      row.nickname = nick;

      return row;
    });

    for (let i = 0; i < dataPrepared.length; i++) {
      try {
        if (!alreadyInDb.includes(dataPrepared[i].email))
          await prisma.user.create({
            data: dataPrepared[i],
          });
      } catch {
        console.error(`Error creating user:`, dataPrepared[i]);
      }
    }
  });
