import {Schedule, Todo } from "@prisma/client";

import { prisma } from "~/db.server";

export async function createSchedule(todoId: Todo['id'], date: Schedule['date']) {
    const isExist = await prisma.schedule.findFirst({
        where : {
            todoId : todoId,
            active : true,
            date : date
        }
    })

    if (isExist)
        return null;

    return await prisma.schedule.create({
        data: {
            date,
            todoId
        }
    })
}

export async function deleteSchedule(id : Schedule['id']) {
    return await prisma.schedule.delete({
        where : {id}
    })
}

export async function getScheduleByTodoId(todoId: Todo['id']) {
    const  today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

     return await prisma.schedule.findMany({
        where: {
            todoId: todoId,
            active : true,
            date : {
                gte: today
            }
        },
        orderBy : {
            date : "asc"
        }
    })
}
