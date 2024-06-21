import type { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createNotification } from "~/models/notifications.server";
import { requireUserId } from "~/session.server";


export const action = async ({ request }: ActionFunctionArgs) => {
    const userId = await requireUserId(request);
    const formData = await request.formData();

    const todoId =formData.get('todoId') as string;
    const name = formData.get('notification_name') as string;

    await new Promise(resolve => setTimeout(resolve, 1000))
    await createNotification({ userId, todoId, name })

  return null;
};

interface prop {
    refId: string
}

export default function NewNotificationPage({refId} : prop) {
    const name = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const fetcher = useFetcher();
    const isAdding = fetcher.state === "submitting";

    useEffect(() => {
        if (!isAdding) {
            formRef.current?.reset();
            name.current?.focus();
        }
    }, [isAdding])

    return (
        <fetcher.Form method="post" ref={formRef} action="/notifications/new">
            <input type="hidden" name="todoId" value={refId}></input>
            <input type="text" name="notification_name" ref={name}></input>
            <button
                disabled={isAdding}
                className="disabled:opacity-25 rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50 active:bg-slate-500"
                type="submit" name="_action" value="new_notification">{isAdding ? 'Adding...' : "Add"}</button>
        </fetcher.Form>
    )
}