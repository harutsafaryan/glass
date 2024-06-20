import { Issue } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getIssues() {
    return await prisma.issue.findMany({
        where: {
            active: true
        }
    });
}

export async function getIssueById(id: Issue['id']) {
    return await prisma.issue.findMany({
        where: {
            id,
            active: true
        }
    });
}

export async function deleteIssue(id: Issue['id']) {
    return await prisma.issue.delete({
        where: { id }
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
