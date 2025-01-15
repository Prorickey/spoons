import { PrismaClient } from '@prisma/client'

const userData = {
  email: "bedson26t@ncssm.edu",
  gamemaster: true,
  firstName: "Trevor",
  lastName: "Bedson",
  hallId: "4WH",
  grade: "Junior"
};

(async () => {
  const prisma = new PrismaClient()

  const user = await prisma.user.create({
    data: userData
  })
  console.log(user)

  prisma.$disconnect()
})()