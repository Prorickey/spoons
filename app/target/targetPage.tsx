"use client";

import {SessionProvider} from "next-auth/react";
import NavBar from "@/app/navbar";

function MyTarget() {

  // const { data: session, status } = useSession()

  return (
    <>
      <NavBar current={"mytarget"}/>
    </>
  )
}

export default function MyTargetWrapper() {
  return (
    <SessionProvider>
      <MyTarget />
    </SessionProvider>
  )
}