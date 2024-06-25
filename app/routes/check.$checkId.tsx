import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import CheckInfo from "~/components/CheckInfo";
import TodoInfo from "~/components/TodoInfo";
import { completeCheck, deleteCheck, getCheckById } from "~/models/checks.server";
import { getTodoById } from "~/models/todo.server";
import { requireUserId } from "~/session.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
    await requireUserId(request);
    invariant(params.checkId, "checkId not found");

    
    const checkId = params.checkId
    console.log('checkId: ', checkId)
    const check = await getCheckById(checkId);

    if (!check) {
        throw new Response("Not Found", { status: 404 });
    }
   // const todo = await getTodoById(check.todo.id)

    return json({ check });
}

export async function action({ params, request }: ActionFunctionArgs) {
    await requireUserId(request);

    const checkId = params.checkId;
    invariant(checkId, 'check id is rquired')
    const formData = await request.formData();
    const _action = formData.get("_action");

    if (_action === "complete") {
        await completeCheck(checkId);
    }

    await deleteCheck(checkId);

    return redirect('/checks');
}

export default function CheckPage() {
    const { check } = useLoaderData<typeof loader>();

    return (
        <div>
            {/* <p className="text-lg font-bold underline underline-offset-4">Todo</p> */}
            {/* {todo ? <TodoInfo todo={todo} /> : null } */}
            {/* <hr className="my-4" /> */}

            <p className="text-lg font-bold underline underline-offset-4">Check</p>
            <CheckInfo check={check} />
            <Form method="post">
            <input type="hidden" name="_action" value="delete"/>
                <button
                    type="submit"
                    className="mt-3 rounded bg-red-600 px-4 py-1 text-white hover:bg-red-700 focus:bg-blue-400"
                >
                    Delete
                </button>
            </Form>
        </div>
    )
}