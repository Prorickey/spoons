import { signIn, signOut, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import styles from '@/app/navbar.module.css';
import React, { ReactNode, useContext, useEffect, useState } from 'react';

interface gameStatusData {
  status: string;
}

const NavbarContext = React.createContext({ gameActive: false });

export function NavbarProvider({ children }: { children: ReactNode }) {
  const [gameActive, setGameActive] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json().catch(() => {}))
      .then((data: gameStatusData) => {
        if (data && data.status == 'RUNNING') setGameActive(true);
      });
  }, [gameActive]);

  return (
    <NavbarContext.Provider value={{ gameActive }}>
      {children}
    </NavbarContext.Provider>
  );
}

export default function NavBar({ current }: { current: string }) {
  const { data: session, status } = useSession();
  const { gameActive } = useContext(NavbarContext);

  if (status === 'authenticated' || status === 'loading') {
    return (
      <div className='sticky top-0 flex w-full flex-row-reverse items-center gap-x-5 px-4 py-2'>
        <button onClick={() => signOut()}>
          <h1 className='text-xl text-nowrap'>Sign out</h1>
        </button>
        {gameActive ? (
          <>
            <button onClick={() => redirect('/target')}>
              <p
                className={
                  'text-xl text-nowrap ' +
                  (current == 'mytarget' ? styles.underlinedText : '')
                }
              >
                {session?.user.killed ? 'My Killer' : 'My Target'}
              </p>
            </button>
            <button onClick={() => redirect('/gameStatus')}>
              <p
                className={
                  'text-xl text-nowrap ' +
                  (current == 'gameStatus' ? styles.underlinedText : '')
                }
              >
                Game Status
              </p>
            </button>
          </>
        ) : null}
        <button onClick={() => redirect('/account')}>
          <p className='text-xl text-nowrap'>Account</p>
        </button>
        <div className='w-full'></div>
        {session?.user.gamemaster && current != 'dashboard' ? (
          <>
            <button onClick={() => redirect('/spoonmaster')}>
              <h1 className='underlineEffect float-left text-xl text-nowrap'>
                Spoonmaster Dashboard
              </h1>
            </button>
          </>
        ) : null}
        {current != 'home' ? (
          <>
            <button onClick={() => redirect('/')}>
              <h1 className='underlineEffect float-left text-xl text-nowrap'>
                Home
              </h1>
            </button>
          </>
        ) : null}
      </div>
    );
  } else {
    return (
      <div className='sticky top-0 flex flex-row-reverse items-center justify-between gap-x-5 px-4 py-1'>
        <button onClick={() => signIn()}>
          <h1 className='text-xl text-nowrap'>Log In</h1>
        </button>
        {gameActive ? (
          <button onClick={() => redirect('/gameStatus')}>
            <p
              className={
                'text-xl text-nowrap ' +
                (current == 'gameStatus' ? styles.underlinedText : '')
              }
            >
              Game Status
            </p>
          </button>
        ) : null}
        <div className='w-full'></div>
      </div>
    );
  }
}
