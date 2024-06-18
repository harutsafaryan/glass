import { Status } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useRef } from "react";

import { createCheck } from "~/models/checks.server";
import { requireUserId } from "~/session.server";

const statuses = Object.keys(Status);
type StatusKeys = keyof typeof Status;

export async function action({ request }: ActionFunctionArgs) {
    const userId = await requireUserId(request);
    const formData = await request.formData();

    const commentValue = formData.get('comment') as string;
    const textValue = formData.get('text') as string;
    const floatValue = formData.get('value') as string;
    const todoId = formData.get('todoId') as string;
    const status = formData.get('status') as StatusKeys;

    const value = floatValue ? parseFloat(floatValue) : null;
    const text = textValue !== '' ? textValue : null;
    const comment = commentValue !== '' ? commentValue : null;

    await createCheck({ status, value, text, comment, todoId, userId });
    return null;
}

interface prop {
    id : string
}

export default function NewCheckPage({id}: prop) {
    const fetcher = useFetcher()

    const commentRef = useRef<HTMLTextAreaElement>(null);
    const valueRef = useRef<HTMLInputElement>(null);
    const textRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <p>new check page</p>

            <fetcher.Form method="post">
                <input type="hidden" name="todoId" value={id}></input>
                <div>
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

                <div>
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

                <div>
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