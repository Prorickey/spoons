'use client';

import Image from 'next/image';

import NavBar, { NavbarProvider } from '@/app/navbar';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { fadeInOut } from '@/utils/fadeInOut';

export default function Home() {
  const count = 1;
  const rows = 10;
  const columns = 10;
  const dist = 18;

  const posOffset: { x: number; y: number; rand: number }[] = [];

  for (let i = 0; i < count; i++) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        posOffset.push({
          x: r * dist - (dist * (rows - 1)) / 2,
          y: c * dist - (dist * (columns - 1)) / 2,
          rand: Math.random(),
        });
      }
    }
  }

  const dateSpoonsRotation = [
    '0',
    '45',
    '90',
    '135',
    '180',
    '225',
    '270',
    '315',
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      const fadeContainer = document.getElementById('fade-container');
      const newOpacity = Math.max(1 - scrollPosition / 200, 0);

      if (fadeContainer) fadeContainer.style.opacity = newOpacity.toString();

      const spoon1 = document.getElementById('spoon1');
      const spoon2 = document.getElementById('spoon2');

      const spoonSpeedFactor = 3;

      if (spoon1 && spoon2) {
        spoon1.style.transform = `rotateY(180deg) translate(${scrollPosition * spoonSpeedFactor}px, 0px)`;
        spoon2.style.transform = `translate(${scrollPosition * spoonSpeedFactor}px, 0px)`;
      }

      const dateObject = document.getElementById('date-object');
      const dateContainer = document.getElementById('date-container');

      if (dateContainer && dateObject)
        fadeInOut(dateContainer, [dateObject], 8);

      const spoonmasterObject = document.getElementById('spoonmaster-object');
      const spoonmasterContainer = document.getElementById(
        'spoonmaster-container'
      );

      if (spoonmasterContainer && spoonmasterObject)
        fadeInOut(spoonmasterContainer, [spoonmasterObject], 8);

      const spoons: { ele: HTMLDivElement; rot: number }[] =
        dateSpoonsRotation.map((rot, ind) => {
          return {
            ele: document.getElementById(
              'rotate-spoon-' + ind
            ) as HTMLDivElement,
            rot: parseInt(rot),
          };
        });

      for (let i = 0; i < spoons.length; i++) {
        const spoon = spoons[i].ele;
        const rot = spoons[i].rot;
        spoon.style.transform = `translate(0, -50%) rotate(${rot - scrollPosition / 2}deg)`;
      }

      const starSpoons: {
        ele: HTMLDivElement;
        pos: { x: number; y: number };
        wait: number;
      }[] = posOffset.map((pos, ind) => {
        return {
          ele: document.getElementById('star-spoon-' + ind) as HTMLDivElement,
          pos: pos,
          wait: pos.rand,
        };
      });

      if (spoonmasterContainer) {
        const workingPosition = window.scrollY + window.innerHeight / 2;
        const buffer = 7;
        if (
          workingPosition > spoonmasterContainer.offsetTop &&
          workingPosition <
            spoonmasterContainer.clientHeight + spoonmasterContainer.offsetTop
        ) {
          starSpoons.forEach((spoon) => {
            const wait = spoon.wait * 30 * 16;
            const factor =
              ((workingPosition - wait - spoonmasterContainer.offsetTop) *
                buffer) /
              spoonmasterContainer.clientHeight;
            spoon.ele.style.transform = `translate(${-factor * 25 + spoon.pos.x}rem, ${-factor * 25 + spoon.pos.y}rem)`;
            spoon.ele.style.opacity = factor.toString();
          });
        } else if (
          workingPosition >
            spoonmasterContainer.clientHeight -
              spoonmasterContainer.clientHeight / buffer +
              spoonmasterContainer.offsetTop &&
          workingPosition <
            spoonmasterContainer.clientHeight + spoonmasterContainer.offsetTop
        ) {
          const factor =
            1 -
            ((workingPosition -
              (spoonmasterContainer.clientHeight -
                spoonmasterContainer.clientHeight / buffer +
                spoonmasterContainer.offsetTop)) *
              buffer) /
              spoonmasterContainer.clientHeight;
          starSpoons.forEach((spoon) => {
            spoon.ele.style.transform = `translate(${factor * 20 + spoon.pos.x}rem, ${factor * 20 + spoon.pos.y}rem)`;
            spoon.ele.style.opacity = factor.toString();
          });
        } else {
          starSpoons.forEach((spoon) => {
            spoon.ele.style.transform = `translate(${spoon.pos.x}rem, ${spoon.pos.y}rem)`;
            spoon.ele.style.opacity = '0';
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dateSpoonsRotation, posOffset]);

  return (
    <>
      <NavbarProvider>
        <NavBar current={'home'} />
      </NavbarProvider>
      <div className='flex h-[30rem] w-full flex-col justify-end lg:h-[40rem]'>
        <div className='w-full' id='fade-container'>
          <h1 className='text-center text-7xl font-bold lg:text-9xl'>
            Spoons 2025
          </h1>
          <div className='flex h-[250px] w-full flex-row justify-center'>
            <div className='absolute'>
              <Image
                id='spoon1'
                className='flippedSpoon'
                src={'/spoon.svg'}
                alt={'Spoon'}
                height={250}
                width={250}
              />
            </div>
            <div className='absolute'>
              <Image
                id='spoon2'
                src={'/spoon.svg'}
                alt={'Spoon'}
                height={250}
                width={250}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='h-[150rem]'>
        <div
          id='date-container'
          className='pointer-events-auto block h-[75rem]'
        >
          <div
            id='date-object'
            style={{ opacity: '0', scale: '0' }}
            className='fixed top-0 flex h-full w-full flex-col justify-around'
          >
            <div className='flex flex-row justify-around'>
              <div className='absolute -translate-y-1/2'>
                <p className='pb-5 text-center text-2xl font-semibold text-nowrap lg:text-4xl'>
                  Beginning February 5th
                </p>
                <p className='text-md text-center text-gray-200 lg:text-xl'>
                  In the dawn of early morning, you will
                  <br /> receive a spoon beneath your door
                </p>
              </div>
              {dateSpoonsRotation.map((rot, ind) => (
                <div
                  id={'rotate-spoon-' + ind}
                  key={rot}
                  style={{ transform: `translate(0, -50%) rotate(${rot}deg)` }}
                  className='absolute'
                >
                  <Image
                    src='/spoon.svg'
                    alt='Spoon'
                    className='ml-[20rem] rotate-45 lg:ml-[30rem]'
                    width={100}
                    height={100}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          id='spoonmaster-container'
          className='pointer-events-none block h-[75rem]'
        >
          <div className='fixed top-0 flex h-full w-full flex-col justify-around'>
            <div className='flex flex-row justify-around'>
              <div
                id='spoonmaster-object'
                style={{ opacity: '0', scale: '0' }}
                className='flex flex-row justify-around'
              >
                <div className='bg-opacity-90 absolute z-10 mx-20 -translate-y-1/2 rounded-lg bg-[#171717] p-5 lg:mx-0'>
                  <p className='pb-5 text-center text-2xl font-semibold text-nowrap lg:text-4xl'>
                    Welcome Your Spoonmaster
                  </p>
                  <p className='text-md text-center text-gray-200 lg:text-xl'>
                    This years game of spoons will be hosted
                    <br /> by Vincent Barboriak, your previous years winner
                  </p>
                </div>
              </div>
              {posOffset.map((offset, ind) => (
                <div
                  id={'star-spoon-' + ind}
                  key={ind}
                  style={{
                    transform: `translate(${offset.x}rem, ${offset.y}rem)`,
                    opacity: '0',
                  }}
                  className='absolute -z-10'
                >
                  <Image
                    src='/spoon.svg'
                    alt='Spoon'
                    width={100}
                    height={100}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className='h-[10rem]'></div>
      <SpoonsGameFooter />
    </>
  );
}

function SpoonsGameFooter() {
  const secondSection = (
    <>
      <div className='rounded-lg bg-stone-800 p-4'>
        <p className='pb-1 text-2xl font-semibold'>Additional Clarification</p>
        <ul className='list-disc pl-5 text-lg'>
          <li>
            In order to be safe, you must use a spoon to touch your nose, it
            cannot be a fork or other utensil. However, it can be any spoon, it
            doesn’t have to be the one with your target’s name on it.
          </li>
          <li>
            DM the spoonsmaster (Vincent Barboriak) if you have broken your
            spoon and want a new one.
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
      <div className='rounded-lg bg-stone-800 p-4'>
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
          website. Thanks to Thomas Fasan for assisting in creating the backend.
          The last person alive will be crowned 2025 spoons champion and the
          last junior alive will be next years Spoonsmaster.
        </p>
        <button className='z-10 w-full pt-5' onClick={() => signIn()}>
          <div className='flex h-16 w-1/3 flex-col justify-center rounded-lg border-2 border-gray-400 hover:bg-gray-400'>
            <p className='text-2xl font-semibold'>Sign Up Now</p>
          </div>
        </button>
      </div>
    </>
  );

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
                DM the spoonsmaster (Vincent Barboriak) if you have broken your
                spoon and want a new one.
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
              website. Thanks to Thomas Fasan for assisting in creating the
              backend. The last person alive will be crowned 2025 spoons
              champion and the last junior alive will be next years
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
