
import type { Check, Entity, Machine, Todo } from "@prisma/client";

import { prisma } from "~/db.server";
import { getMonthIndex } from "~/utility/helper";

export async function getChecks() {
    return await prisma.check.findMany({
        where: {
            active: true
        },
        select: {
            id: true,
            name : true,
            value: true,
            text: true,
            comment: true,
            status: true,
            createdAt: true,
            scheduledAt : true,
            state : true,
            year: true,
            month: true,
            day: true,
            user: { select: { name: true } },
            todo: { select: { title: true } }
        }
    });
}


export async function deleteCheck(id: Check['id']) {
    // return await prisma.check.delete({ where: { id } })
    return await prisma.check.update({
        where: { id },
        data: { active: false }
    })
}

export async function completeCheck(id: string) {
    await prisma.check.update({
        where: { id },
        data: {
            state: "CLOSED",
            comment: "completed"
        }
    })
}

export async function getCheckById(id: Check['id']) {
    return await prisma.check.findFirst({
        where: {
            id,
            active: true
        },
        select: {
            id: true,
            value: true,
            text: true,
            comment: true,
            status: true,
            createdAt: true,
            state: true,
            user: { select: { name: true } },
            todo: { select: { id: true } }
        }
    })
}


export async function getChecksByTodoId(todoId: Todo['id']) {
    return await prisma.check.findMany({
        where: { todoId },
        select: {
            id: true,
            name : true,
            value: true,
            text: true,
            comment: true,
            status: true,
            createdAt: true,
            scheduledAt : true,
            state : true,
            year: true,
            month: true,
            day: true,
            user: { select: { name: true } },
            todo: { select: { title: true } }
        }
    })
}


export async function getChecksByMachineId(entityId: Entity['id']) {
    return await prisma.check.findMany({
        where: {
            entityId,
            active: true
        },
        select: {
            id: true,
            name: true,
            state: true,
            value: true,
            text: true,
            comment: true,
            status: true,
            createdAt: true,
            scheduledAt: true,
            year: true,
            month: true,
            day: true,
            user: { select: { name: true } },
            entity: { select: { name: true } }
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}



export async function createCheck(
    name: Check['name'],
    status: Check['status'],
    comment: Check['comment'],
    entityId: Check['entityId'],
    userId: Check['userId']) {

    return await prisma.check.create({
        data: {
            name,
            status,
            comment,
            state: "CLOSED",
            entityId,
            userId
        }
    })
}

export async function scheduleCheck(name: string, date: string, entityId: string, userId: string) {

    return await prisma.check.create({
        data: {
            name,
            scheduledAt: new Date(date),
            state: "OPEN",
            entityId,
            userId
        }
    })
}

export async function lastAction() {
    return await prisma.check.groupBy({
        by: ['todoId'],
        _max: { createdAt: true }
    })
}

export async function checkCount() {
    return await prisma.check.groupBy({
        by: ['todoId'],
        _count: true
    })
}


// export async function groupCheckByDate() {
//     return await prisma.check.groupBy({
//         by: ['createdAt'],
//         _count: { month: true }
//     })
// }

// export async function groupChecks() {
//     return await prisma.check.groupBy({
//         by: ['date'],
//         _count: { date: true }
//     })
// }

export async function getChecksByDateInterval(from: Date, to: Date) {
    return await prisma.check.findMany({
        where: {
            AND: [
                { createdAt: { gte: from } },
                { createdAt: { lte: to } }
            ]
        }
    })
}

export async function getChecksByMonth(month: string) {
    const monthIndex = getMonthIndex(month);
    const startDate = new Date(2024, monthIndex, 1);
    const endDate = new Date(2024, monthIndex + 1, 1);

    return await prisma.check.findMany({
        where: {
            AND: [
                { createdAt: { gte: startDate } },
                { createdAt: { lte: endDate } },
            ]
        },
        select: {
            id: true,
            name: true,
            state: true,
            value: true,
            text: true,
            comment: true,
            status: true,
            createdAt: true,
            scheduledAt: true,
            year: true,
            month: true,
            day: true,
            user: { select: { name: true } },
            todo: { select: { title: true } }
        }
    })
}