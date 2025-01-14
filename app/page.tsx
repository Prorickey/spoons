"use client";

import {useEffect} from "react";
import Image from "next/image"

export default function Home() {

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

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
      // 800 is the position, 400 is the speed
      const dateOpacity = Math.max(1 - Math.abs(scrollPosition - 700) / 400, 0);

      if (dateFadeIn) {
        dateFadeIn.style.opacity = dateOpacity.toString();
      }

      const slicerSpoon1 = document.getElementById("slicer-spoon-1");
      const slicerSpoon2 = document.getElementById("slicer-spoon-2");
      const slicerSpoon3 = document.getElementById("slicer-spoon-3");
      const slicerSpoon4 = document.getElementById("slicer-spoon-4");

      const slicerSpeed = 12

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
    <main>
      <div className="h-[30rem] w-full flex flex-col justify-center">
        <div className="h-full"></div>
        <div className="h-full w-full" id="fade-container">
          <h1 className="text-9xl font-bold text-center">
            Spoons 2025
          </h1>
          <div className="flex flex-row w-full justify-center">
            <Image
              id="spoon1"
              className="absolute flippedSpoon overflow-hidden"
              src={"/spoon.svg"}
              alt={"Spoon"}
              height={250}
              width={250}
            />
            <Image
              id="spoon2"
              className="absolute overflow-hidden"
              src={"/spoon.svg"}
              alt={"Spoon"}
              height={250}
              width={250}
            />
          </div>
        </div>
      </div>
      <div className="h-[20rem]"></div>
      <div className="flex flex-col w-full justify-center">
        <div className="h-[150px]">
          <Image
            id="slicer-spoon-1"
            className="absolute flippedSpoon overflow-hidden"
            src={"/spoon.svg"}
            alt={"Spoon"}
            height={150}
            width={150}
          />
        </div>
        <div className="h-[150px]">
          <Image
            id="slicer-spoon-2"
            className="absolute overflow-hidden"
            src={"/spoon.svg"}
            alt={"Spoon"}
            height={150}
            width={150}
          />
        </div>
        <h1
          id="dateFadeIn"
          className="text-9xl font-bold text-center">
          Beginning February 2nd
        </h1>
        <div className="h-[150px]">
          <Image
            id="slicer-spoon-3"
            className="absolute flippedSpoon overflow-hidden"
            src={"/spoon.svg"}
            alt={"Spoon"}
            height={150}
            width={150}
          />
        </div>
        <div className="h-[150px]">
          <Image
            id="slicer-spoon-4"
            className="absolute overflow-hidden"
            src={"/spoon.svg"}
            alt={"Spoon"}
            height={150}
            width={150}
          />
        </div>
      </div>
      <div className="h-[100rem]"></div>
    </main>
  );
}
