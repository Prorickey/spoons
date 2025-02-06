import {getServerSession} from "next-auth";
import { PrismaClient } from "@prisma/client";
import {authOptions} from "../auth/[...nextauth]/auth";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if(!session) return new Response("Unauthorized, please log in", { status: 401 })
  const data: AccountUpdate = await request.json()
  const safeData: AccountUpdate = {
    nickname: data.nickname,
    firstName: data.firstName,
    lastName: data.lastName,
    phone: data.phone,
    grade: data.grade,
    hallId: data.hallId
  }

  /*
    // TODO: Log these errors somewhere with the body that was sent
    If any of these trigger, it most likely means someone is trying
    to investigate and potentially hack the website. We may want to
    log these attempts and check the account that is making the requests.

    I have this safeData object so that the request can't contain descriptors
    like gamemaster or killCount, that would be bad. Although I think this code
    can be cleaned up.
   */

  const malformedBody = new Response("Malformed Body", { status: 400 })
  if(safeData["nickname"] == null || data.firstName.length > 20) return malformedBody
  /*if(safeData["firstName"] == null || data.firstName.length > 100) return malformedBody
  if(safeData["lastName"] == null || data.firstName.length > 100) return malformedBody*/
  if(safeData["phone"] == null || data.phone.length > 20) return malformedBody
  if(safeData["grade"] == null || (data.grade != "S" && data.grade != "J")) return malformedBody
  /*if(safeData["hallId"] == null || !halls.map(d => d.value).includes(data.hallId))
    return malformedBody*/

  if(session.user.email == null) return new Response("Unauthorized, please log in", { status: 401 })

  const prisma = new PrismaClient()
  await prisma.user.upsert({
    where: {
      email: session.user.email,
    },
    create: {
      ...safeData,
      email: session.user.email
    },
    update: safeData
  })

  return new Response("OK", { status: 200 })

}

export interface AccountUpdate {
  nickname: string,
  firstName: string,
  lastName: string,
  phone: string,
  grade: string,
  hallId: string
}