import { signIn } from 'next-auth/react';

export default function SpoonsGameFooter() {
  return (
    <div className='mx-auto w-[90%] pb-10'>
      <div className='my-5 h-[2px] rounded-md bg-gray-400'></div>
      <p className='w-full text-6xl font-bold'>The Game of Spoons</p>
      <div className='flex flex-col gap-4 pt-1 lg:flex-row'>
        <div className='flex w-full flex-col gap-4 lg:w-1/2'>
          <p className='bg-card rounded-lg p-4 text-lg'>
            At the start of the game, each player is given a spoon with another
            player’s name on it. This is their target. To eliminate their
            target, a player must use their spoon to (LIGHTLY) tap their target
            on the shoulder, defined as a kill. When this occurs, the player
            will inherit their killed target’s spoon, and thus their new target
            will be the killed player’s target. This will continue until there
            is only one player remaining, and the game’s objective is to be the
            last person standing!
            <br />
            <br />
            To protect yourself from a player who has your name, you can touch
            your spoon to your nose. When your spoon and nose are touching, you
            are safe (Immune to being killed).
          </p>
          <div className='bg-card rounded-lg p-4'>
            <p className='pb-1 text-2xl font-semibold'>Safe Zones</p>
            <ul className='list-disc pl-5 text-lg'>
              <li>A player’s own dorm</li>
              <li>Bathrooms and showers</li>
              <li>A player’s hall while they are walking to the showers</li>
              <li>PFM during meal hours</li>
              <li>Fablab</li>
              <li>PEC while working out</li>
              <li>Music practice rooms while practicing</li>
              <li>Library</li>
              <li>
                Classrooms during, in the 5 minutes before, and in the 5 minutes
                after a class. You must be in the classroom to be protected.
                This also covers activities for a class that occur outside of
                the classroom but during class hours (ie. labs, outdoor
                activities)
              </li>
              <li>
                Registered clubs, forums, sports, etc. during advertised hours
              </li>
              <li>While doing hours for senior leadership or campus service</li>
              <li>Everywhere off campus</li>
            </ul>
          </div>
        </div>

        <div className='flex w-full flex-col gap-4 lg:w-1/2'>
          <div className='bg-card rounded-lg p-4'>
            <p className='pb-1 text-2xl font-semibold'>
              Additional Clarification
            </p>
            <ul className='list-disc pl-5 text-lg'>
              <li>
                In order to be safe, you must use a spoon to touch your nose, it
                cannot be a fork or other utensil. However, it can be any spoon,
                it doesn’t have to be the one with your target’s name on it.
              </li>
              <li>
                DM the spoonsmaster (Rex Chen) if you have broken your spoon and
                want a new one.
              </li>
              <li>
                You must be supporting the spoon with your palm when you are
                protecting yourself (ie, no taping your spoon to your nose or
                anything like that)
              </li>
              <li>
                Please do not run. We don’t want an injury, and if it becomes an
                issue players can be disqualified.
              </li>
              <li>
                Be gentle while eliminating others. We don’t want another spoons
                related major violation.
              </li>
            </ul>
          </div>
          <div className='bg-card rounded-lg p-4'>
            <p className='pb-2 text-2xl font-semibold'>
              Special Thanks and Information
            </p>
            <p className='text-lg'>
              Thanks to{' '}
              <button onClick={() => window.open('https://prorickey.xyz')}>
                <span className='underline decoration-orange-500 decoration-2'>
                  Trevor Bedson
                </span>
              </button>{' '}
              for leading development, hosting, and maintaining this years game
              website. Thanks to Evan Kim for helping with the development of
              the 2026 game website. The last person alive will be crowned 2026
              spoons champion and the last junior alive will be next years
              Spoonsmaster.
            </p>
            <button className='z-10 w-full pt-5' onClick={() => signIn()}>
              <div className='flex h-16 w-1/3 flex-col justify-center rounded-lg border-2 border-gray-400 hover:bg-gray-400'>
                <p className='text-2xl font-semibold'>Sign Up Now</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
