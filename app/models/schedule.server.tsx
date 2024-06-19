import { Schedule, Todo, User } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getSchedules() {
    return await prisma.schedule.findMany();
}

export async function getScheduleById(id: Schedule['id']) {
    return await prisma.schedule.findUnique({ where: { id } });
}

export async function createSchedule(refId: string, scheduleDate: Schedule['date'], userId: User['id']) {
    const todo = await prisma.todo.findUnique({ where: { id: refId } });
    const machine = await prisma.machine.findUnique({ where: { id: refId } });

    if (!todo && !machine)
        return null;

    return await prisma.schedule.create({
        data: {
            userId,
            date: scheduleDate,
            todoId: todo?.id ?? null,
            machineId: machine?.id ?? null
        }
    })
}

export async function deleteSchedule(id: Schedule['id']) {
    return await prisma.schedule.delete({
        where: { id }
    })
}

export async function getScheduleByTodoId(todoId: Todo['id']) {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);

    return await prisma.schedule.findMany({
        where: {
            todoId: todoId,
            active: true,
            date: {
                gte: today
            }
        },
        orderBy: {
            date: "asc"
        }
    })
}
