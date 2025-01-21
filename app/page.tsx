"use client";

import Image from "next/image"
import NavBar, { NavbarProvider } from '@/app/navbar';
import {signIn} from 'next-auth/react';
import { useEffect } from 'react';

export default function Home() {

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

      const text1 = document.getElementById("text-1");
      const text2 = document.getElementById("text-2");
      const dateObject = document.getElementById("date-object");
      const dateContainer = document.getElementById("date-container");

      if(dateContainer && dateObject && text1 && text2) {
        const rect = dateContainer.getBoundingClientRect();
        console.log(rect.top, dateContainer.offsetTop)
        if(0 < rect.top) {
          const factor = 1 - (rect.top / dateContainer.offsetTop)
          dateObject.style.scale = factor + ""
          dateObject.style.opacity = factor + ""
          text1.style.scale = factor + ""
          text1.style.opacity = factor + ""
        } else if(rect.bottom > dateObject.getBoundingClientRect().y) {
          dateObject.style.scale = "1"
          dateObject.style.opacity = "1"
          text1.style.opacity = "1"
          text1.style.opacity = "1"
        } else if(rect.bottom < dateObject.getBoundingClientRect().y+rect.height/8) {
          // TODO: Fix this
          const factor = 1- (rect.bottom) / (dateObject.getBoundingClientRect().y+rect.height/8);
          text1.style.scale = factor + ""
          text1.style.opacity = factor + ""
        } else {
          text1.style.scale = "0"
          text2.style.opacity = "0"
        }

        /*if(rect.bottom > rect.height) {
          const factor = 1 - rect.y / (650 + rect.height / 2);
          text2.style.scale = factor + "";
          text2.style.opacity = factor + "";
        }*/
      }

      const spoons: {ele: HTMLDivElement, rot: number}[] = dateSpoonsRotation.map((rot, ind) => {
        return {
          ele: document.getElementById("rotate-spoon-" + ind) as HTMLDivElement,
          rot: parseInt(rot)
        }
      })

      for(let i = 0; i < spoons.length; i++) {
        const spoon = spoons[i].ele;
        const rot = spoons[i].rot;
        spoon.style.transform = `rotate(${rot-(scrollPosition/2)}deg)`
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dateSpoonsRotation])

  return (
    <>
      <NavbarProvider>
        <NavBar current={'home'} />
      </NavbarProvider>
      <div className="h-[40rem] w-full flex flex-col justify-center">
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
      <div className="h-[300vh]">
        <div className="w-full flex flex-col justify-center absolute">
        </div>
        <div id="date-container" className="block h-[150vh]">
          <div
            id="date-object"
            style={{opacity: "0", scale: "0"}}
            className="fixed top-0 h-full w-full flex flex-col justify-around">
            <div className="flex flex-row justify-around w-full">
              <div id="text-1" style={{scale: "0", opacity: "0"}} className="absolute">
                <p className="text-4xl text-center font-semibold pb-5 text-nowrap">Beginning February 5th</p>
                <p className="text-xl text-center text-gray-200">
                  In the dawn of early morning, you will<br /> receive a spoon beneath your door
                </p>
              </div>
              <div id="text-2" style={{scale: "0", opacity: "0"}} className="absolute">
                <p className="text-4xl text-center font-semibold pb-5 text-nowrap">Welcome Your Spoonmaster</p>
                <p className="text-xl text-center text-gray-200">
                  This years game of spoons will be hosted<br /> by Vincent Barboriak, your previous years winner
                </p>
              </div>
              {
                dateSpoonsRotation.map((rot, ind) => (
                  <div id={'rotate-spoon-' + ind} key={rot} style={{ transform: `rotate(${rot}deg)` }}
                       className="absolute">
                    <Image
                      src="/spoon.svg"
                      alt="Spoon"
                      className="ml-[28rem] rotate-45"
                      width={100}
                      height={100}
                    />
                  </div>
                ))
              }
            </div>
          </div>
          <div className="h-[100rem]"></div>
        </div>
      </div>

      {
        /*
        <div className="w-full h-[70rem]" id="date-bounding-container">
        <div className="w-full top-0" id="date-container">
          <div className="h-[50px]"></div>
          <div className="h-[125px] lg:h-[150px]">
            <Image
              id="slicer-spoon-1"
              className="absolute flippedSpoon slicerSpoon translate-y-[-200%]"
              src={'/spoon.svg'}
              alt={'Spoon'}
              height={slicerSize}
              width={slicerSize}
            />
            <Image
              id="slicer-spoon-1-1"
              className="absolute slicerSpoon translate-y-[-200%]"
              src={'/spoon.svg'}
              alt={'Spoon'}
              height={slicerSize}
              width={slicerSize}
            />
          </div>
          <div className="h-[125px] lg:h-[150px]">
            <Image
              id="slicer-spoon-2"
              className="absolute slicerSpoon translate-y-[-100%]"
              src={'/spoon.svg'}
              alt={'Spoon'}
              height={slicerSize}
              width={slicerSize}
            />
            <Image
              id="slicer-spoon-2-1"
              className="absolute flippedSpoon slicerSpoon translate-y-[-100%]"
              src={'/spoon.svg'}
              alt={'Spoon'}
              height={slicerSize}
              width={slicerSize}
            />
          </div>
          <h1
            id="dateFadeIn"
            className="text-6xl lg:text-8xl font-bold text-center">
            Beginning February 5th
          </h1>
          <div className="h-[125px] lg:h-[150px]">
            <Image
              id="slicer-spoon-3"
              className="absolute flippedSpoon slicerSpoon translate-y-[100%]"
              src={'/spoon.svg'}
              alt={'Spoon'}
              height={slicerSize}
              width={slicerSize}
            />
            <Image
              id="slicer-spoon-3-1"
              className="absolute slicerSpoon translate-y-[100%]"
              src={'/spoon.svg'}
              alt={'Spoon'}
              height={slicerSize}
              width={slicerSize}
            />
          </div>
          <div className="h-[125px] lg:h-[150px]">
            <Image
              id="slicer-spoon-4"
              className="absolute slicerSpoon translate-y-[200%]"
              src={'/spoon.svg'}
              alt={'Spoon'}
              height={slicerSize}
              width={slicerSize}
            />
            <Image
              id="slicer-spoon-4"
              className="absolute flippedSpoon slicerSpoon translate-y-[200%]"
              src={'/spoon.svg'}
              alt={'Spoon'}
              height={slicerSize}
              width={slicerSize}
            />
          </div>
        </div>
      </div>
         */
      }
      {
        /*
        <div className="h-[20rem]"></div>
      <div className="w-full h-[120rem] lg:h-[105rem]">
        <div className="absolute w-full h-[130rem] overflow-x-hidden">
          <div className="sticky top-1/2 -translate-y-1/2 flex flex-row justify-center w-full">
            <Image
              id="growing-spoon"
              className="rotate-45 justify-self-center"
              src={'/spoon.svg'}
              alt={'Spoon'}
              height={150}
              width={150}
            />
            <p
              id="welcome-game-master"
              className="absolute w-full top-[46%] text-nowrap text-2xl lg:text-6xl text-black font-extrabold z-[5]"
              ref={welcomeGameMasterRef}
            >
              Welcome Your Spoonsmaster</p>
            <p
              id="welcome-game-master-name"
              className="absolute w-full top-[46%] text-nowrap text-2xl lg:text-6xl text-black font-extrabold translate-x-[900px] z-[5]"
              ref={welcomeGameMasterNameRef}
            >
              Vincent Barboriak</p>
          </div>
        </div>
      </div>
         */
      }
      <SpoonsGameFooter />
    </>
  );
}

function SpoonsGameFooter() {

  const secondSection = (
    <>
      <p className="text-2xl font-semibold pt-10 pb-1">Additional Clarification</p>
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
      <p className="text-2xl font-semibold pt-10 pb-2">Special Thanks and Information</p>
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
    </>
  )

  return (
    <div className="w-[90%] mx-auto pb-10">
      <div className="h-[2px] bg-gray-400 rounded-md"></div>
      <div className="flex flex-row gap-x-4 pt-5">
        <div className="w-full">
          <p className="w-full text-4xl font-bold py-5">The Game of Spoons</p>
          <p className="text-lg">
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
          <p className="text-2xl font-semibold pt-10 pb-1">Safe Zones</p>
          <ul className="list-disc pl-5 text-lg">
            <li>A player’s own dorm</li>
            <li>Bathrooms and showers</li>
            <li>A player’s hall while they are walking to the showers</li>
            <li>PFM during meal hours</li>
            <li>Classrooms during, in the 5 minutes before, and in
              the 5 minutes after a class. This also covers activities for a class that occur
              outside of the classroom but during class hours (ie.
              labs, outdoor activities)
            </li>
            <li>Registered clubs, forums, sports, etc. during advertised hours</li>
            <li>While doing hours for senior leadership or campus service</li>
            <li>Everywhere off campus</li>
          </ul>
          {
            typeof window !== "undefined" && window.innerWidth > 1024 ? null : secondSection
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