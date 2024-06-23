import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useNavigate } from "@remix-run/react";

interface MachineProp {
    machines: {
        id: string,
        name: string,
        year: number | null,
        manufacturer: string | null,
        serialNumber: string | null
        department: string | null
        issues: {
            state : string
            active : boolean
        }[]
    }[]
}

export default function MachinesList({ machines }: MachineProp) {
    const navigate = useNavigate();
    console.log('m: ', machines)

    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">

                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Name
                                    </th>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Year
                                    </th>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Manufacturer
                                    </th>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Serial number
                                    </th>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Department
                                    </th>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        More
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {machines.map(machine => (
                                    <tr key={machine.id} className=" hover:text-red-600" onClick={() => navigate(`/machines/${machine.id}`)}>
                                        <td className="whitespace-nowrap px-3 py-1 text-sm">{machine.name}</td>
                                        <td className="whitespace-nowrap px-3 py-1 text-sm">{machine.year}</td>
                                        <td className="whitespace-nowrap px-3 py-1 text-sm">{machine.manufacturer}</td>
                                        <td className="whitespace-nowrap px-3 py-1 text-sm">{machine.serialNumber}</td>
                                        <td className="whitespace-nowrap px-3 py-1 text-sm">{machine.department}</td>
                                        <td className="whitespace-nowrap px-3 py-1 text-sm">
                                            {machine.issues.filter(i => i.state === 'OPEN').length > 0
                                                ?  <ExclamationTriangleIcon className="size-6 text-red-600" />
                                                : null}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

