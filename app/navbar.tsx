import { signIn, signOut, useSession } from 'next-auth/react';
import {redirect} from "next/navigation";
import styles from "@/app/navbar.module.css"
import React, { ReactNode, useContext, useEffect, useState } from 'react';

interface gameStatusData {
  status: string
}

const NavbarContext = React.createContext({ gameActive: false })

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [gameActive, setGameActive] = useState<boolean>(false)

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json().catch(() => {}))
      .then((data: gameStatusData) => {
        if(data && data.status == "RUNNING") setGameActive(true)
      })
  }, [gameActive]);

  return (
    <NavbarContext.Provider value={{ gameActive }}>
      {children}
    </NavbarContext.Provider>
  );
}

export default function NavBar({ current }: { current: string }) {

  const { data: session, status } = useSession()
  const { gameActive } = useContext(NavbarContext)

  if (status === "authenticated" || status === "loading") {
    return (
      <div className="sticky w-full top-0 flex flex-row-reverse gap-x-5 items-center px-4 py-2">
        <button onClick={() => signOut()}>
          <h1 className="text-xl text-nowrap">Sign out</h1>
        </button>
        {
          gameActive ?
            <button onClick={() => redirect("/target")}>
              <p className={"text-xl text-nowrap " + (current == "mytarget" ? styles.underlinedText : "")}>{session?.user.killed ? "My Killer" : "My Target"}</p>
            </button>
            : null
        }
        <button onClick={() => redirect("/account")}>
          <p className="text-xl text-nowrap">Account</p>
        </button>
        <div className="w-full"></div>
        {
          session?.user.gamemaster && current != "dashboard" ? (
            <>
              <button onClick={() => redirect("/spoonmaster")}>
                <h1 className="float-left text-nowrap text-xl underlineEffect">Spoonmaster Dashboard</h1>
              </button>
            </>
          ) : null
        }
        {
          current != "home" ? (
            <>
              <button onClick={() => redirect("/")}>
                <h1 className="float-left text-nowrap text-xl underlineEffect">Home</h1>
              </button>
            </>
          ) : null
        }
      </div>
    )
  } else {
    return (
      <div className="sticky top-0 flex flex-row-reverse justify-between items-center px-4 py-1">
        <button onClick={() => signIn()}>
          <h1 className="text-xl">Log In</h1>
        </button>
      </div>
    )
  }

}