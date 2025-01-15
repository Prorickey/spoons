import { signIn, signOut, useSession } from 'next-auth/react';
import {redirect} from "next/navigation";
import styles from "@/app/navbar.module.css"

export default function NavBar({ current }: { current: string }) {

  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return (
      <div className="sticky top-0 flex flex-row-reverse gap-x-5 items-center px-4 py-2">
        <button onClick={() => signOut()}>
          <h1 className="text-xl text-nowrap">Sign out</h1>
        </button>
        <button onClick={() => redirect("/target")}>
          <p className={"text-xl text-nowrap " + (current == "mytarget" ? styles.underlinedText : "")}>{session?.user.killed ? "My Killer" : "My Target"}</p>
        </button>
        {
          current != "home" ? (
            <>
              <div className="w-full"></div>
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