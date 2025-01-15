import { signIn, signOut, useSession } from 'next-auth/react';

export default function NavBar() {

  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return (
      <div className="sticky top-0 flex flex-row-reverse gap-x-5 items-center px-4 py-1">
        <button onClick={() => signOut()}>
          <h1 className="text-xl">Sign out</h1>
        </button>
        <h1 className="text-xl">{session?.user.killed ? "My Killer" : "My Target"}</h1>
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