import prisma from './prisma';

interface TargetRule {
  type: number; // 0 for player1 targets player2
  player1id: number;
  player2id: number;
}

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Checks if two arrays contain the same elements (order-independent)
 * Returns 0 if equal, otherwise returns the count of missing elements
 */
function areArraysEqual(arr1: number[], arr2: number[]): number {
  if (arr1.length !== arr2.length) {
    return -1;
  }

  let count = arr1.length;
  for (const num of arr1) {
    if (arr2.includes(num)) {
      count--;
    }
  }
  return count;
}

/**
 * Assigns targets to each user in the game.
 * Returns an array of pairs where [assassinId, targetId]
 */
export async function assignTargets(): Promise<number[][]> {
  // Get all target rules
  const rules: TargetRule[] = await prisma.targetRules.findMany({
    select: {
      type: true,
      player1id: true,
      player2id: true,
    },
  });

  // Get all non-gamemaster users
  const usersData = await prisma.user.findMany({
    where: {
      gamemaster: false,
    },
    select: {
      id: true,
    },
  });

  let users = usersData.map((u) => u.id);

  // Keep a copy for validation
  const prevUsers = [...users];

  // Shuffle the users array
  users = shuffleArray(users);

  // Apply rules to the users array
  // Rules ensure that player1 targets player2 (player2 comes after player1 in the array)
  for (const rule of rules) {
    for (let i = users.length - 1; i > 0; i--) {
      if (users[i] === rule.player2id) {
        for (let j = 0; j < users.length; j++) {
          if (users[j] === rule.player1id) {
            // Remove player2id from current position
            users.splice(i, 1);
            // Insert player2id right after player1id
            users.splice(j + 1, 0, rule.player2id);
            break;
          }
        }
        break;
      }
    }
  }

  // Create pairs: each user targets the next one in the circular chain
  const pairs: number[][] = [];
  for (let i = 0; i < users.length; i++) {
    const assassin = users[i];
    const target = users[(i + 1) % users.length]; // Last user targets the first
    pairs.push([assassin, target]);
  }

  // Validate that all users are still present
  const score = areArraysEqual(users, prevUsers);
  if (score !== 0) {
    throw new Error(
      `Users array was malformed after applying rules (${score}): ${JSON.stringify(users)}`
    );
  }

  return pairs;
}

/**
 * Clears all target assignments
 */
export async function clearTargets(): Promise<void> {
  await prisma.user.updateMany({
    data: {
      currentTarget: null,
    },
  });
}

/**
 * Assigns targets and updates the database
 * Returns the pairs that were assigned
 */
export async function assignAndSaveTargets(): Promise<number[][]> {
  const pairs = await assignTargets();

  // Update each user with their target
  for (const [assassinId, targetId] of pairs) {
    await prisma.user.update({
      where: { id: assassinId },
      data: { currentTarget: targetId.toString() },
    });
  }

  return pairs;
}

/**
 * Starts the game: assigns targets and sets status to RUNNING
 */
export async function startGame(): Promise<{ success: boolean; error?: string }> {
  // Check if game is in PREGAME state
  const status = await prisma.gameConfiguration.findUnique({
    where: { key: 'status' },
  });

  if (status?.value !== 'PREGAME') {
    return { success: false, error: 'Game already started' };
  }

  try {
    // Update status to RUNNING
    await prisma.gameConfiguration.update({
      where: { key: 'status' },
      data: { value: 'RUNNING' },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
