import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { getMachines } from "~/models/machines.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserId(request);
  const machines = await getMachines();

  return json({ machines });
}


export default function MachinesPage() {
  const { machines } = useLoaderData<typeof loader>();


  return (
    <div>

      <div>
        {
          machines.length === 0
            ? <p>Machines list is empty</p>
            : <p>There is {machines.length} machines</p>
        }
        <hr className="my-4" />
      </div>
      <Link to={'new'}>New</Link>
      <Outlet />
    </div>
  )
}

