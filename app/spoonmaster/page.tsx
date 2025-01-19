import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth';
import DashboardWrapper from '@/app/spoonmaster/dash';
import { redirect } from 'next/navigation';

export default async function SpoonmasterDashboardAccess() {
  const session = await getServerSession(authOptions)

  if(session && session.user.gamemaster) {
    return (
      <DashboardWrapper />
    )
  } else redirect("/")
}