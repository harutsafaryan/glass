
import type { Check, Machine, Todo } from "@prisma/client";

import { prisma } from "~/db.server";
import { getMonthIndex } from "~/utility/helper";

export async function getChecks() {
    return await prisma.check.findMany({
        where: {
            active: true
        },
        select: {
            id: true,
            value: true,
            text: true,
            comment: true,
            status: true,
            createdAt: true,
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
            value: true,
            text: true,
            comment: true,
            status: true,
            createdAt: true,
            year: true,
            month: true,
            day: true,
            user: { select: { name: true } },
            todo: { select: { title: true } }
        }
    })
}


export async function getChecksByMachineId(machineId: Machine['id']) {
    return await prisma.check.findMany({
        where: { machineId },
        select: {
            id: true,
            name : true,
            state : true,
            value: true,
            text: true,
            comment: true,
            status: true,
            createdAt: true,
            scheduledAt : true,
            year: true,
            month: true,
            day: true,
            user: { select: { name: true } },
            todo: { select: { title: true } }
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}



export async function createCheck({ name, status, value, text, comment, refId, userId }: Pick<Check, 'name' | 'status' | 'value' | 'text' | 'comment' | 'todoId' | 'userId'>) {
   console.log('1')
    const todo = await prisma.todo.findUnique({where : {id : refId}});
    const machine = await prisma.machine.findUnique({where : {id : refId}});
    
    if (!todo && !machine)
        return null;

    return await prisma.check.create({
        data: {
            name,
            status,
            value,
            text,
            comment,
            state : "CLOSED",
            todoId : todo?.id ?? null,
            machineId : machine?.id ?? null,
            userId
        }
    })
}

export async function scheduleCheck(name : string, date : string, refId : string, userId : string) {
   console.log('2')
    
    return await prisma.check.create({
        data : {
            name,
            scheduledAt : new Date(date),
            state : "OPEN",
            machineId : refId,
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
            value: true,
            text: true,
            comment: true,
            status: true,
            createdAt: true,
            year: true,
            month: true,
            day: true,
            user: { select: { name: true } },
            todo: { select: { title: true } }
        }
    })
}