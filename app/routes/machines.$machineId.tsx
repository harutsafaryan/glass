import { Status } from "@prisma/client";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import Accordion from "~/components/Accordion";
import CheckList from "~/components/ChecksList";
import { getChecksByMachineId, getChecksByTodoId } from "~/models/checks.server";
import { getMachineById } from "~/models/machines.server";
import { requireUser } from "~/session.server";

import NewCheckPage from "./checks.new";


export async function loader({ params, request }: LoaderFunctionArgs) {
    await requireUser(request);
    const machineId = params.machineId;
    invariant(machineId, "checkId not found");

    const machine = await getMachineById(machineId);

    const checks = await getChecksByMachineId(machineId);
    // const schedules = await getScheduleByTodoId(todoId);
    // const notifications = (await getNotificationsByUser(userId)).filter(n => n.todoId === todoId);

    return json({ machine, checks });
}
export async function action() {
    console.log('action');
    return null;
}

export default function MachinePage() {

    const { machine, checks } = useLoaderData<typeof loader>();

    if (!machine)
        return null;

    return (
        <div>
            <p>mashine name: {machine?.name} </p>
            <p>mashine sn: {machine?.serialNumber} </p>

            <Accordion title="Add check">
                <NewCheckPage id={machine.id}/>
            </Accordion>

            <Accordion title={checks.length === 0 ? 'There is no any check' : checks.length === 1 ? 'There is only 1 check' : ` Thera are ${checks.length} checks`}>
                <CheckList checks={checks} />

            </Accordion>
        </div>
    )
}