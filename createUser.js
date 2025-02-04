import { PrismaClient } from '@prisma/client'

(async () => {
  const prisma = new PrismaClient()

  await prisma.user.update({
    where: {
      id: 278
    },
    data: {
      killed: true,
      killedBy: '141'
    }
  })

  await prisma.kill.create({
    data: {
      killerId: 141,
      victimId: 278,
      killedAt: new Date(),
      lat: 39,
      long: 37
    }
  })

  prisma.$disconnect()
})()