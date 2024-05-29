import {Schedule, Todo } from "@prisma/client";

import { prisma } from "~/db.server";

export async function createSchedule(todoId: Todo['id'], date: Schedule['date']) {
    return await prisma.schedule.create({
        data: {
            date,
            todoId
        }
    })
}

export async function getScheduleByTodoId(id: Todo['id']) {
    return await prisma.schedule.findMany({
        where: {
            todoId: id
        }
    })
}
