import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import Accordion from "~/components/Accordion";
import CheckList from "~/components/ChecksList";
import { getChecksByMachineId } from "~/models/checks.server";
import { getMachineById } from "~/models/machines.server";
import { requireUser } from "~/session.server";

import NewCheckPage from "./checks.new";
import NewSchedulePage from "./schedules.new";
import NewNotificationPage from "./notifications.new";
import { getNotifications } from "~/models/notifications.server";
import NotificationSlider from "~/components/NotificationSlider";
import { NotificationItem } from "~/components/Notification";


export async function loader({ params, request }: LoaderFunctionArgs) {
    await requireUser(request);
    const machineId = params.machineId;
    invariant(machineId, "checkId not found");

    const machine = await getMachineById(machineId);
    const checks = await getChecksByMachineId(machineId);
    const notifications = (await getNotifications()).filter(n => n.machineId === machineId);

    // const schedules = await getScheduleByTodoId(todoId);
    // const notifications = (await getNotificationsByUser(userId)).filter(n => n.todoId === todoId);

    return json({ machine, checks, notifications });
}
export async function action() {
    console.log('action');
    return null;
}

export default function MachinePage() {

    const { machine, checks, notifications } = useLoaderData<typeof loader>();

    if (!machine)
        return null;

    return (
        <div>
            <p>mashine name: {machine?.name} </p>
            <p>mashine sn: {machine?.serialNumber} </p>
            <NotificationSlider notifications={notifications} />

            <Accordion title="Add check">
                <NewCheckPage id={machine.id}/>
            </Accordion>

            <Accordion title={checks.length === 0 ? 'There is no any check' : checks.length === 1 ? 'There is only 1 check' : ` Thera are ${checks.length} checks`}>
                <CheckList checks={checks} />
            </Accordion>

            <Accordion title="Add schedule">
                <NewSchedulePage refId={machine.id}></NewSchedulePage>
            </Accordion>

            <Accordion title="Add Notification">
                <NewNotificationPage refId={machine.id} />
                <ul className="space-y-1">
                        {notifications.map(notification => <NotificationItem notification={notification} key={notification.id} />)}
                    </ul>
            </Accordion>
        </div>
    )
}