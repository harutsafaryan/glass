// import type { Check } from "@prisma/client";
import { useNavigate } from "@remix-run/react";

import { classNames } from "~/utility/helper";

import { CheckProp } from "./CheckProp";

export default function CheckList({ checks }: CheckProp) {

    if (checks === undefined)
        return null

    const navigate = useNavigate();
    if (checks?.length === 0)
        return (
            <div className="px-2 sm:px-6 lg:px-1">
                <h1 className="text-base font-semibold mt-2 leading-6 text-gray-900">There is no any check!</h1>
            </div>
        )

    const isTododExist = checks.filter(c => c?.todo).length > 0;

    return (
        <div className="px-2 sm:px-6 lg:px-1">
            <div className="sm:flex sm:items-center justify-center">
                <h1 className="text-base font-semibold mt-2 leading-6 text-gray-900">A list of checks for date : </h1>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {
                                            isTododExist ? <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Todo Title
                                            </th> : null
                                        }
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Status
                                        </th>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Numeric value
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Text value
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Created At
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Created By
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Comment
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {checks.map((check) => (
                                        <tr key={check.id}
                                            onClick={() => navigate(`/check/${check.id}`)}
                                            className={classNames(`${check.status === 'SUCCESS' ? 'bg-green-200' : check.status === 'FAIL' ? 'bg-rose-200' : null}`,
                                                'text-gray-900 hover:text-red-600'
                                            )}
                                        >
                                            {isTododExist ? <td className="whitespace-nowrap px-3 py-1 text-sm">{check.todo.title}</td> : null}
                                            <td className="whitespace-nowrap px-3 py-1 text-sm ">{check.status}</td>
                                            <td className="whitespace-nowrap px-3 py-1 text-sm ">{check.value}</td>
                                            <td className="whitespace-nowrap px-3 py-1 text-sm ">{check.text}</td>
                                            <td className="whitespace-nowrap px-3 py-1 text-sm ">{new Date(check.createdAt).toLocaleString()}</td>
                                            <td className="whitespace-nowrap px-3 py-1 text-sm ">{check.user.name}</td>
                                            <td className="whitespace-nowrap px-3 py-1 text-sm ">{check.comment}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}