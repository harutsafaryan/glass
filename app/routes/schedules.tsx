import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { getSchedules } from "~/models/schedule.server";
import { requireUser } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
    await requireUser(request);

    const schedules = await getSchedules();
    return json({ schedules });
};


export default function SchedulesPage() {
    const { schedules } = useLoaderData<typeof loader>();

    return (
        <>
        <Link to="new">New schedule</Link>
            {schedules.map(s => {s?.date})}
        </>
    )
}
