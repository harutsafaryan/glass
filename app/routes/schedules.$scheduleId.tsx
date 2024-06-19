import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteSchedule, getScheduleById } from "~/models/schedule.server";
import { requireUser } from "~/session.server";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUser(request);
  const scheduleId = params.scheduleId;
  invariant(scheduleId, "Schedule id is required");

  const schedule = await getScheduleById(scheduleId);
  console.log('scheduleId: ', scheduleId)

  return json({ schedule });
};


export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUser(request);
  const formaData = request.formData();
  const scheduleId = (await formaData).get("scheduleId") as string;
  await deleteSchedule(scheduleId);
  return null;
};



export default function SchedulePage() {
  const { schedule } = useLoaderData<typeof loader>();

  return (
    <div>
      <p>schedule date: {schedule?.date}</p>
      <Form method="post" action={`/schedules/${schedule?.id}`}>
        <p>{schedule?.date}</p>
        <input name="scheduleId" value={schedule?.id} type="hidden" />
        <button className="border border-red-600 bg-red-400" type="submit">DELETE</button>
      </Form>
    </div>
  )
}