import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, json, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { deleteIssue, getIssueById } from "~/models/issues.server";
import { requireUser } from "~/session.server";


export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUser(request);
  const issueId = params.issueId;
  invariant(issueId, "Issue id is required");

  const issue = await getIssueById(issueId);

  return json({ issue });
};


export const action = async ({ request }: ActionFunctionArgs) => {
  await requireUser(request);
  const formaData = request.formData();
  const issueId = (await formaData).get("issueId") as string;
  await deleteIssue(issueId);
  return null;
};



export default function IssuePage() {
  const { issue } = useLoaderData<typeof loader>();

  return (
    <div>
      <p>issue date: {issue?.name}</p>
      <Form method="post" action={`/issues/${issue?.id}`}>
        <p>{issue?.name}</p>
        <input name="issueId" value={issue?.id} type="hidden" />
        <button className="border border-red-600 bg-red-400" type="submit">DELETE</button>
      </Form>
    </div>
  )
}