import { PrismaClient } from "@prisma/client"

const accounts = [
  {
    email: "bedson26t@nccsm.edu",
    gamemaster: true,
    nickname: "prorickey1",
    firstName: "Trevor",
    lastName: "Bedson",
    hallId: "4WH",
    grade: "Junior",
    phone: "7049966685",
    killed: false
  },
  {
    email: "bedson26t2@nccsm.edu",
    gamemaster: true,
    nickname: "prorickey2",
    firstName: "Trevor",
    lastName: "Bedson",
    hallId: "4WH",
    grade: "Junior",
    phone: "7049966685",
    killed: false
  },
  {
    email: "bedson26t3@nccsm.edu",
    gamemaster: true,
    nickname: "prorickey3",
    firstName: "Trevor",
    lastName: "Bedson",
    hallId: "4WH",
    grade: "Junior",
    phone: "7049966685",
    killed: false
  },
  {
    email: "bedson26t4@nccsm.edu",
    gamemaster: true,
    nickname: "prorickey4",
    firstName: "Trevor",
    lastName: "Bedson",
    hallId: "4WH",
    grade: "Junior",
    phone: "7049966685",
    killed: false
  }
]

const prisma = new PrismaClient();

(async () => {
  const res = await prisma.user.createMany({
    data: accounts
  })

  console.log(res)
})()