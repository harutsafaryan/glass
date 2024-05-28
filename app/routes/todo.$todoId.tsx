import { Period, Status } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useRef } from "react";
import invariant from "tiny-invariant";

import Accordion from "~/components/Accordion";
import CheckList from "~/components/ChecksList";
import TodoInfo from "~/components/TodoInfo";
import { createCheck, getChecksByTodoId } from "~/models/checks.server";
import { createPeriodicity, getPeriodsByTodoId } from "~/models/periodicity.server";
import { getTodoById } from "~/models/todo.server";
import { requireUserId } from "~/session.server";

const statuses = Object.keys(Status);
type StatusKeys = keyof typeof Status;
const periodValues = Object.keys(Period);
type PeriodKeys = keyof typeof Period;

export async function loader({ params, request }: LoaderFunctionArgs) {
    await requireUserId(request);
    invariant(params.todoId, "todoId not found");
    const todoId = params.todoId;
    const todo = await getTodoById(todoId);
    const checks = await getChecksByTodoId(todoId);
    const periods = await getPeriodsByTodoId(todoId);


    return json({ todo, checks, periods });
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "new_check") {
        const commentValue = values['comment'] as string;
        const textValue = values['text'] as string;
        const floatValue = values['value'] as string;
        const todoId = values['todoId'] as string;
        const status = values['status'] as StatusKeys;

        const value = floatValue ? parseFloat(floatValue) : null;
        const text = textValue !== '' ? textValue : null;
        const comment = commentValue !== '' ? commentValue : null;

        const userId = await requireUserId(request);
        await createCheck({ status, value, text, comment, todoId, userId });
        // return redirect('/todos');
        return null;
    }

    if (_action === "set_date") {
        console.log('dsdasdas')
        const date = values['date'] as string;
        const period = values['period'] as PeriodKeys;
        const d = new Date(date);
        const todoId = values['todoId'] as string;
        try {
            await createPeriodicity(todoId, period, d);
        }
        catch (error) {
            console.log("error: ", error)
        }
        return null;
    }
    return null;
}

export default function TodoInfoPage() {
    const { todo, checks, periods } = useLoaderData<typeof loader>();

    const commentRef = useRef<HTMLTextAreaElement>(null);
    const valueRef = useRef<HTMLInputElement>(null);
    const textRef = useRef<HTMLInputElement>(null);

    if (!todo)
        return null;

    return (
        <div>
            <TodoInfo todo={todo} />
            <hr className="my-4" />

            <Accordion title="Add check">
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
                            name="_action"
                            value="new_check"
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
            <Accordion title={`History - ${checks.length}`}>
                <CheckList checks={checks} />
            </Accordion>
            <Accordion title={`Schedule - ${periods.length}`}>
                <Form method="post">
                    <input type="hidden" name="todoId" value={todo?.id}></input>
                    <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
                        <span>Period</span>
                        <select name="period">
                            {periodValues.map((period, index) => (
                                <option value={period} key={index}>{period}</option>
                            ))}
                        </select>
                    </label>
                    <label>
                        <span>date</span>
                        <input type="date" name="date"></input>
                    </label>
                    <button
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50"
                        type="submit" name="_action" value="set_date">Save</button>
                </Form>
            </Accordion>
        </div>
    )
}