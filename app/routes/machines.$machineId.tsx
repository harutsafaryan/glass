import { Status } from "@prisma/client";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import Accordion from "~/components/Accordion";
import CheckList from "~/components/ChecksList";
import { getChecksByTodoId } from "~/models/checks.server";
import { getMachineById } from "~/models/machines.server";
import { requireUser } from "~/session.server";

import NewCheckPage from "./checks.new";


export async function loader({ params, request }: LoaderFunctionArgs) {
    await requireUser(request);
    const machineId = params.machineId;
    invariant(machineId, "checkId not found");

    const machine = await getMachineById(machineId);

    const checks = await getChecksByTodoId(machineId);
    // const schedules = await getScheduleByTodoId(todoId);
    // const notifications = (await getNotificationsByUser(userId)).filter(n => n.todoId === todoId);

    return json({ machine, checks });
}

export default function MachinePage() {

    const { machine, checks } = useLoaderData<typeof loader>();

    return (
        <div>
            <p>mashine name: {machine?.name} </p>
            <p>mashine sn: {machine?.serialNumber} </p>

            <Accordion title="Add check">
                <NewCheckPage id="f93cf4d9-f9fa-4b76-b1ce-8a12a8888ba9"/>
            </Accordion>

            <Accordion title={checks.length === 0 ? 'There is no any check' : checks.length === 1 ? 'There is only 1 check' : ` Thera are ${checks.length} checks`}>
                <CheckList checks={checks} />

            </Accordion>
        </div>
    )
}