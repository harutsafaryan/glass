import { Issue } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getIssues() {
    return await prisma.issue.findMany({
        where : {
            active : true
        },
        orderBy : {
            createdAt : "desc"
        }
    });
}

export async function getIssueById(id: Issue['id']) {
    return await prisma.issue.findUnique({
        where: {
            id,
            active: true
        }
    });
}

export async function fixgIssue(id: Issue['id']) {
    return await prisma.issue.update({
        where: { id },
        data: { state : "CLOSED" }
    });
}

export async function createIssue(name: string, refId: string, userId: string) {
    const machine = await prisma.machine.findUnique({
        where: {
            id: refId
        },
    })

    if (machine)
        return await prisma.issue.create({
            data: {
                name,
                userId,
                machineId: machine.id,
            }
        })
}
