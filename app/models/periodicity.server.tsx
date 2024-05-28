import {Periodicity, Todo } from "@prisma/client";

import { prisma } from "~/db.server";

export async function createPeriodicity(todoId: Todo['id'], period: Periodicity['period'], date: Periodicity['date']) {
    return await prisma.periodicity.create({
        data: {
            date,
            period,
            todoId
        }
    })
}

export async function getPeriodsByTodoId(id: Todo['id']) {
    return await prisma.periodicity.findMany({
        where: {
            todoId: id
        }
    })
}
