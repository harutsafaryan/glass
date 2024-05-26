import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import CheckList from "~/components/ChecksList";
import { getChecks } from "~/models/checks.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    await requireUserId(request);

    const checks = await getChecks();
    return json({ checks });
}


export default function ChecksPage() {
    const { checks } = useLoaderData<typeof loader>();

    if (!checks)
        return null;

    return (
        <CheckList checks={checks} />
    )
}