/* eslint-disable react/prop-types */
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";


export function ScheduleItem({ schedule }) {
    const fetcher = useFetcher();
    const isDeleting = fetcher.state === "submitting";

    return (
        <li className={`flex ${isDeleting ? 'opacity-25' : 'opacity-100'}`}>
            {new Date(schedule.date).toLocaleDateString()}
            <fetcher.Form method="post">
                <input type="hidden" name="scheduleId" value={schedule.id}></input>
                <button type="submit" name="_action" value="delete_schedule"
                    className="rounded bg-rose-100 ml-5 px-1 py-1 text-xs font-semibold text-rose-800 shadow-sm hover:bg-rose-200">{isDeleting ? 'deleting...' : 'delete'}</button>
            </fetcher.Form>
        </li>
    )
}


export function AddSchedule({ todoId }) {
    const fetcher = useFetcher();
    const formRef = useRef();
    const isAdding = fetcher.state === "submitting";

    useEffect(() => {
        if (!isAdding)
        formRef.current?.reset();
    }, [isAdding])

    return (
        <fetcher.Form method="post" ref={formRef}>
            <input type="hidden" name="todoId" value={todoId}></input>
            <input type="date" name="date"></input>
            <button
                disabled={isAdding}
                className="disabled:opacity-25 rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50 active:bg-slate-500"
                type="submit" name="_action" value="add_schedule">{isAdding ? 'Adding...' : "Add"}</button>
        </fetcher.Form>
    )
}