import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getNotifications } from "~/models/notifications.server";
import { requireUser } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    await requireUser(request);

    const notifications = await getNotifications();

    return json({ notifications });
}

export default function NotificationsPage() {
    const { notifications } = useLoaderData<typeof loader>();

    return (
        <div>
            <ul>
                {
                    notifications.map(n => (
                        <li key={n.id}>
                            <Link to={n.id}>{n.name}</Link>
                        </li>
                    ))
                }
            </ul>
            <Outlet />
        </div>
    )
}