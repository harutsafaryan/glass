import { Notification } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getNotificationsByUser(userId: Notification['userId']) {
    return await prisma.notification.findMany({
        where: { userId }
    })
}

export async function getNotifications() {
    return await prisma.notification.findMany({
        where : {active : true}
    })
}

export async function getNotificationsById(id : Notification['id']) {
    return await prisma.notification.findUnique({

        where : {
            id,
            active : true
        }
    })
}

export async function createNotification({userId, todoId, name} : Pick<Notification, 'userId' | 'todoId' | 'name'>) {

    const todo = await prisma.todo.findUnique({ where: { id: todoId } });
    const machine = await prisma.machine.findUnique({ where: { id: todoId } });

    if (!todo && !machine)
        return null;

    return await prisma.notification.create({
        data : {
            userId,
            todoId : todo?.id ?? null,
            machineId : machine?.id ?? null,
            name,
        }
    })
}

export async function deleteNotification(id : Notification['id']) {
    await new Promise(res => setTimeout(res, 1500))
    return await prisma.notification.delete({
        where : {id}
    })
}