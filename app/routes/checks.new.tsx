import { Status } from "@prisma/client";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { useActionData, useFetcher } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import { createCheck, scheduleCheck } from "~/models/checks.server";
import { requireUserId } from "~/session.server";
import { classNames } from "~/utility/helper";

const statuses = Object.keys(Status);
type StatusKeys = keyof typeof Status;

export async function action({ request }: ActionFunctionArgs) {
    const userId = await requireUserId(request);
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const commentValue = formData.get('comment') as string;
    const comment = commentValue !== '' ? commentValue : null;
    const entityId = formData.get('entityId') as string;
    const _action = formData.get('_action');


    if (_action === 'create_check') {
        const status = formData.get('status') as StatusKeys;
        await createCheck(name, status, comment, entityId, userId);
    }

    if (_action === 'schedule_check') {
        const date = formData.get('date') as string;

        if (getDateErrors(date))
            return json(
                { errors: { date: getDateErrors(date) } }
            );

            return json(
                { errors: { date: getDateErrors(date) } }
            );

            console.log(11)
        await scheduleCheck(name, date, entityId, userId)
    }

    return null;
}

interface prop {
    entityId: string
    scheduled: boolean
}

export default function NewCheckPage({ entityId, scheduled }: prop) {
    const [activeStatus, setactiveStatus] = useState('SUCCESS');
    const actionData = useActionData<typeof action>();

    console.log('actionData: ', actionData)
    const fetcher = useFetcher();
    const formRef = useRef<HTMLFormElement>(null);
    const isSaving = fetcher.state === "submitting";

    const nameRef = useRef<HTMLInputElement>(null);
    const commentRef = useRef<HTMLTextAreaElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isSaving)
            formRef.current?.reset();
    }, [isSaving])

    return (
        <div>
            <fetcher.Form method="post" action="/checks/new" ref={formRef}>

                <p>{scheduled ? 'schedule new check' : 'add new check'}</p>
                <input type="hidden" name="entityId" value={entityId}></input>
                <input type="hidden" name="_action" value={scheduled ? "schedule_check" : "create_check"}></input>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                        <span>Name </span>
                        <input
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-96 sm:text-sm sm:leading-6"
                            ref={nameRef}
                            required
                            name="name"
                            type="text"
                        ></input>
                    </label>
                </div>

                {!scheduled
                    ? <div>
                        <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                            <div className="flex space-x-3 mt-2 mb-2">
                                <input type="hidden" name="status" value={activeStatus}></input>
                                {
                                    statuses.map((status, index) => (
                                        <button
                                            type="button"
                                            onClick={() => setactiveStatus(status)}
                                            className={classNames('rounded px-2 py-1 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300',
                                                `${status === 'SUCCESS' ? 'bg-green-300' : status === 'ERROR' ? 'bg-red-300' : status === 'WARNING' ? 'bg-yellow-300' : 'bg-white'}`,
                                                `${activeStatus === status ? 'shadow-inner' : 'shadow-lg opacity-25'}`
                                            )}
                                            key={index}
                                        >{status}</button>
                                    ))
                                }
                            </div>

                        </label>
                    </div>
                    : null
                }



                {scheduled
                    ? <div>
                        <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900">
                            <span>Schedule date44 </span>
                            <input
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-96 sm:text-sm sm:leading-6"
                                ref={dateRef}
                                name="date"
                                type="date"
                            ></input>
                            {actionData?.errors?.date ? (
                                <div className="pt-1 text-red-700">
                                    {actionData.errors.date}
                                </div>
                            ) : null}
                        </label>
                    </div>
                    : null
                }

                <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
                    <span>Comment </span>
                    <textarea
                        ref={commentRef}
                        name="comment"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-96 sm:text-sm sm:leading-6"
                        rows={4}>
                    </textarea>
                </label>

                <div className="flex space-x-4 mt-2">
                    <button
                        name="_action"
                        value="new_check"
                        disabled={isSaving}
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50 active:bg-slate-500"
                    >
                        {isSaving ? 'Saving...' : "Save"}
                    </button>
                    <button
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </fetcher.Form>
        </div>
    )
}

function getDateErrors(date: string): string | null {
    if (date === '')
        return 'Date is missing';

    const today = new Date();
    const schedule = new Date(date);

    if (today > schedule)
        return 'Please set a correct date';

    return null
}