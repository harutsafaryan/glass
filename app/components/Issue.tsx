import { useFetcher } from "@remix-run/react";

interface prop {
    issue : {
        id : string,
        name : string,
        status : string
    }
}

export function IssueItem({ issue } : prop) {
    const fetcher = useFetcher();
    const isDeleting = fetcher.state === "submitting";
    const isFixed = issue.status === 'CLOSED';

    return (
        <li className={`flex ${isFixed ? 'line-through opacity-60' : ''} ${isDeleting ? 'opacity-25' : 'opacity-100'}`}>
            {issue.name}
            <fetcher.Form method="post" action={`/issues/${issue.id}`}>
                <input type="hidden" name="issueId" value={issue.id}></input>
                <button type="submit" 
                    className={`rounded bg-rose-100 ml-5 px-1 py-1 text-xs font-semibold text-rose-800 shadow-sm hover:bg-rose-200 ${isFixed? 'invisible' : ''}`}>
                    {isDeleting ? 'deleting...' : 'delete'}</button>
            </fetcher.Form>
        </li>
    )
}