'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SessionProvider, useSession } from 'next-auth/react';
import NavBar, { NavbarProvider } from '@/app/navbar';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AccountUpdate } from '@/app/api/updateAccount/route';
import { halls } from '@/app/api/auth/[...nextauth]/halls';
import { Input } from '@/components/ui/input';

function AccountPage() {
  const { data: session, status, update } = useSession();

  if (status === 'unauthenticated') redirect('/auth/signin');

  const [isMissing, setIsMissing] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [nickname, setNickname] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  const [hallId, setHallId] = useState('');
  const [grade, setGrade] = useState('');

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!loaded && session?.user['firstName'] != null) {
      setNickname(session.user.nickname);
      setFirstName(session.user.firstName);
      setLastName(session.user.lastName);
      setPhone(session.user.phone);
      setGrade(session.user.grade);
      setHallId(session.user.hallId);
      setLoaded(true);
    }
  }, [refresh, session, loaded]);

  const saveSubmit = () => {
    setIsMissing(false);

    if (
      nickname == '' ||
      firstName == '' ||
      lastName == '' ||
      phone == '' ||
      hallId == '' ||
      grade == ''
    ) {
      setIsMissing(true);
      return;
    }

    const data: AccountUpdate = {
      nickname: nickname,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      hallId: hallId,
      grade: grade,
    };

    update(data);

    fetch('/api/updateAccount', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    setRefresh((prev) => prev + 1);
  };

  const resetFields = () => {
    if (session?.user['firstName'] != null) {
      setLoaded(false);
      console.log('Testing');
    } else {
      setIsMissing(false);
      setNickname('');
      setFirstName('');
      setLastName('');
      setPhone('');
      setHallId('');
      setGrade('');
    }
  };

  return (
    <>
      <NavbarProvider>
        <NavBar current={'updateAccount'} />
      </NavbarProvider>
      <div className='flex h-screen items-center justify-center'>
        <div className='bg-card flex w-[85%] flex-col gap-y-2 rounded-2xl px-3 py-5 pb-10 lg:w-1/2 lg:p-5'>
          <h1 className='text-center text-4xl font-semibold'>
            Account Information
          </h1>
          {session?.user['firstName'] == null ? (
            <p className='mb-2 w-full px-4 text-center lg:px-24'>
              You are{' '}
              <span className='underline decoration-red-600 decoration-2'>
                not currently enrolled
              </span>{' '}
              in Spoons. In order to enroll, fill out the information below and
              click save.
            </p>
          ) : (
            <p className='w-full px-4 pb-5 text-center lg:px-24'>
              You are enrolled in Spoons. You may wait for the game to begin.
            </p>
          )}

          <div className='flex flex-col gap-x-2 md:flex-row'>
            <div className='w-full md:w-1/2'>
              <div>
                <p>Nickname/Alias</p>
                <Input
                  maxLength={20}
                  placeholder='JohnDoe27'
                  onChange={(event) => setNickname(event.target.value)}
                  value={nickname}
                />
              </div>
              <div>
                <p>First Name</p>
                <Input
                  maxLength={100}
                  placeholder='John'
                  onChange={(event) => setFirstName(event.target.value)}
                  value={firstName}
                />
              </div>
              <div>
                <p>Last Name</p>
                <Input
                  maxLength={100}
                  placeholder='Doe'
                  onChange={(event) => setLastName(event.target.value)}
                  value={lastName}
                />
              </div>
            </div>
            <div className='w-full md:w-1/2'>
              <div>
                <p>Phone Number</p>
                <Input
                  maxLength={20}
                  placeholder='123-456-7890'
                  onChange={(event) => setPhone(event.target.value)}
                  value={phone}
                />
              </div>
              <div>
                <p>Residence Hall</p>
                <Select
                  value={hallId}
                  onValueChange={(selectedOption) => {
                    setHallId(selectedOption);
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder="John's Place" />
                  </SelectTrigger>
                  <SelectContent>
                    {halls.map((hall) => (
                      <SelectItem key={hall.value} value={hall.value}>
                        {hall.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p>Grade</p>
                <Select
                  value={grade}
                  onValueChange={(selectedOption) => {
                    setGrade(selectedOption);
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Super Senior ' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='S'>Senior</SelectItem>
                    <SelectItem value='J'>Junior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {isMissing && (
            <p className='text-red-400'>Please fill out all fields!</p>
          )}
          <div className='flex flex-row gap-x-2'>
            <Button onClick={saveSubmit}>Save</Button>
            <Button onClick={resetFields} variant='destructive'>
              Reset
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Wrapper() {
  return (
    <SessionProvider>
      <AccountPage />
    </SessionProvider>
  );
}
