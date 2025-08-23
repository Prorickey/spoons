'use client';

import Image from 'next/image';
import { SessionProvider, signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import useMobileDetect from '@/utils/mobileDetect';

function SignInPage() {
  const { status, data: session } = useSession();
  if (status === 'authenticated') {
    if (session?.user['firstName'] == null) redirect('/account');
    else redirect('/');
  }

  const [error, setError] = useState('');
  const [mobile, setMobile] = useState(false);

  const onSubmit = async () => {
    setError('');
    const res = await signIn('credentials', {
      callbackUrl: '/auth/signin',
    });
    if (res?.error) {
      if (res?.error === 'CredentialsSignin') {
        setError('Please sign in with your NCSSM updateAccount');
      }
    }
  };

  const deviceType = useMobileDetect();

  useEffect(() => {
    document.body.style.height = window.innerHeight + 'px';

    function isFacebookInAppBrowser() {
      const userAgent = window.navigator.userAgent;
      return userAgent.includes('FBAN') || userAgent.includes('FBAV');
    }

    if (
      isFacebookInAppBrowser() &&
      (deviceType.isAndroid() || deviceType.isIos())
    )
      setMobile(true);
  }, [deviceType]);

  if (mobile)
    return (
      <div className='my-auto flex h-full flex-row items-center justify-center'>
        <div className='flex w-2/3 flex-col gap-y-2 rounded-2xl bg-stone-800 pb-5 lg:w-1/4'>
          <div className='flex flex-row justify-center pt-10 pb-5'>
            <p className='mx-auto w-5/6 text-center text-2xl'>
              You must open this sign in page in an official browser. Google
              blocks requests from in-app browsers for security and will not
              allow you to login through messenger.
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className='my-auto flex h-full flex-row items-center justify-center'>
      <div className='flex w-2/3 flex-col gap-y-2 rounded-2xl bg-stone-800 pb-5 lg:w-1/4'>
        <div className='flex flex-row justify-center pt-10 pb-5'>
          <Image src='/favicon.png' alt='NCSSM Logo' width={100} height={100} />
        </div>
        <h1 className='w-full text-center text-4xl'>Sign In</h1>
        <h1 className='w-full text-center text-2xl'>No Password, No Risk</h1>
        {error === '' ? null : (
          <h1 className='w-full text-center text-xl text-red-500'>{error}</h1>
        )}
        <div className='mx-auto flex w-5/6 flex-col justify-center pt-10'>
          <form key='google' action={onSubmit}>
            <button
              type='submit'
              className='mt-2 flex h-[5rem] w-full items-center justify-between space-x-2 rounded bg-gray-100 px-4 text-xl font-light text-stone-950 transition hover:bg-gray-300 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none'
            >
              <Image
                src='https://authjs.dev/img/providers/google.svg'
                alt='Google Logo'
                width={45}
                height={45}
              />
              <p>Sign in with Google</p>
              <div></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SignInWrapper() {
  return (
    <SessionProvider>
      <SignInPage />
    </SessionProvider>
  );
}
