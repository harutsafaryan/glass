import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";

import Sidebar from '~/components/Store'
import TodoItem from "~/components/TodoCard";
import { getTodos } from "~/models/todo.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    await requireUserId(request);
    const todos = await getTodos();

    return json({ todos });
}


export default function TodosPage() {
    const { todos } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    // const [period, setPeriod] = useState('start');

    // useLayoutEffect(() => {
    //     const period = window.localStorage.getItem('period') ?? 'end';
    //     setPeriod(period);
    // }, []);

    // useEffect(() => {
    //     window.localStorage.setItem('period', period);
    // }, [period]);

    return (
        <div>
            <p>Filters</p>
            <Sidebar/>
            <div className="flex space-x-3 mb-2 justify-center">
                <p className="sm:text-lg text-center font-bold">{todos.length !== 0 ? "Todo list" : "Todo list is empty"}</p>
                <button className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={() => navigate('/create-todo')}>new</button>
            </div>
            <hr className="my-4" />

            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {todos.map((todo) => (
                    <Link to={`../todo/${todo.id}`} key={todo.id}>
                        <TodoItem todo={todo} />
                    </Link>
                ))}
            </ul>
        </div>
    )
}