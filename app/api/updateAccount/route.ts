import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {HallMap} from "@/app/account/page";
import { PrismaClient } from "@prisma/client";
import assert from "node:assert";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if(!session) return new Response("Unauthorized, please log in", { status: 401 })
  const data: AccountUpdate = await request.json()
  const safeData: any = {

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
  if(data["nickname"] != null && data.firstName.length > 20) return malformedBody
  else safeData["nickname"] = data["nickname"]

  if(data["firstName"] != null && data.firstName.length > 100) return malformedBody
  else safeData["firstName"] = data["firstName"]

  if(data["lastName"] != null && data.firstName.length > 100) return malformedBody
  else safeData["lastName"] = data["lastName"]

  if(data["phone"] != null && data.phone.length > 20) return malformedBody
  else safeData["phone"] = data["phone"]

  if(data["grade"] != null && data.phone != "S" || data.phone != "J") return malformedBody
  else safeData["grade"] = data["grade"]

  if(data["hallId"] != null && !HallMap.map(d => d.value).includes(data.hallId))
    return malformedBody
  else safeData["hallId"] = data["hallId"]

  assert(session.user.email != null)

  const prisma = new PrismaClient()
  prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: data
  })

}

export interface AccountUpdate {
  nickname: string,
  firstName: string,
  lastName: string,
  phone: string,
  grade: string,
  hallId: string
}