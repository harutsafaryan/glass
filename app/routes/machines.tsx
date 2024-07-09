import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import MachinesList from "~/components/MachinesList";
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
      <div className="flex">
        <p className="px-3">Machines count: {machines.length}</p>
        <Link to={'new'}>New</Link>
      </div>
        <hr className="my-4" />
      <MachinesList machines={machines} />
      <Outlet />
    </div>
  )
}

