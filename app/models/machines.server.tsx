import { Machine } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getMachines() {
  return await prisma.machine.findMany({
    where: {
      active: true
    }
  })
}

export async function getMachineById(id : Machine['id']) {
  return await prisma.machine.findUnique({
    where: {
      id,
      active: true
    }
  })
}

export async function createMachine({ name, year, manufacturer, serialNumber, department, userId }
  : Pick<Machine, 'name' | 'year' | 'manufacturer' | 'serialNumber' | 'department' | 'userId'>) {
  
    return prisma.machine.create({
    data: {
      name, year, manufacturer, serialNumber, department, userId
    }
  })
}