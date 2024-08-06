import { Departmnet, Type } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getMachines() {
    return await prisma.entity.findMany({
        where: {
            type: 'MACHINE',
            active: true
        }
    })
}


export async function createMachine(
    name: string,
    year: number,
    manufacturer: string,
    serialNumber: string,
    department: Departmnet,
    userId: string
) {
    return prisma.entity.create({
        data : {
            name,
            userId,
            type : Type.MACHINE,
            profile : {
                create : {
                    year,
                    manufacturer,
                    serialNumber,
                    department,
                }
            }
        }
    })
}