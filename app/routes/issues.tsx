import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";

import { getIssues } from "~/models/issues.server";
import { requireUser } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    await requireUser(request);
    const issues = await getIssues();

    return { issues };
}

export default function IssuesPage() {
    const { issues } = useLoaderData<typeof loader>();

    return (
        <div>
            <ul>
                {issues.map(i => (
                    <li key={i.id}>
                        {i.name}
                    </li>
                ))}
            </ul>
            <Outlet />
        </div>
    )
}