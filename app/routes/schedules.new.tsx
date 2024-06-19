import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createSchedule } from "~/models/schedule.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionFunctionArgs) {
    const userId = await requireUserId(request);
    const formData = await request.formData();

    const date = formData.get('date') as string;
    const scheduleName = formData.get('name') as string;
    const scheduleDate = new Date(date);
    const refId = formData.get('refId') as string;

    await createSchedule(refId, scheduleDate, scheduleName,  userId);

    return null;
}

interface prop {
    refId: string
}


export default function NewSchedulePage({ refId }: prop) {
    const fetcher = useFetcher();
    const formRef = useRef();
    const isAdding = fetcher.state === "submitting";

    useEffect(() => {
        if (!isAdding)
            formRef.current?.reset();
    }, [isAdding])

    return (
        <fetcher.Form method="post" action="/schedules/new" ref={formRef}>
            <input type="hidden" name="refId" value={refId}></input>
            <input type="date" name="date"></input>
            <input type="name" name="name"></input>
            <button
                disabled={isAdding}
                className="disabled:opacity-25 rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50 active:bg-slate-500"
                type="submit">{isAdding ? 'Adding...' : "Add"}</button>
        </fetcher.Form>
    )
}