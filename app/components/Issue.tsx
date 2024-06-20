import { useFetcher } from "@remix-run/react";

export function IssueItem({ issue }) {
    const fetcher = useFetcher();
    const isDeleting = fetcher.state === "submitting";

    return (
        <li className={`flex ${issue.active ? '' : 'line-through'} ${isDeleting ? 'opacity-25' : 'opacity-100'}`}>
            {issue.name}
            <fetcher.Form method="post" action={`/issues/${issue.id}`}>
                <input type="hidden" name="issueId" value={issue.id}></input>
                <button type="submit" class
                    className={`rounded bg-rose-100 ml-5 px-1 py-1 text-xs font-semibold text-rose-800 shadow-sm hover:bg-rose-200 ${!issue.active ? 'invisible' : ''}`}>
                    {isDeleting ? 'fixing...' : 'fix'}</button>
            </fetcher.Form>
        </li>
    )
}