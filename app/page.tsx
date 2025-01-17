"use client";

import {useEffect} from "react";
import Image from "next/image"
import NavBar from '@/app/navbar';
import { SessionProvider } from 'next-auth/react';

export default function Home() {

  useEffect(() => {
    (() => {
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
      const slicerSpoon2 = document.getElementById("slicer-spoon-2");
      const slicerSpoon3 = document.getElementById("slicer-spoon-3");
      const slicerSpoon4 = document.getElementById("slicer-spoon-4");

      const slicerSpeed = 7

      if (slicerSpoon1)
        slicerSpoon1.style.transform = `rotateY(180deg) translate(${(scrollPosition - 650)*slicerSpeed - 1200}px, 0px)`;

      if (slicerSpoon2)
        slicerSpoon2.style.transform = `translate(${(scrollPosition - 700)*slicerSpeed - 1200}px, 0px)`;

      if (slicerSpoon3)
        slicerSpoon3.style.transform = `rotateY(180deg) translate(${(scrollPosition - 750)*slicerSpeed - 1200}px, 0px)`;

      if (slicerSpoon4)
        slicerSpoon4.style.transform = `translate(${(scrollPosition - 800)*slicerSpeed - 1200}px, 0px)`;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <SessionProvider>
      <main>
        <NavBar current={"home"}/>
        <div className="h-[40rem] w-full flex flex-col justify-center">
          <div className="w-full" id="fade-container">
            <h1 className="text-9xl font-bold text-center">
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
        <div className="relative h-[100rem]">
          <div className="relative h-[100rem] w-full">
            <div className="sticky top-0">
              <div className="h-[150px]">
                <Image
                  id="slicer-spoon-1"
                  className="flippedSpoon slicerSpoon translate-y-[-200%]"
                  src={"/spoon.svg"}
                  alt={"Spoon"}
                  height={150}
                  width={150}
                />
              </div>
              <div className="h-[150px]">
                <Image
                  id="slicer-spoon-2"
                  className="slicerSpoon translate-y-[-100%]"
                  src={"/spoon.svg"}
                  alt={"Spoon"}
                  height={150}
                  width={150}
                />
              </div>
              <h1
                id="dateFadeIn"
                className="text-8xl font-bold text-center">
                Beginning February 6th
              </h1>
              <div className="h-[150px]">
                <Image
                  id="slicer-spoon-3"
                  className="flippedSpoon slicerSpoon translate-y-[100%]"
                  src={'/spoon.svg'}
                  alt={'Spoon'}
                  height={150}
                  width={150}
                />
              </div>
              <div className="h-[150px]">
                <Image
                  id="slicer-spoon-4"
                  className="slicerSpoon translate-y-[200%]"
                  src={"/spoon.svg"}
                  alt={"Spoon"}
                  height={150}
                  width={150}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-[90rem]"></div>
      </main>
    </SessionProvider>
  );
}
