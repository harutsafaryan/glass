import { useSearchParams } from "@remix-run/react";

export default function MonthChange() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const years = ['2023', '2024', '2025', '2026', '2027', '2028'];

    const [searchParams, setSearchParams] = useSearchParams();

    const checkedMonth = searchParams.get('month');
    const checkedYear = searchParams.get('year');

    
    return (
        <div className="mb-3">
            <div className="flex justify-center">
                {months.map((month) => (
                    <button key={month}
                        onClick={() => {
                            setSearchParams((searchParams) => {
                                searchParams.set('month', month);
                                return searchParams;
                            })
                        }}
                        className={`rounded-full ${month === checkedMonth ? 'bg-white shadow-inner shadow-rose-700' : 'bg-white shadow shadow-sky-400'} m-2 px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-sky-200`}
                    >
                        <p>{month[0]}<span className="sr-only sm:not-sr-only">{month.slice(1, 3)}</span></p>
                    </button>
                ))}
            </div>
            <div className="flex justify-center">
                {years.map(year => (
                    <button key={year}
                        onClick={() => {
                            setSearchParams((searchParams) => {
                                searchParams.set('year', year);
                                return searchParams;
                            })
                        }}
                        className={`rounded-full ${year === checkedYear ? 'bg-sky-200' : 'bg-white drop-shadow shadow-black'} m-2 px-2.5 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-sky-100`}
                    >
                        {year}
                    </button>
                ))}
            </div>
        </div>

    )
}