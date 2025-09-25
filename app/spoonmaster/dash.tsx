'use client';

import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import NavBar, { NavbarProvider } from '@/app/navbar';
import { SessionProvider } from 'next-auth/react';
import { Input } from '@/components/ui/input';
import { halls } from '@/app/api/auth/[...nextauth]/halls';
import { Toaster, toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface targetData {
  firstName: string;
  lastName: string;
  currentTarget: number;
  id: number;
  hallId: string;
}

interface targetRule {
  id: number;
  type: number; // 0 = "Target"
  player1id: number;
  player2id: number;
}

export interface KillData {
  id: number;
  createdAt: Date;
  approved: boolean;
  contest: boolean;
  killer: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  victim: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export function Dashboard() {
  const [ffa, setFFA] = useState(false);
  const [gameState, setGameState] = useState('PREGAME');
  const [targets, setTargets] = useState<targetData[]>([]);
  const [selectedHall, setSelectedHall] = useState('');
  const [hallTargets, setHallTargets] = useState<targetData[]>([]);
  const [targetRules, setTargetRules] = useState<targetRule[]>([]);
  const [newRule, setNewRule] = useState({
    player1id: '',
    player2id: '',
  });

  const fetchTargetRules = async () => {
    const res = await fetch('/api/admin/targetRules');
    const data = await res.json();
    setTargetRules(data.rules);
  };

  const handleDeleteRule = async (id: number) => {
    await fetch(`/api/admin/targetRules`, {
      method: 'DELETE',
      body: JSON.stringify({
        id: id,
      }),
    });
    fetchTargetRules();
  };

  const handleCreateRule = async () => {
    const { player1id, player2id } = newRule;
    if (!player1id || !player2id) {
      toast.warning('Please select two players.');
      return;
    }

    const res = await fetch('/api/admin/targetRules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 0,
        player1id: Number(player1id),
        player2id: Number(player2id),
      }),
    });

    if (res.ok) {
      setNewRule({ player1id: '', player2id: '' });
      fetchTargetRules();
    } else {
      toast.warning('Failed to create rule.');
    }
  };

  const [manualAccount, setManualAccount] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    hallId: '',
    grade: '',
    nickname: '',
  });

  const fetchGameState = async () => {
    const res = await fetch('/api/status');
    const data = await res.json();
    setGameState(data.status);
    setFFA(data.ffa);
  };

  const updateGameState = async (state: string) => {
    const actionText =
      state === 'RUNNING'
        ? 'start the game'
        : state === 'POSTGAME'
          ? 'end the game'
          : 'reset the game';

    const confirmed = window.confirm(`Are you sure you want to ${actionText}?`);
    if (!confirmed) return;

    await fetch('/api/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state: state }),
    });
    setGameState(state);
  };

  const fetchTargets = async () => {
    const res = await fetch('/api/admin/targets');
    const data = await res.json();
    setTargets(Array.from(data.targets));
  };

  const handleTargetsAction = async (action: string) => {
    await fetch('/api/admin/targets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    fetchTargets();
  };

  const handleGameStateAction = () => {
    if (gameState === 'PREGAME') {
      updateGameState('RUNNING'); // Start the game
    } else if (gameState === 'RUNNING') {
      updateGameState('POSTGAME'); // End the game
    } else if (gameState === 'POSTGAME') {
      updateGameState('PREGAME'); // Reset the game
    }
  };

  const handleFFAAction = () => {
    if (ffa) return;

    sendFFAAction();
    setFFA(!ffa);
  };

  const sendFFAAction = async () => {
    await fetch('/api/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ffa: true }),
    });
  };

  const handleManualAccountChange = (name: string, value: string) => {
    setManualAccount({ ...manualAccount, [name]: value });
  };

  const handleClearManualAccount = () => {
    setManualAccount({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      hallId: '',
      grade: '',
      nickname: '',
    });
  };

  const handleSaveManualAccount = async () => {
    const { firstName, lastName, email, phone, hallId, grade, nickname } =
      manualAccount;
    console.log(manualAccount);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !hallId ||
      !grade ||
      !nickname
    ) {
      toast.warning('Please fill out all fields before saving.');
      return;
    }

    try {
      const res = await fetch('/api/admin/createManualAccount', {
        method: 'POST',
        body: JSON.stringify(manualAccount),
      });

      if (res.ok) {
        toast.success('Account created successfully!');
        handleClearManualAccount();
      } else {
        toast.warning('Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Error creating manual account:', error);
      toast.warning('An error occurred. Please try again.');
    }
  };

  const [kills, setKills] = useState<KillData[]>([]);

  // New: Fetch FFA kills from the server
  const fetchFfaKills = async () => {
    const res = await fetch('/api/admin/kills');
    const data = await res.json();
    setKills(data.kills);
  };

  // Revert a kill: Confirm then reset victim's killed status and delete the kill entry
  const handleRevertKill = async (killId: number) => {
    await fetch('/api/admin/kills/revert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: killId }),
    });
    fetchFfaKills();
  };

  // Approve a kill
  const handleApproveKill = async (killId: number) => {
    await fetch('/api/admin/kills/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: killId }),
    });
    fetchFfaKills();
  };

  useEffect(() => {
    fetchGameState();
    fetchTargets();
    fetchTargetRules();
  }, []);

  // Fetch FFA kills only when FFA mode is enabled
  useEffect(() => {
    if (ffa) fetchFfaKills();
  }, [ffa]);

  useEffect(() => {
    const filteredTargets = targets.filter((t) => t.hallId === selectedHall);
    setHallTargets(filteredTargets);
  }, [selectedHall, targets]);

  return (
    <div>
      <Toaster />
      <NavbarProvider>
        <NavBar current={'dashboard'} />
      </NavbarProvider>
      <main className='p-8'>
        <h1 className='mb-4 text-4xl font-bold'>Admin Dashboard</h1>

        {/* Game State Controls */}
        <div className='mb-6'>
          <h2 className='mb-2 text-2xl font-semibold'>Game State</h2>
          <p className='mb-1 text-lg'>
            Number of players:{' '}
            <span className='font-bold'>{targets.length}</span>
          </p>
          <p className='mb-4 text-lg'>
            Current game state: <span className='font-bold'>{gameState}</span>
          </p>
          <div className={'flex flex-row gap-4'}>
            <Button onClick={handleGameStateAction}>
              {gameState === 'PREGAME' && 'Start Game'}
              {gameState === 'RUNNING' && 'End Game'}
              {gameState === 'POSTGAME' && 'Reset Game'}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='secondary'>
                  {ffa ? 'FFA Enabled' : 'Enable FFA'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will enable FFA mode and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleFFAAction}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Target Rules Section */}
        <Tabs defaultValue='targetRules'>
          <TabsList>
            <TabsTrigger value='targetRules'>Target Rules</TabsTrigger>
            <TabsTrigger value='targetManagement'>
              Target Management
            </TabsTrigger>
            <TabsTrigger value='manualAccCreator'>
              Manual Account Creator
            </TabsTrigger>
            <TabsTrigger value='targetsByHall'>
              View Targets By Hall
            </TabsTrigger>
            {ffa && <TabsTrigger value='ffa'>Free For All</TabsTrigger>}
          </TabsList>
          <TabsContent value='targetRules'>
            <h2 className='mb-2 text-2xl font-semibold'>Target Rules</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Player 1</TableHead>
                  <TableHead>Player 2</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {targetRules.map((rule) => {
                  const player1 = targets.find((t) => t.id === rule.player1id);
                  const player2 = targets.find((t) => t.id === rule.player2id);

                  return (
                    <TableRow key={rule.id}>
                      <TableCell>Target</TableCell>
                      <TableCell>
                        {player1
                          ? `${player1.firstName} ${player1.lastName}`
                          : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        {player2
                          ? `${player2.firstName} ${player2.lastName}`
                          : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant='destructive'>Delete</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permenantly delete this rule.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteRule(rule.id)}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Create New Rule */}
            <div className='mt-4 flex gap-4'>
              <Select
                onValueChange={(id) =>
                  setNewRule({ ...newRule, player1id: id })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Player 1' />
                </SelectTrigger>
                <SelectContent>
                  {targets.map((player) => (
                    <SelectItem key={player.id} value={player.id.toString()}>
                      {player.firstName} {player.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(id) =>
                  setNewRule({ ...newRule, player2id: id })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select Player 2' />
                </SelectTrigger>
                <SelectContent>
                  {targets.map((player) => (
                    <SelectItem key={player.id} value={player.id.toString()}>
                      {player.firstName} {player.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreateRule}>Add Rule</Button>
            </div>
          </TabsContent>

          <TabsContent value='targetManagement'>
            {/* Targets Management */}
            <div className='mb-6'>
              <h2 className='mb-2 text-2xl font-semibold'>
                Targets Management
              </h2>
              <div className='flex gap-4'>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button>Create Targets</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will create new targets. This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleTargetsAction('create')}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='secondary'>Reshuffle Targets</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reshuffle all targets. This action cannot be
                        undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleTargetsAction('reshuffle')}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant='destructive'>Clear Targets</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will clear all targets are you sure?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleTargetsAction('clear')}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='manualAccCreator'>
            {/* Manual Account Creator */}
            <div className='mb-6'>
              <h2 className='mb-2 text-2xl font-semibold'>
                Manual Account Creator
              </h2>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <Input
                  maxLength={20}
                  placeholder='First Name'
                  onChange={(e) =>
                    handleManualAccountChange('firstName', e.target.value)
                  }
                  value={manualAccount.firstName}
                />
                <Input
                  maxLength={20}
                  placeholder='Last Name'
                  onChange={(e) =>
                    handleManualAccountChange('lastName', e.target.value)
                  }
                  value={manualAccount.lastName}
                />
                <Input
                  maxLength={20}
                  placeholder='Nickname'
                  onChange={(e) =>
                    handleManualAccountChange('nickname', e.target.value)
                  }
                  value={manualAccount.nickname}
                />
                <Input
                  type='email'
                  value={manualAccount.email}
                  placeholder='Email'
                  onChange={(e) =>
                    handleManualAccountChange('email', e.target.value)
                  }
                />
                <Input
                  value={manualAccount.phone}
                  onChange={(e) =>
                    handleManualAccountChange('phone', e.target.value)
                  }
                  placeholder='Phone Number'
                />
                <Select
                  value={manualAccount.hallId}
                  onValueChange={(value) =>
                    handleManualAccountChange('hallId', value)
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Hall' />
                  </SelectTrigger>
                  <SelectContent>
                    {halls.map((hall) => (
                      <SelectItem key={hall.value} value={hall.value}>
                        {hall.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={manualAccount.grade}
                  onValueChange={(value) =>
                    handleManualAccountChange('grade', value)
                  }
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Grade' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='junior'>Junior</SelectItem>
                    <SelectItem value='senior'>Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='mt-4 flex gap-4'>
                <Button onClick={handleSaveManualAccount}>Save</Button>
                <Button onClick={handleClearManualAccount} variant='outline'>
                  Clear
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* FFA Kills Table (only shown when FFA is enabled) */}
          {ffa && (
            <TabsContent value='ffa'>
              <h2 className='mb-2 text-2xl font-semibold'>Recent Kills</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    {[
                      'Approved',
                      'Contested',
                      'Killer Name',
                      'Killer Email',
                      'Killer Phone',
                      'Victim Name',
                      'Victim Email',
                      'Victim Phone',
                      'Actions',
                    ].map((header, index) => (
                      <TableHead key={index}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kills.map((kill) => (
                    <TableRow key={kill.id}>
                      <TableCell>{kill.approved ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{kill.contest ? 'Yes' : 'No'}</TableCell>
                      <TableCell>
                        {`${kill.killer.firstName} ${kill.killer.lastName}`}
                      </TableCell>
                      <TableCell>{kill.killer.email}</TableCell>
                      <TableCell>{kill.killer.phone}</TableCell>
                      <TableCell>
                        {`${kill.victim.firstName} ${kill.victim.lastName}`}
                      </TableCell>
                      <TableCell>{kill.victim.email}</TableCell>
                      <TableCell>{kill.victim.phone}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleApproveKill(kill.id)}>
                          Approve
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant='destructive'>Revert</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will enable FFA mode and cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRevertKill(kill.id)}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          )}

          <TabsContent value='targetsByHall'>
            {/* Hall Selector */}
            <div className='mb-6'>
              <h2 className='mb-2 text-2xl font-semibold'>
                View Targets by Hall
              </h2>

              <Select value={selectedHall} onValueChange={setSelectedHall}>
                <SelectTrigger className='w-64'>
                  <SelectValue placeholder='Hall' />
                </SelectTrigger>
                <SelectContent>
                  {halls.map((hall) => (
                    <SelectItem key={hall.value} value={hall.value}>
                      {hall.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className='mt-4'>
                {hallTargets.map((player: targetData, index: number) => {
                  const target = targets.find(
                    (d) => d.id == player.currentTarget
                  );

                  return (
                    <div
                      key={index}
                      className='mb-2 flex justify-between border border-gray-600 p-4'
                    >
                      <span>{player.firstName + ' ' + player.lastName}</span>
                      <span>
                        {target != null
                          ? target.firstName + ' ' + target.lastName
                          : 'No Target'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default function DashboardWrapper() {
  return (
    <SessionProvider>
      <Dashboard />
    </SessionProvider>
  );
}
