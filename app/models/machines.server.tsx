import { prisma } from "~/db.server";

export async function getMachines() {
  return await prisma.machine.findMany({
    where : {
      active : true
    }
  })
}