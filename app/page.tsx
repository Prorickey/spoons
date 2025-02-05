"use client";

import Image from "next/image"
import NavBar, { NavbarProvider } from '@/app/navbar';
import {signIn} from 'next-auth/react';
import { useEffect } from 'react';
import { fadeInOut } from '@/utils/fadeInOut';

export default function Home() {

  const count = 1;
  const rows = 10
  const columns = 10
  const dist = 18

  const posOffset: {x: number, y: number, rand: number}[] = []

  for(let i = 0; i < count; i++) {
    for(let r = 0; r < rows; r++) {
      for(let c = 0; c < columns; c++) {
        posOffset.push({
          x: (r * dist) - ((dist*(rows-1))/2),
          y: (c * dist) - ((dist*(columns-1))/2),
          rand: Math.random()
        })
      }
    }
  }

  const dateSpoonsRotation = ["0", "45", "90", "135", "180", "225", "270", "315"]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY

      const fadeContainer = document.getElementById("fade-container");
      const newOpacity = Math.max(1 - scrollPosition / 200, 0);

      if (fadeContainer) fadeContainer.style.opacity = newOpacity.toString();

      const spoon1 = document.getElementById("spoon1");
      const spoon2 = document.getElementById("spoon2");

      const spoonSpeedFactor = 3

      if (spoon1 && spoon2) {
        spoon1.style.transform = `rotateY(180deg) translate(${scrollPosition * spoonSpeedFactor}px, 0px)`;
        spoon2.style.transform = `translate(${scrollPosition * spoonSpeedFactor}px, 0px)`;
      }

      const dateObject = document.getElementById("date-object");
      const dateContainer = document.getElementById("date-container");

      if(dateContainer && dateObject)
        fadeInOut(dateContainer, [dateObject], 8)

      const spoonmasterObject = document.getElementById("spoonmaster-object");
      const spoonmasterContainer = document.getElementById("spoonmaster-container");

      if(spoonmasterContainer && spoonmasterObject)
        fadeInOut(spoonmasterContainer, [spoonmasterObject], 8);

      const spoons: {ele: HTMLDivElement, rot: number}[] = dateSpoonsRotation.map((rot, ind) => {
        return {
          ele: document.getElementById("rotate-spoon-" + ind) as HTMLDivElement,
          rot: parseInt(rot)
        }
      })

      for(let i = 0; i < spoons.length; i++) {
        const spoon = spoons[i].ele;
        const rot = spoons[i].rot;
        spoon.style.transform = `translate(0, -50%) rotate(${rot-(scrollPosition/2)}deg)`
      }

      const starSpoons: {ele: HTMLDivElement, pos: {x: number, y: number}, wait: number}[] = posOffset.map((pos, ind) => {
        return {
          ele: document.getElementById("star-spoon-" + ind) as HTMLDivElement,
          pos: pos,
          wait: pos.rand
        }
      })

      if(spoonmasterContainer) {
        const workingPosition = window.scrollY + window.innerHeight/2
        const buffer = 7
        if(workingPosition > spoonmasterContainer.offsetTop && workingPosition < ((spoonmasterContainer.clientHeight)+spoonmasterContainer.offsetTop))  {
          starSpoons.forEach(spoon => {
            const wait = spoon.wait * 30 * 16;
            const factor =  (((workingPosition-wait)-spoonmasterContainer.offsetTop)*buffer) / spoonmasterContainer.clientHeight;
            spoon.ele.style.transform = `translate(${(-factor*25)+spoon.pos.x}rem, ${(-factor*25)+spoon.pos.y}rem)`
            spoon.ele.style.opacity = factor.toString()
          })
        } else if(workingPosition > ((spoonmasterContainer.clientHeight-(spoonmasterContainer.clientHeight/buffer))+spoonmasterContainer.offsetTop) &&
          workingPosition < (spoonmasterContainer.clientHeight+spoonmasterContainer.offsetTop)) {
          const factor =  1 - ((workingPosition-((spoonmasterContainer.clientHeight-(spoonmasterContainer.clientHeight/buffer))+spoonmasterContainer.offsetTop))*buffer) / spoonmasterContainer.clientHeight;
          starSpoons.forEach(spoon => {
            spoon.ele.style.transform = `translate(${(factor*20)+spoon.pos.x}rem, ${(factor*20)+spoon.pos.y}rem)`
            spoon.ele.style.opacity = factor.toString()
          })
        } else {
          starSpoons.forEach(spoon => {
            spoon.ele.style.transform = `translate(${spoon.pos.x}rem, ${spoon.pos.y}rem)`
            spoon.ele.style.opacity = "0"
          })
        }
      }

    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dateSpoonsRotation, posOffset])

  return (
    <>
      <NavbarProvider>
        <NavBar current={'home'} />
      </NavbarProvider>
      <div className="h-[30rem] lg:h-[40rem] w-full flex flex-col justify-end">
        <div className="w-full" id="fade-container">
          <h1 className="text-7xl lg:text-9xl font-bold text-center">
            Spoons 2025
          </h1>
          <div className="flex flex-row h-[250px] w-full justify-center">
            <div className="absolute">
              <Image
                id="spoon1"
                className="flippedSpoon"
                src={'/spoon.svg'}
                alt={'Spoon'}
                height={250}
                width={250}
              />
            </div>
            <div className="absolute">
              <Image
                id="spoon2"
                src={'/spoon.svg'}
                alt={'Spoon'}
                height={250}
                width={250}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="h-[150rem]">
        <div id="date-container" className="block h-[75rem] pointer-events-auto">
          <div
            id="date-object"
            style={{ opacity: '0', scale: '0' }}
            className="fixed top-0 h-full w-full flex flex-col justify-around">
            <div className="flex flex-row justify-around">
              <div className="absolute -translate-y-1/2">
                <p className="text-2xl lg:text-4xl text-center font-semibold pb-5 text-nowrap">Beginning February 5th</p>
                <p className="text-md lg:text-xl text-center text-gray-200">
                  In the dawn of early morning, you will<br /> receive a spoon beneath your door
                </p>
              </div>
              {
                dateSpoonsRotation.map((rot, ind) => (
                  <div id={'rotate-spoon-' + ind} key={rot} style={{ transform: `translate(0, -50%) rotate(${rot}deg)` }}
                       className="absolute">
                    <Image
                      src="/spoon.svg"
                      alt="Spoon"
                      className="ml-[20rem] lg:ml-[30rem] rotate-45"
                      width={100}
                      height={100}
                    />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div id="spoonmaster-container" className="block h-[75rem] pointer-events-none">
          <div className="fixed top-0 h-full w-full flex flex-col justify-around">
            <div className="flex flex-row justify-around">
              <div id="spoonmaster-object"
                   style={{ opacity: '0', scale: '0' }}
                   className="flex flex-row justify-around">
                <div className="absolute z-10 bg-[#171717] mx-20 lg:mx-0 p-5 rounded-lg bg-opacity-90 -translate-y-1/2">
                  <p className="text-2xl lg:text-4xl text-center font-semibold pb-5 text-nowrap">Welcome Your Spoonmaster</p>
                  <p className="text-md lg:text-xl text-center text-gray-200">
                    This years game of spoons will be hosted<br /> by Vincent Barboriak, your previous years winner
                  </p>
                </div>
              </div>
              {
                posOffset.map((offset, ind) => (
                  <div id={'star-spoon-' + ind} key={ind} style={{
                    transform: `translate(${offset.x}rem, ${offset.y}rem)`,
                    opacity: '0',
                  }}
                       className="absolute -z-10">
                    <Image
                      src="/spoon.svg"
                      alt="Spoon"
                      width={100}
                      height={100}
                    />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
      <div className="h-[10rem]"></div>
      <SpoonsGameFooter />
    </>
  );
}

function SpoonsGameFooter() {

  const secondSection = (
    <>
      <div className="p-4 bg-stone-800 rounded-lg">
        <p className="text-2xl font-semibold pb-1">Additional Clarification</p>
        <ul className="list-disc pl-5 text-lg">
          <li>In order to be safe, you must use a spoon to touch
            your nose, it cannot be a fork or other utensil.
            However, it can be any spoon, it doesn’t have to be
            the one with your target’s name on it.
          </li>
          <li>DM the spoonsmaster (Vincent Barboriak) if you
            have broken your spoon and want a new one.
          </li>
          <li>You must be supporting the spoon with your palm
            when you are protecting yourself (ie, no taping your
            spoon to your nose or anything like that)
          </li>
          <li>Please do not run. We don’t want an injury, and
            if it becomes an issue players can be disqualified.
          </li>
          <li>Be gentle while eliminating others. We don’t want
            another spoons related major violation.
          </li>
        </ul>
      </div>
      <div className="h-4"></div>
      <div className="p-4 bg-stone-800 rounded-lg">
        <p className="text-2xl font-semibold pb-2">Special Thanks and Information</p>
        <p className="text-lg">Thanks to <button onClick={() => window.open('https://prorickey.xyz')}><span
          className="underline decoration-orange-500 decoration-2"
        >Trevor Bedson</span></button> for leading
          development, hosting, and maintaining this years game
          website. Thanks to Thomas Fasan for assisting in creating the backend.
          The last person alive will be crowned 2025 spoons champion and
          the last junior alive will be next years Spoonsmaster.
        </p>
        <button className="w-full pt-5 z-10" onClick={() => signIn()}>
          <div
            className="w-1/3 h-16 border-gray-400 hover:bg-gray-400 border-2 rounded-lg flex flex-col justify-center">
            <p className="text-2xl font-semibold">Sign Up Now</p>
          </div>
        </button>
      </div>
    </>
  )

  return (
    <div className="w-[90%] mx-auto pb-10">
      <div className="h-[2px] bg-gray-400 rounded-md"></div>
      <p className="w-full text-6xl font-bold py-5">The Game of Spoons</p>
      <div className="flex flex-row gap-x-4 pt-1">
        <div className="w-full">
          <p className="text-lg p-4 bg-stone-800 rounded-lg">
            At the start of the game, each player is given a spoon with another
            player’s name on it. This is their target. To eliminate their target,
            a player must use their spoon to (LIGHTLY) tap their target on the
            shoulder, defined as a kill. When this occurs, the player will inherit
            their killed target’s spoon, and thus their new target will be the killed
            player’s target. This will continue until there is only one player
            remaining, and the game’s objective is to be the last person standing!
            <br /><br />
            To protect yourself from a player who has your name, you can touch your
            spoon to your nose. When your spoon and nose are touching, you are safe
            (Immune to being killed).</p>
          <div className="h-4"></div>
          <div className="p-4 bg-stone-800 rounded-lg">
            <p className="text-2xl font-semibold pb-1">Safe Zones</p>
            <ul className="list-disc pl-5 text-lg">
              <li>A player’s own dorm</li>
              <li>Bathrooms and showers</li>
              <li>A player’s hall while they are walking to the showers</li>
              <li>PFM during meal hours</li>
              <li>Classrooms during, in the 5 minutes before, and in
                the 5 minutes after a class. You must be in the classroom to
                be protected. This also covers activities for a class that occur
                outside of the classroom but during class hours (ie.
                labs, outdoor activities)
              </li>
              <li>Registered clubs, forums, sports, etc. during advertised hours</li>
              <li>While doing hours for senior leadership or campus service</li>
              <li>Everywhere off campus</li>
            </ul>
          </div>
          {
            typeof window !== 'undefined' && window.innerWidth > 1024 ? null : (
              <div>
                <div className="h-4"></div>
                {secondSection}
              </div>
            )
          }
        </div>
        {
          typeof window !== "undefined" && window.innerWidth > 1024 ? (
            <div className="w-full">
              {secondSection}
            </div>
          ) : null
        }
      </div>
    </div>
  )
}