"use client";

import { useEffect, useRef } from 'react';
import Image from "next/image"
import NavBar from '@/app/navbar';
import {SessionProvider, signIn} from 'next-auth/react';

export default function Home() {

  const welcomeGameMasterRef = useRef<HTMLObjectElement>(null)
  const welcomeGameMasterNameRef = useRef<HTMLObjectElement>(null)

  useEffect(() => {
    (() => {
      if(typeof window == "undefined") return;
      const slicerSpoon1 = document.getElementById("slicer-spoon-1");
      const slicerSpoon2 = document.getElementById("slicer-spoon-2");
      const slicerSpoon3 = document.getElementById("slicer-spoon-3");
      const slicerSpoon4 = document.getElementById("slicer-spoon-4");

      if (slicerSpoon1)
        slicerSpoon1.style.transform = `rotateY(180deg) translate(10000px, 0px)`;

      if (slicerSpoon2)
        slicerSpoon2.style.transform = `translate(10000px, 0px)`;

      if (slicerSpoon3)
        slicerSpoon3.style.transform = `rotateY(180deg) translate(10000px, 0px)`;

      if (slicerSpoon4)
        slicerSpoon4.style.transform = `translate(10000px, 0px)`;
    })()

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

      const dateFadeIn = document.getElementById("dateFadeIn");
      const dateOpacitySpeed = 700
      const dateOpacity = Math.max(1 - Math.abs(scrollPosition - 800) / dateOpacitySpeed, 0);

      if (dateFadeIn) {
        dateFadeIn.style.opacity = dateOpacity.toString();
      }

      const slicerSpoon1 = document.getElementById("slicer-spoon-1");
      const slicerSpoon11 = document.getElementById("slicer-spoon-1-1");
      const slicerSpoon2 = document.getElementById("slicer-spoon-2");
      const slicerSpoon21 = document.getElementById("slicer-spoon-2-1");
      const slicerSpoon3 = document.getElementById("slicer-spoon-3");
      const slicerSpoon31 = document.getElementById("slicer-spoon-3-1");
      const slicerSpoon4 = document.getElementById("slicer-spoon-4");
      const slicerSpoon41 = document.getElementById("slicer-spoon-4-1");

      const slicerSpeed = 7

      if (slicerSpoon1)
        slicerSpoon1.style.transform = `rotateY(180deg) translate(${(scrollPosition - 700)*slicerSpeed - 1200}px, 0px)`;

      if (slicerSpoon11)
        slicerSpoon11.style.transform = `translate(${(scrollPosition - 700)*slicerSpeed - 1200}px, 0px)`;

      if (slicerSpoon2)
        slicerSpoon2.style.transform = `translate(${(scrollPosition - 650)*slicerSpeed - 1200}px, 0px)`;

      if (slicerSpoon21)
        slicerSpoon21.style.transform = `rotateY(180deg) translate(${(scrollPosition - 650)*slicerSpeed - 1200}px, 0px)`;

      if (slicerSpoon3)
        slicerSpoon3.style.transform = `rotateY(180deg) translate(${(scrollPosition - 800)*slicerSpeed - 1200}px, 0px)`;

      if (slicerSpoon31)
        slicerSpoon31.style.transform = `translate(${(scrollPosition - 800)*slicerSpeed - 1200}px, 0px)`;

      if (slicerSpoon4)
        slicerSpoon4.style.transform = `translate(${(scrollPosition - 750)*slicerSpeed - 1200}px, 0px)`;

      if (slicerSpoon41)
        slicerSpoon41.style.transform = `rotateY(180deg) translate(${(scrollPosition - 750)*slicerSpeed - 1200}px, 0px)`;

      const growingSpoon = document.getElementById("growing-spoon");

      const growStart = 1400
      const growEnd = 1600
      const range = growEnd - growStart;
      const maxSizeFactor = ((window.innerWidth) / (150*1.25)) - 1

      if(growingSpoon && scrollPosition >= growStart && scrollPosition <= growEnd) {
        const scrollPosToRot = ((growEnd - scrollPosition)*(95) / range) - 50
        const scrollPosToSize = (((scrollPosition - growStart)*maxSizeFactor / range) + 1) * (150)
        growingSpoon.style.transform = `rotate(${scrollPosToRot}deg)`;
        growingSpoon.style.width = scrollPosToSize + 'px';
      } else if(growingSpoon && scrollPosition < growStart) {
        growingSpoon.style.transform = ``
        growingSpoon.style.width = ``
      } else if(growingSpoon && scrollPosition > growEnd) {
        const scrollPosToRot = ((growEnd - 1600)*(95) / range) - 50
        const scrollPosToSize = (((1600 - growStart)*maxSizeFactor / range) + 1) * (150)
        growingSpoon.style.transform = `rotate(${scrollPosToRot}deg)`;
        growingSpoon.style.width = scrollPosToSize + 'px';
      }

      const welcomeGameMaster = document.getElementById("welcome-game-master");

      const welcomeStart = 1600
      const welcomePause = 1800
      const welcomeUnPause = 2000
      const welcomeEnd = 2200
      const fullWidth = window.innerWidth
      const adjust = welcomeGameMasterRef.current ? (welcomeGameMasterRef.current.clientWidth/4) : 0

      if(welcomeGameMaster && ((scrollPosition >= welcomeStart && scrollPosition <= welcomePause))) {
        const scrollPosToPos = (-(scrollPosition - welcomeStart)*(fullWidth/2) / (welcomePause - welcomeStart)) + (fullWidth)
        const scrollPosToOpacity = ((scrollPosition - welcomeStart) / (welcomePause - welcomeStart))
        welcomeGameMaster.style.transform = `translate(${scrollPosToPos-adjust}px, 0px)`;
        welcomeGameMaster.style.opacity = scrollPosToOpacity.toString();
      } else if(welcomeGameMaster && scrollPosition >= welcomeUnPause && scrollPosition <= welcomeEnd) {
        const scrollPosToPos = (-(scrollPosition - welcomeUnPause)*(fullWidth/2) / (welcomeEnd - welcomeUnPause)) + ((fullWidth/2))
        const scrollPosToOpacity = 1-((scrollPosition - welcomeUnPause) / (welcomeEnd - welcomeUnPause))
        welcomeGameMaster.style.transform = `translate(${scrollPosToPos-adjust}px, 0px)`;
        welcomeGameMaster.style.opacity = scrollPosToOpacity.toString();
      } else if(welcomeGameMaster && scrollPosition < welcomeStart) {
        welcomeGameMaster.style.transform = `translate(${fullWidth}px, 0px)`;
        welcomeGameMaster.style.opacity = "0"
      } else if(welcomeGameMaster && scrollPosition > welcomeEnd) {
        welcomeGameMaster.style.transform = `translate(0px, 0px)`;
        welcomeGameMaster.style.opacity = "0"
      }

      const welcomeGameMasterName = document.getElementById("welcome-game-master-name");

      const welcomeNameStart = 2200
      const welcomeNamePause = 2400
      const welcomeNameUnPause = 2600
      const welcomeNameEnd = 2800
      const fullWidthName = window.innerWidth
      const adjustName = welcomeGameMasterNameRef.current ? (welcomeGameMasterNameRef.current.clientWidth/4) : 0

      if(welcomeGameMasterName && ((scrollPosition >= welcomeNameStart && scrollPosition <= welcomeNamePause))) {
        const scrollPosToPos = (-(scrollPosition - welcomeNameStart)*(fullWidthName/2) / (welcomeNamePause - welcomeNameStart)) + (fullWidthName)
        const scrollPosToOpacity = ((scrollPosition - welcomeNameStart) / (welcomeNamePause - welcomeNameStart))
        welcomeGameMasterName.style.transform = `translate(${scrollPosToPos-adjustName}px, 0px)`;
        welcomeGameMasterName.style.opacity = scrollPosToOpacity.toString();
      } else if(welcomeGameMasterName && scrollPosition >= welcomeNameUnPause && scrollPosition <= welcomeNameEnd) {
        const scrollPosToPos = (-(scrollPosition - welcomeNameUnPause)*(fullWidthName/2) / (welcomeNameEnd - welcomeNameUnPause)) + (fullWidthName/2)
        const scrollPosToOpacity = 1-((scrollPosition - welcomeNameUnPause) / (welcomeNameEnd - welcomeNameUnPause))
        welcomeGameMasterName.style.transform = `translate(${scrollPosToPos-adjustName}px, 0px)`;
        welcomeGameMasterName.style.opacity = scrollPosToOpacity.toString();
      } else if(welcomeGameMasterName && scrollPosition < welcomeNameStart) {
        welcomeGameMasterName.style.transform = `translate(900px, 0px)`;
        welcomeGameMasterName.style.opacity = "0"
      } else if(welcomeGameMasterName && scrollPosition > welcomeNameEnd) {
        welcomeGameMasterName.style.transform = `translate(0px, 0px)`;
        welcomeGameMasterName.style.opacity = "0"
      }

    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  let slicerSize = 125
  if(typeof window !== "undefined") slicerSize = window.innerWidth < 1024 ? 125 : 150

  return (
    <SessionProvider>
      <main>
        <NavBar current={"home"}/>
        <div className="h-[40rem] w-full flex flex-col justify-center">
          <div className="w-full" id="fade-container">
            <h1 className="text-7xl lg:text-9xl font-bold text-center">
              Spoons 2025
            </h1>
            <div className="flex flex-row h-[250px] w-full justify-center relative">
              <Image
                id="spoon1"
                className="absolute flippedSpoon"
                src={"/spoon.svg"}
                alt={"Spoon"}
                height={250}
                width={250}
              />
              <Image
                id="spoon2"
                className="absolute"
                src={"/spoon.svg"}
                alt={"Spoon"}
                height={250}
                width={250}
              />
            </div>
          </div>
        </div>
        <div className="w-full h-[70rem]">
          <div className="absolute w-full h-[70rem]">
            <div className="sticky w-full top-0">
              <div className="h-[50px]"></div>
              <div className="h-[125px] lg:h-[150px]">
                <Image
                  id="slicer-spoon-1"
                  className="absolute flippedSpoon slicerSpoon translate-y-[-200%]"
                  src={"/spoon.svg"}
                  alt={"Spoon"}
                  height={slicerSize}
                  width={slicerSize}
                />
                <Image
                  id="slicer-spoon-1-1"
                  className="absolute slicerSpoon translate-y-[-200%]"
                  src={"/spoon.svg"}
                  alt={"Spoon"}
                  height={slicerSize}
                  width={slicerSize}
                />
              </div>
              <div className="h-[125px] lg:h-[150px]">
                <Image
                  id="slicer-spoon-2"
                  className="absolute slicerSpoon translate-y-[-100%]"
                  src={"/spoon.svg"}
                  alt={"Spoon"}
                  height={slicerSize}
                  width={slicerSize}
                />
                <Image
                  id="slicer-spoon-2-1"
                  className="absolute flippedSpoon slicerSpoon translate-y-[-100%]"
                  src={"/spoon.svg"}
                  alt={"Spoon"}
                  height={slicerSize}
                  width={slicerSize}
                />
              </div>
              <h1
                id="dateFadeIn"
                className="text-6xl lg:text-8xl font-bold text-center">
                Beginning February 6th
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
                  src={"/spoon.svg"}
                  alt={"Spoon"}
                  height={slicerSize}
                  width={slicerSize}
                />
                <Image
                  id="slicer-spoon-4"
                  className="absolute flippedSpoon slicerSpoon translate-y-[200%]"
                  src={"/spoon.svg"}
                  alt={"Spoon"}
                  height={slicerSize}
                  width={slicerSize}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-[20rem]"></div>
        <div className="w-full h-[120rem] lg:h-[105rem]">
          <div className="absolute w-full h-[130rem]">
            <div className="sticky top-1/2 -translate-y-1/2 flex flex-row justify-center w-full">
              <Image
                id="growing-spoon"
                className="rotate-45 justify-self-center"
                src={"/spoon.svg"}
                alt={"Spoon"}
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
        <SpoonsGameFooter />
      </main>
    </SessionProvider>
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