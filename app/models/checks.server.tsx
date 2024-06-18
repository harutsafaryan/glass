
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



export async function createCheck({ status, value, text, comment, todoId, userId }: Pick<Check, 'status' | 'value' | 'text' | 'comment' | 'todoId' | 'userId'>) {

    console.log('dasdas')
    const todo = await prisma.todo.findUnique({where : {id : todoId}});
    const machine = await prisma.machine.findUnique({where : {id : todoId}});

    return await prisma.check.create({
        data: {
            status,
            value,
            text,
            comment,
            todoId : todo?.id,
            machineId : machine?.id,
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