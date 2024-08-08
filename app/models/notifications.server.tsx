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

export async function createNotification(userId : Notification['userId'], entityId : Notification['entityId'], name : Notification['name']) {
    return await prisma.notification.create({
        data : {
            userId,
            entityId,
            name,
        }
    })
}

export async function deleteNotification(id : Notification['id']) {
    return await prisma.notification.delete({
        where : {id}
    })
}