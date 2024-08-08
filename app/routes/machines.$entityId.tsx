import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import Accordion from "~/components/Accordion";
import CheckList from "~/components/ChecksList";
import { IssueItem } from "~/components/Issue";
import { NotificationItem } from "~/components/Notification";
import NotificationSlider from "~/components/NotificationSlider";
import { ScheduleItem } from "~/components/Schedule";
import { getChecksByMachineId } from "~/models/checks.server";
import { getMachineById } from "~/models/entities.server";
import { getIssues } from "~/models/issues.server";
import { getNotifications } from "~/models/notifications.server";
import { getSchedules } from "~/models/schedule.server";
import { requireUser } from "~/session.server";

import NewCheckPage from "./checks.new";
import NewIssuePage from "./issues.new";
import NewNotificationPage from "./notifications.new";
import NewSchedulePage from "./schedules.new";



export async function loader({ params, request }: LoaderFunctionArgs) {
    await requireUser(request);
    const entityId = params.entityId;
    invariant(entityId, "entityId not found");

    const machine = await getMachineById(entityId);
    const checks = await getChecksByMachineId(entityId);
    const schedules = (await getSchedules()).filter(s => s.machineId === entityId);
    const notifications = (await getNotifications()).filter(n => n.entityId === entityId);
    const issues = (await getIssues()).filter(n => n.entityId === entityId);

    return json({ machine, checks, schedules, notifications, issues });
}
export async function action() {
    console.log('action');
    return null;
}

export default function MachinePage() {

    const { machine, checks, schedules, notifications, issues } = useLoaderData<typeof loader>();

    const today = new Date();
    const closedCheks = checks.filter(c => c.state === 'CLOSED').length;
    const openCheks = checks.filter(c => c.state === 'OPEN').length;
    const overdueChecks = checks.filter(c => c.state === "OPEN" &&  new Date(c?.scheduledAt ?? 0).getTime() < today.getTime()).length;

    console.log('overdue: ', overdueChecks);

    if (!machine)
        return null;

    return (
        <div>
            <p>mashine name: {machine?.name} </p>
            <p>mashine sn: {machine?.serialNumber} </p>
            <NotificationSlider notifications={notifications} />

            <Accordion title="Add check">
                <NewCheckPage entityId={machine.id} scheduled={false} />
            </Accordion>

            <Accordion title="Schedule check">
                <NewCheckPage entityId={machine.id} scheduled={true} />
            </Accordion>

            <Accordion title={`cheks: ${closedCheks}, upcoming cheks: ${openCheks} overdue checks: ${overdueChecks}`}>
                <CheckList checks={checks} />
            </Accordion>

            <Accordion title="Add schedule">
                <NewSchedulePage entityId={machine.id}></NewSchedulePage>
                <ul className="space-y-1">
                    {schedules.map(schedule => <ScheduleItem schedule={schedule} key={schedule.id} />)}
                </ul>
            </Accordion>

            <Accordion title="Add Notification">
                <NewNotificationPage entityId={machine.id} />
                <ul className="space-y-1">
                    {notifications.map(notification => <NotificationItem notification={notification} key={notification.id} />)}
                </ul>
            </Accordion>
            <Accordion title="Issues">
                <NewIssuePage entityId={machine.id}/>
                {issues.map(issue => <IssueItem issue={issue} key={issue.id} />)}
            </Accordion>
        </div>
    )
}