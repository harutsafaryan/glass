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

export async function createIssue(name: string, entityId: string, userId: string) {
        return await prisma.issue.create({
            data: {
                name,
                userId,
                entityId
            }
        })
}
