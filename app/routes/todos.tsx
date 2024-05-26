import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";

import TodoItem from "~/components/TodoItem";
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

    return (
        <div>
            <div className="flex space-x-3 mb-2 justify-center">
                <p className="sm:text-lg text-center font-bold">{todos.length !== 0 ? "Todo list" : "Todo list is empty"}</p>
                <button className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={() => navigate('/todoNew')}>new</button>
            </div>
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {todos.map((todo) => (
                    <Link to={`../todo/details/${todo.id}`} key={todo.id}>
                        <TodoItem todo={todo}/>
                    </Link>
                ))}
            </ul>
        </div>
    )
}