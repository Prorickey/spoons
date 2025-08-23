'use client';

import NavBar, { NavbarProvider } from '@/app/navbar';
import { useEffect, useState } from 'react';
import { AnonPlayerObj, FullGameStatus } from '@/app/api/fullGameStatus/route';
import styles from '@/app/gameStatus/gamestatus.module.css';

export default function GameStatus() {
  const [gameData, setGameData] = useState<AnonPlayerObj[]>([]);

  useEffect(() => {
    fetch('/api/fullGameStatus')
      .then((res) => res.json())
      .then((data: FullGameStatus) => {
        setGameData(data.data);
      });
  }, []);

  const alivePlayers = gameData
    .filter((player) => player.alive)
    .sort((a, b) => b.kills - a.kills);

  const deadPlayers = gameData
    .filter((player) => !player.alive)
    .sort((a, b) => b.kills - a.kills);

  return (
    <main>
      <NavbarProvider>
        <NavBar current={'gameStatus'} />
      </NavbarProvider>
      <div className='mx-auto my-8 w-5/6'>
        <table className='w-full border border-gray-300'>
          <thead>
            <tr className='border border-gray-300 bg-gray-800 text-white'>
              <th className='px-4 py-2'>Nickname</th>
              <th className='px-4 py-2'>Kills</th>
            </tr>
          </thead>
          <tbody>
            {/* Alive Players Section */}
            {alivePlayers.length > 0 && (
              <>
                {alivePlayers.map((player, index) => (
                  <tr
                    key={index}
                    className={
                      'border-b border-gray-300 bg-gray-800 ' + styles.aliveBox
                    }
                  >
                    <td className='px-4 py-2'>
                      {player.nickname +
                        (player.firstName
                          ? ` - ${player.firstName} ${player.lastName}`
                          : '')}
                    </td>
                    <td className='px-4 py-2 text-center'>{player.kills}</td>
                  </tr>
                ))}
              </>
            )}

            {/* Dead Players Section */}
            {deadPlayers.length > 0 && (
              <>
                {deadPlayers.map((player, index) => (
                  <tr
                    key={index}
                    className={
                      'border-b border-gray-300 bg-gray-800 ' + styles.deadBox
                    }
                  >
                    <td className='px-4 py-2'>
                      {player.nickname +
                        (player.firstName
                          ? ` - ${player.firstName} ${player.lastName}`
                          : '')}
                    </td>
                    <td className='px-4 py-2 text-center'>{player.kills}</td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
