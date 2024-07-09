import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteNotification, getNotificationsById } from "~/models/notifications.server";
import { requireUser, requireUserId } from "~/session.server";


export const loader = async ({ params, request }: LoaderFunctionArgs) => {
    await requireUser(request);
    const notificationId = params.notificationId;
    invariant(notificationId, "Notification id is required");

    const notification = await getNotificationsById(notificationId);
    return json({ notification });
};


export const action = async ({ request }: ActionFunctionArgs) => {
    await requireUser(request);
    const formaData = request.formData();
    const notificationId = (await formaData).get("notificationId") as string;
    await deleteNotification(notificationId);
    return null;
};


export default function NotificationPage() {
    const { notification } = useLoaderData<typeof loader>();

    return (
        <div>
            <p>notification name: {notification?.name}</p>
            <Form method="post" action={`/notifications/${notification?.id}`}>
                <p>{notification?.name}</p>
                <input name="notificationId" value={notification?.id} type="hidden" />
                <button className="border border-red-600 bg-red-400" type="submit">DELETE</button>
            </Form>
        </div>
    )
}