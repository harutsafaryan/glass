import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createIssue } from "~/models/issues.server";
import { requireUserId } from "~/session.server";

export async function action({ request }: ActionFunctionArgs) {
    const userId = await requireUserId(request);
    const formaData = await request.formData();
    const name = formaData.get('name') as string;
    const entityId = formaData.get('entityId') as string;

    await createIssue(name, entityId, userId);
    return null;
}

interface prop {
    entityId: string
}


export default function NewIssuePage({ entityId }: prop) {
    const fetcher = useFetcher();
    const formRef = useRef<HTMLFormElement>(null);
    const isAdding = fetcher.state === "submitting";

    useEffect(() => {
        if (!isAdding)
            formRef.current?.reset();
    }, [isAdding])

    return (
        <fetcher.Form method="post" action="/issues/new" ref={formRef}>
            <input type="hidden" name="entityId" value={entityId}></input>
            <input type="name" name="name"></input>
            <button
                disabled={isAdding}
                className="disabled:opacity-25 rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  hover:bg-gray-50 active:bg-slate-500"
                type="submit">{isAdding ? 'Adding...' : "Add"}</button>
        </fetcher.Form>
    )

}