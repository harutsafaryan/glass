import { Status } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useRef } from "react";

import { createCheck, scheduleCheck } from "~/models/checks.server";
import { requireUserId } from "~/session.server";

const statuses = Object.keys(Status);
type StatusKeys = keyof typeof Status;

export async function action({ request }: ActionFunctionArgs) {
    const userId = await requireUserId(request);
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const commentValue = formData.get('comment') as string;
    const comment = commentValue !== '' ? commentValue : null;
    const refId = formData.get('refId') as string;
    const _action = formData.get('_action');

    if (_action === 'create_check') {
        console.log("action: ", _action);
        const textValue = formData.get('text') as string;
        const floatValue = formData.get('value') as string;
        const status = formData.get('status') as StatusKeys;

        const value = floatValue ? parseFloat(floatValue) : null;
        const text = textValue !== '' ? textValue : null;

        await createCheck({ name, status, value, text, comment, refId, userId });
    }

    if (_action === 'schedule_check') {
        console.log("action: ", _action);

        const date = formData.get('date') as string;

        await scheduleCheck(name, date, refId, userId)
    }

    return null;
}

interface prop {
    refId: string
    scheduled: boolean
}

export default function NewCheckPage({ refId, scheduled }: prop) {
    const fetcher = useFetcher()

    const nameRef = useRef<HTMLInputElement>(null);
    const commentRef = useRef<HTMLTextAreaElement>(null);
    const valueRef = useRef<HTMLInputElement>(null);
    const textRef = useRef<HTMLInputElement>(null);
    const dateRef = useRef<HTMLInputElement>(null);


    return (
        <div>
            <fetcher.Form method="post" action="/checks/new">

                <p>{scheduled ? 'schedule new check' : 'add new check'}</p>
                <input type="hidden" name="refId" value={refId}></input>
                <input type="hidden" name="_action" value={scheduled ? "schedule_check" : "create_check"}></input>

                {!scheduled
                    ? <div>
                        <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                            <span>Status</span>
                            <select name="status">
                                {
                                    statuses.map((status, index) => (
                                        <option
                                            key={index}
                                            value={status}
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-96 sm:text-sm sm:leading-6"
                                        >{status}</option>
                                    ))
                                }
                            </select>
                        </label>
                    </div>
                    : null
                }

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
                        <label htmlFor="value" className="block text-sm font-medium leading-6 text-gray-900">
                            <span>Numeric value </span>
                            <input
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-96 sm:text-sm sm:leading-6"
                                ref={valueRef}
                                name="value"
                                type="number" step=".01"
                            ></input>
                        </label>
                    </div>
                    : null
                }

                {!scheduled
                    ? <div>
                        <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900">
                            <span>Any value </span>
                            <input
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-96 sm:text-sm sm:leading-6"
                                ref={textRef}
                                name="text"
                                type="text"
                            ></input>
                        </label>
                    </div>
                    : null
                }

                {scheduled
                    ? <div>
                        <label htmlFor="text" className="block text-sm font-medium leading-6 text-gray-900">
                            <span>Schedule date </span>
                            <input
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-96 sm:text-sm sm:leading-6"
                                ref={dateRef}
                                name="date"
                                type="date"
                            ></input>
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
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50 active:bg-slate-500"
                    >
                        Save
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