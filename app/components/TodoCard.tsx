interface TodoProps {
    todo: {
        title: string,
        definition: string | null,
        location: string | null,
        criteria: string | null,
        periodic: string
        reference: {
            name: string,
        }
        schedules: {
            id: string,
            todoId: string,
            date: string,
        }[] // order by date and return earliest date [1]
        checks: {
            id: string,
            createdAt: string
        }[]//
    }
}

// interface Schedule {
//     id: string,
//     todoId: string,
//     date: string,
// }

export default function TodoCard({ todo }: TodoProps) {
    const daysCount = getDaysToNextCheck({ todo });

    return (
        <div className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow-lg border-2 border-sky-800">
            <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                        <h3 className="truncate text-sm font-medium text-gray-900">{todo.title}</h3>
                        <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {todo.reference.name}
                        </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">{todo.definition}</p>
                    <p className="mt-1 truncate text-sm text-gray-500">{todo.location}</p>
                    <p className="mt-1 truncate text-sm text-gray-500">{todo.criteria}</p>
                    <div className="flex space-x-2 mt-2">
                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            {new Date(todo.schedules?.[0]?.date).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {new Date(todo.checks[0]?.createdAt).toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {todo.periodic}
                        </span>
                        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                            {daysCount}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// function getDaysToNextCheck(schedules: Schedule[]) {
//     if (!schedules)
//         return null

//     const scheduleDates = schedules.filter(p => p.date).map(e => new Date(e.date ?? 0));
//     const nearestDate = scheduleDates.sort((a, b) => a.getTime() - b.getTime())?.[0];

//     if (nearestDate === undefined)
//         return null;

//     const today = new Date().toDateString();
//     const t = new Date(today);
//     const deltaDays = Math.floor((nearestDate.getTime() - t.getTime()) / 86_400_000);

//     return deltaDays;
// }

function getDaysToNextCheck({ todo }: TodoProps) {
    let deltaDays = 88;
    const today = new Date();
    const t = new Date(today);
    
    if (todo.schedules.length > 0) {
        const schedule = new Date(todo.schedules[0].date)
        console.log('schedule: ', schedule.getTime())
        console.log('schedule2: ', t.getTime())
        deltaDays = Math.floor((schedule.getTime() - t.getTime()) / 86_400_000)
    }
    else if (todo.checks.length > 0) {
        const checkCraetedDate = new Date(todo.checks[0].createdAt);
        deltaDays = Math.floor((checkCraetedDate.getTime() - t.getTime()) / 86_400_000)
    }
    return deltaDays;
}
