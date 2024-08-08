import { Department, Prisma, Type, Entity } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getMachines() {
    return await prisma.entity.findMany({
        where: {
            type: 'MACHINE',
            active: true
        },
        include : {
            profile : true,
            issues : true
        }
    })
}


export async function createMachine(
    name: string,
    year: number,
    manufacturer: string,
    serialNumber: string,
    department: Department,
    userId: string
) {
    const json = {
        year,
        manufacturer,
        serialNumber,
        department
    } as Prisma.JsonObject

    return prisma.entity.create({
        data : {
            name,
            userId,
            type : Type.MACHINE,
            profile : {
                create : {
                    data : json
                }
            }
        }
    })
}

export async function getMachineById(id : Entity['id']) {
    return await prisma.entity.findUnique({
      where: {
        id,
        active: true
      }
    })
  }