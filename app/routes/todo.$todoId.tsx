import { Status } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, Outlet, useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { useRef } from "react";
import invariant from "tiny-invariant";

import TodoInfo from "~/components/TodoInfo";
import Accordion from "~/components/Accordion";
import { createCheck } from "~/models/checks.server";
import { getTodoById } from "~/models/todo.server";
import { requireUserId } from "~/session.server";

const statuses = Object.keys(Status);
type StatusKeys = keyof typeof Status;

export async function loader({ params, request }: LoaderFunctionArgs) {
    await requireUserId(request);
    invariant(params.todoId, "todoId not found");
    const todoId = params.todoId;
    const todo = await getTodoById(todoId);

    return json({ todo });
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    const commentValue = formData.get('comment') as string;
    const textValue = formData.get('text') as string;
    const floatValue = formData.get('value') as string;
    const todoId = formData.get('todoId') as string;
    const status = formData.get('status') as StatusKeys;

    const value = floatValue ? parseFloat(floatValue) : null;
    const text = textValue !== '' ? textValue : null;
    const comment = commentValue !== '' ? commentValue : null;

    const userId = await requireUserId(request);
    await createCheck({ status, value, text, comment, todoId, userId });
    return redirect('/todos');
}

export default function TodoInfoPage() {
    const { todo } = useLoaderData<typeof loader>();

    const navigate = useNavigate();
    const location = useLocation();
    const commentRef = useRef<HTMLTextAreaElement>(null);
    const valueRef = useRef<HTMLInputElement>(null);
    const textRef = useRef<HTMLInputElement>(null);

    const isHistoryView = location.pathname.endsWith('history');

    if (!todo)
        return null;

    return (
        <div>
            <TodoInfo todo={todo} />
            <hr className="my-4" />

            <Accordion>
    
       
            <Form method="post">
                <input type="hidden" name="todoId" value={todo?.id}></input>

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
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50"
                    >
                        Save
                    </button>
                    <button
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                </div>
            </Form>
            </Accordion>

            <div className="mt-4">
                {isHistoryView
                    ? <button onClick={() => navigate(-1)} className="p-1 border-2 rounded border-sky-500 hover:bg-sky-300">hide history</button>
                    : <button onClick={() => navigate('history')} className="p-1 border-2 rounded border-sky-500 hover:bg-sky-300">show history</button>
                }
                <Outlet />
            </div>
        </div>
    )
}