import { ActionFunctionArgs } from "@remix-run/node";

import { requireUser } from "~/session.server";

export async function loader({request} : ActionFunctionArgs) {
    const user = await requireUser(request);

    console.log('user: ', user.email);
    return null;
}