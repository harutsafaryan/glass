import { Status, Periodic } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useRef } from "react";
import invariant from "tiny-invariant";

import Accordion from "~/components/Accordion";
import CheckList from "~/components/ChecksList";
import {AddNotification, NotificationItem} from "~/components/Notification";
import {ScheduleItem, AddSchedule} from "~/components/Schedule"
import TodoInfo from "~/components/TodoInfo";
import { createCheck, getChecksByTodoId } from "~/models/checks.server";
import { createNotification, deleteNotification, getNotificationsByUser } from "~/models/notifications.server";
import { createSchedule, deleteSchedule, getScheduleByTodoId } from "~/models/schedule.server";
import { getTodoById, updatePeriodByTodoId } from "~/models/todo.server";
import { requireUserId } from "~/session.server";
import NewCheckPage from "./checks.new";

const statuses = Object.keys(Status);
type StatusKeys = keyof typeof Status;

const periods = Object.keys(Periodic);
type PeriodKeys = keyof typeof Periodic;

export async function loader({ params, request }: LoaderFunctionArgs) {
    const userId = await requireUserId(request);
    invariant(params.todoId, "todoId not found");
    const todoId = params.todoId;
    const todo = await getTodoById(todoId);
    const checks = await getChecksByTodoId(todoId);
    const schedules = await getScheduleByTodoId(todoId);
    const notifications = (await getNotificationsByUser(userId)).filter(n => n.todoId === todoId);


    return json({ todo, checks, schedules, notifications });
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    const { _action, ...values } = Object.fromEntries(formData);

    if (_action === "add_schedule") {
        const date = values['date'] as string;
        const d = new Date(date);
        const todoId = values['todoId'] as string;
        try {
        await new Promise(resolve => setTimeout(resolve, 1000))

            await createSchedule(todoId, d);
        }
        catch (error) {
            console.log("error: ", error)
        }
        return null;
    }

    if (_action === "set_period") {
        const period = values['period'] as PeriodKeys;
        const todoId = values['todoId'] as string;
        await updatePeriodByTodoId(todoId, period);
    }

    if (_action === "new_notification") {
        const todoId = values['todoId'] as string;
        const name = values['notification_name'] as string;
        const userId = await requireUserId(request);

        await new Promise(resolve => setTimeout(resolve, 1000))
        await createNotification({ userId, todoId, name })
    }

    if (_action === "delete_notification") {
        const notificationId = values['notificationId'] as string;

        await new Promise(resolve => setTimeout(resolve, 1000))
        await deleteNotification(notificationId);
    }

    if (_action === "delete_schedule") {
        const scheduleId = values['scheduleId'] as string;

        await new Promise(resolve => setTimeout(resolve, 1000))
        await deleteSchedule(scheduleId);
    }

    return null;
}

export default function TodoInfoPage() {
    const fetcher = useFetcher()
    const { todo, checks, schedules, notifications } = useLoaderData<typeof loader>();

    if (!todo)
        return null;

    return (
        <div>
            <TodoInfo todo={todo} />
            <hr className="my-4" />

            <Accordion title="Add check">
                <NewCheckPage refId={todo.id}/>
            </Accordion>

            <Accordion title={checks.length === 0 ? 'There is no any check' : checks.length === 1 ? 'There is only 1 check' : ` Thera are ${checks.length} checks`}>
                <CheckList checks={checks} />
            </Accordion>

            <Accordion title={` Current checking period is set to ${todo.periodic}`}>
                <fetcher.Form method="post">
                    <input type="hidden" name="todoId" value={todo?.id}></input>
                    <label htmlFor="period" className="block text-sm font-medium leading-6 text-gray-900">
                        <span>new value </span>
                        <select name="period">
                            {periods.map((period, index) => (
                                <option
                                    key={index}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:w-96 sm:text-sm sm:leading-6"
                                    value={period}
                                >{period}</option>
                            ))}
                        </select>
                    </label>
                    <button
                        className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50 active:bg-slate-500"
                        type="submit" name="_action" value="set_period">Save</button>
                </fetcher.Form>
            </Accordion>

            <Accordion title={schedules.length === 0 ? 'No any schedule' : `There are ${schedules.length} actual schedules, next one one ${new Date(schedules[0].date).toLocaleDateString()}`}>
                <AddSchedule todoId={todo.id} />
                <ul className="space-y-1">
                    {
                        schedules.map((schedule) => <ScheduleItem schedule={schedule} key={schedule.id} />)
                    }
                </ul>
            </Accordion>
            <Accordion title={notifications.length === 0 ? 'No any notification' : `There are ${notifications.length} actual notification${notifications.length === 1 ? '' : 's'}`}>
                <AddNotification todoId={todo.id} />
                {
                    <ul className="space-y-1">
                        {notifications.map(notification => <NotificationItem notification={notification} key={notification.id} />)}
                    </ul>
                }
            </Accordion>
        </div>
    )
}