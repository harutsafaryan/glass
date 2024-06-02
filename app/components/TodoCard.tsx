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

const TICKS_PER_DAY = 86_400_000
export default function TodoCard({ todo }: TodoProps) {
    const daysCountToNextCheck = getDaysToNextCheck({ todo });
    // const periodicity = todo.periodic;
    // const lastCheckDate = todo.checks[0]?.createdAt ? new Date(todo.checks[0]?.createdAt).toLocaleDateString() : null;
    // const scheduledDate = todo.schedules.length > 0 ? new Date(todo.schedules?.[0]?.date).toLocaleDateString() : null;

    return (
        <div className="relative col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow-lg border-2 border-sky-800">
            <div className="flex w-full items-center justify-between space-x-3 p-3">
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
                   
                    <div className="absolute -top-5 flex space-x-2 mt-2">
                        {
                            daysCountToNextCheck ? <span className={`inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 ${daysCountToNextCheck && daysCountToNextCheck <= 1 ? 'animate-bounce' : null }`}>
                            {daysCountToNextCheck}
                        </span> : null
                        }
                        {/* <span className="relative inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                            {`next check on ${scheduledDate}`}
                            <p className="absolute -top-2 left-3">next check</p>
                        </span>
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                            {`last check on  ${lastCheckDate}`}
                        </span>
                        <span className="relative inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            <p className="absolute -top-2 left-0">period</p>
                            {periodicity}
                        </span> */}
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
    const today = Date.now();

    if (todo.schedules.length > 0) {
        const schedule = Date.parse(todo.schedules[0].date);
        return Math.floor((schedule - today) / TICKS_PER_DAY);
    }
    else if (todo.checks.length > 0 && todo.periodic !== 'UNKNOWN') {
        const daysCount = days(todo.periodic);
        const checkCraetiondDate = Date.parse(todo.checks[0].createdAt);
        return Math.floor((today - checkCraetiondDate + daysCount) / TICKS_PER_DAY);
    }
    else

        return null;
}

function days(period: string) {
    const today = new Date();
    const day = today.getDay();

    switch (period) {
        case 'DAY': return (day === 0 || day === 1 || day === 2 || day === 3 || day === 4 || day === 5) ? TICKS_PER_DAY : 2 * TICKS_PER_DAY;
        case 'WEEK': return 7 * TICKS_PER_DAY;
        case 'MONTH': return 30 * TICKS_PER_DAY;
        case 'YEAR': return 365 * TICKS_PER_DAY
        default: return 0;
    }
}
