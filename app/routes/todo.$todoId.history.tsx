import { LoaderFunctionArgs, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import CheckList from "~/components/ChecksList";
import { getChecksByTodoId } from "~/models/checks.server";
import { requireUserId } from "~/session.server"

export async function loader({ request, params }: LoaderFunctionArgs) {
    await requireUserId(request);
    invariant(params.todoId, "todoId not found");
    const todoId = params.todoId;
    const checks = await getChecksByTodoId(todoId);

    return json({ checks });
}

export default function ChecksHistory() {
    const { checks } = useLoaderData<typeof loader>();


    return (
        <CheckList checks={checks} />
    )
}