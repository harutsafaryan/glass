/* eslint-disable react/prop-types */
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { useRef } from "react";

export function AddNotification({todoId}) {
    const name = useRef();
    const formRef = useRef();
    const fetcher = useFetcher();
    const isAdding = fetcher.state === "submitting";

    useEffect(() => {
        if (!isAdding)
        formRef.current?.reset();
        name.current?.focus();
    }, [isAdding])

    return (
        <fetcher.Form method="post" ref={formRef}>
            <input type="hidden" name="todoId" value={todoId}></input>
            <input type="text" name="notification_name" ref={name}></input>
            <button
                disabled={isAdding}
                className="disabled:opacity-25 rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50 active:bg-slate-500"
                type="submit" name="_action" value="new_notification">{isAdding ? 'Adding...' : "Add"}</button>
        </fetcher.Form>
    )
}

export function NotificationItem({ notification }) {
    const fetcher = useFetcher();
    const isDeleting = fetcher.state === "submitting";

    return (
        <li className={`flex ${isDeleting ? 'opacity-25' : 'opacity-100'}`}>
            {notification.name}
            <fetcher.Form method="post">
                <input type="hidden" name="notificationId" value={notification.id}></input>
                <button type="submit" name="_action" value="delete_notification"
                    className="rounded bg-rose-100 ml-5 px-1 py-1 text-xs font-semibold text-rose-800 shadow-sm hover:bg-rose-200">{isDeleting ? 'deleting...' : 'delete'}</button>
            </fetcher.Form>
        </li>
    )
}

