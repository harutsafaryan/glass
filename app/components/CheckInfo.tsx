import { Status } from "@prisma/client"

interface Prop {
    check : {
        value: number | null;
        text: string | null;
        comment: string | null;
        status: string;
        createdAt: string;
        user: {
            name: string;
        },
        todo: {
            id: string
        }
    }
}

export default function CheckInfo({check} : Prop) {

    if (check === null)
        return;

    const textColor = check.status === Status.CHECKED
        ? 'bg-yellow-300'
        : check.status === Status.SUCCESS
            ? 'bg-green-500'
            : check.status === Status.FAIL
                ? 'bg-red-400'
                : ''
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