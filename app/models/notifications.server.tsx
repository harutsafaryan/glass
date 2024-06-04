import { Notification } from "@prisma/client";

import { prisma } from "~/db.server";

export async function getNotificationsByUser(userId: Notification['userId']) {
    return await prisma.notification.findMany({
        where: { userId }
    })
}

export async function createNotification({userId, todoId, name} : Pick<Notification, 'userId' | 'todoId' | 'name'>) {
    return await prisma.notification.create({
        data : {
            userId,
            todoId,
            name,
        }
    })
}