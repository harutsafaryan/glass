import { Status } from "@prisma/client"
import { Form } from "@remix-run/react";

interface Prop {
    check: {
        id: string,
        value: number | null;
        text: string | null;
        comment: string | null;
        status: string;
        createdAt: string;
        state: string,
        user: {
            name: string;
        },
        todo: {
            id: string
        }
    }
}

export default function CheckInfo({ check }: Prop) {

    if (check === null)
        return;

    const textColor = check.status === Status.CHECKED
        ? 'bg-yellow-300'
        : check.status === Status.SUCCESS
            ? 'bg-green-500'
            : check.status === Status.FAIL
                ? 'bg-red-400'
                : ''

    if (check.state === 'CLOSED') {
        return (
            <div>
                <div className="flex text-sm font-medium leading-6 text-gray-900">
                    <p className="italic mr-4 w-16 text-right">Created:</p>
                    <p>{new Date(check.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex text-sm font-medium leading-6 text-gray-900">
                    <p className="italic mr-4 w-16 text-right">Status:</p>
                    <p className={textColor}>{check.status}</p>
                </div>
                {
                    check?.value ? <div className="flex text-sm font-medium leading-6 text-gray-900">
                        <p className="italic mr-4 w-16 text-right">Value:</p>
                        <p>{check.value}</p>
                    </div> : null
                }
                {
                    check?.text ? <div className="flex text-sm font-medium leading-6 text-gray-900">
                        <p className="italic mr-4 w-16 text-right">Text:</p>
                        <p>{check.text}</p>
                    </div> : null
                }
                {
                    check?.comment ? <div className="flex text-sm font-medium leading-6 text-gray-900">
                        <p className="italic mr-4 w-16 text-right">Comment:</p>
                        <p>{check.comment}</p>
                    </div> : null
                }
            </div>
        )
    }
    else { //state === 'OPEN'
        return (
            <Form method="post" action={`/check/${check.id}`}>
                <input type="hidden" name="id" value={check.id} />
                <div className="flex space-x-2">
                    <button
                        type="submit" name="_action" value="complete"
                        className="mt-3 rounded bg-green-600 px-4 py-1 text-white hover:bg-green-700 focus:bg-blue-400"
                    >
                        Complete
                    </button>
                    <button
                        type="submit" name="_action" value="delete"
                        className="mt-3 rounded bg-red-600 px-4 py-1 text-white hover:bg-red-700 focus:bg-blue-400"
                    >
                        Delete
                    </button>
                </div>
            </Form>
        )
    }
}