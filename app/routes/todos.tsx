import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";

import TodoItem from "~/components/TodoCard";
import TodosFilter from '~/components/TodosFilter'
import { getArticles } from "~/models/articles.server";
import { getReferences } from "~/models/references.server";
import { getTodos } from "~/models/todo.server";
import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const userId =  await requireUserId(request);
    const todos = await getTodos(userId);
    const articles = await getArticles();
    const references = await getReferences();

    return json({ todos, articles, references });
}


export default function TodosPage() {
    const { todos, articles, references } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    const [period, setPeriod] = useState('ALL');
    const [articleId, setAticleId] = useState('ALL');
    const [referenceId, setReferenceId] = useState('ALL');

    console.log('period: ', period);

    return (
        <div>
            <div>
                <TodosFilter articles={articles} references={references} period={period} setPeriod={setPeriod} articleId={articleId} setAticleId={setAticleId} referenceId={referenceId} setReferenceId={setReferenceId} />
            </div>
            <div className="flex space-x-3 mb-2 justify-center">
                <p className="sm:text-lg text-center font-bold">{todos.length !== 0 ? "Todo list" : "Todo list is empty"}</p>
                <button className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" onClick={() => navigate('/create-todo')}>new</button>
            </div>
            <hr className="my-4" />

            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {todos.filter(todo => todo.periodic === period || period === "ALL")
                    .filter(todo => todo.articleId === articleId || articleId === "ALL")
                    .filter(todo => todo.referenceId === referenceId || referenceId === "ALL")
                    .map((todo) => (
                        <Link to={`../todo/${todo.id}`} key={todo.id}>
                            <TodoItem todo={todo} />
                        </Link>
                    ))}
            </ul>
        </div>
    )
}