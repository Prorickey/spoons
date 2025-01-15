"use client";

import {SessionProvider, useSession} from "next-auth/react";
import NavBar from "@/app/navbar";

export function MyTarget() {

  const { data: session, status } = useSession()

  return (
    <>
      <NavBar current={"mytarget"}/>
    </>
  )
}

export default function Wrapper() {
  return (
    <SessionProvider>
      <MyTarget />
    </SessionProvider>
  )
}