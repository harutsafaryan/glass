import { Periodic } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { getArticles } from "~/models/articles.server";
import { getReferences } from "~/models/references.server";
import { createTodo } from "~/models/todo.server";
import { requireUserId } from "~/session.server";



const periods = Object.keys(Periodic);
type PeriodKeys = keyof typeof Periodic;


export async function loader({ request }: LoaderFunctionArgs) {
    await requireUserId(request);

    const articles = await getArticles()
    const references = await getReferences()

    return json({ articles, references })
}

export async function action({ request }: ActionFunctionArgs) {
    const userId = await requireUserId(request);
    const formData = await request.formData();

    const obj = Object.fromEntries(formData)
    console.log('formaData: ', obj)

    const remark = formData.get('remark') as string; //
    const title = formData.get('title') as string; //
    const definition = formData.get('definition') as string; //
    const method = formData.get('method') as string; //
    const location = formData.get('location') as string; //
    const criteria = formData.get('criteria') as string; //
    const record = formData.get('record') as string; //
    const comments = formData.get('comments') as string; //
    const referenceId = formData.get('referenceId') as string; //
    const articleId = formData.get('articleId') as string; //
    const periodic = formData.get('periodic') as PeriodKeys;

    interface Errors {
        title: string | null,
    }

    const errors: Errors = {
        title: null,
    };

    if (typeof title !== "string" || title.length === 0)
        errors.title = "Title is required";

    for (const key in errors) {
        if (errors[key as keyof typeof errors])
            return json(
                { errors },
                { status: 400 },
            );
    }

    await createTodo({ remark, title, definition, method, location, criteria, record, comments, referenceId, articleId, periodic, userId });
    return redirect('/todos');
}

export default function NewTodoPage() {
    const navigation = useNavigation();
    const isSubmitting = navigation.formAction === '/create-todo';

    const actionData = useActionData<typeof action>();
    const { references, articles } = useLoaderData<typeof loader>();

    const titleRef = useRef<HTMLInputElement>(null);
    const definitionRef = useRef<HTMLInputElement>(null);
    const locationRef = useRef<HTMLInputElement>(null);
    const criteriaRef = useRef<HTMLInputElement>(null);
    const commentsRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (actionData?.errors?.title) titleRef.current?.focus();
    }, [actionData]);


    return (
        <Form method="post" action="/create-todo">
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Please fill below dodo information</h2>

                    <div className="mt-10 grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
                        <div className="sm:col-span-4">
                            <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                                Title
                            </label>
                            <div className="mt-1">
                                <input
                                    ref={titleRef}
                                    type="text"
                                    name="title"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    aria-invalid={actionData?.errors?.title ? true : undefined}
                                    aria-errormessage={actionData?.errors?.title ? "name-error" : undefined}
                                />
                                {actionData?.errors?.title ? (
                                    <div className="pt-1 text-red-700" id="title-error">
                                        {actionData.errors.title}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                Definition
                            </label>
                            <div className="mt-1">
                                <input
                                    ref={definitionRef}
                                    type="text"
                                    name="definition"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>



                        <div className="sm:col-span-4">
                            <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                                Remark
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="remark"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>



                        <div className="sm:col-span-3">
                            <label htmlFor="reference" className="block text-sm font-medium leading-6 text-gray-900">
                                Reference
                                <select
                                    name="referenceId"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                >
                                    {references.map(reference => (<option key={reference.id} value={reference.id}>{reference.name}</option>))}
                                </select>
                            </label>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="reference" className="block text-sm font-medium leading-6 text-gray-900">
                                Article
                                <select
                                    name="articleId"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                >
                                    {articles.map(article => (<option key={article.id} value={article.id}>{article.name}</option>))}
                                </select>
                            </label>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="reference" className="block text-sm font-medium leading-6 text-gray-900">
                                Period
                                <select
                                    name="periodic"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                >
                                    {periods.map((period, index) => (<option key={index} value={period}>{period}</option>))}
                                </select>
                            </label>
                        </div>


                        <div className="col-span-3">
                            <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                                Location
                            </label>
                            <div className="mt-1">
                                <input
                                    ref={locationRef}
                                    type="text"
                                    name="location"
                                    id="location"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor="criteria" className="block text-sm font-medium leading-6 text-gray-900">
                                Criteria
                            </label>
                            <div className="mt-1">
                                <input
                                    ref={criteriaRef}
                                    type="text"
                                    name="criteria"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />

                            </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor="criteria" className="block text-sm font-medium leading-6 text-gray-900">
                                Method
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="method"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />

                            </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                            <label htmlFor="criteria" className="block text-sm font-medium leading-6 text-gray-900">
                                Record
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="record"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />

                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="comments" className="block text-sm font-medium leading-6 text-gray-900">
                                Comments
                            </label>
                            <div className="mt-1">
                                <input
                                    ref={commentsRef}
                                    type="text"
                                    name="comments"
                                    id="comments"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                    We will always let you know about important changes, but you pick what else you want to hear about.
                </p>

                <div className="mt-10 space-y-10">
                    <fieldset>
                        <legend className="text-sm font-semibold leading-6 text-gray-900">By Email</legend>
                        <div className="mt-6 space-y-6">
                            <div className="relative flex gap-x-3">
                                <div className="flex h-6 items-center">
                                    <input
                                        id="comments"
                                        name="comments"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="text-sm leading-6">
                                    <label htmlFor="comments" className="font-medium text-gray-900">
                                        Comments
                                    </label>
                                    <p className="text-gray-500">Get notified when someones posts a comment on a posting.</p>
                                </div>
                            </div>
                            <div className="relative flex gap-x-3">
                                <div className="flex h-6 items-center">
                                    <input
                                        id="candidates"
                                        name="candidates"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="text-sm leading-6">
                                    <label htmlFor="candidates" className="font-medium text-gray-900">
                                        Candidates
                                    </label>
                                    <p className="text-gray-500">Get notified when a candidate applies for a job.</p>
                                </div>
                            </div>
                            <div className="relative flex gap-x-3">
                                <div className="flex h-6 items-center">
                                    <input
                                        id="offers"
                                        name="offers"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="text-sm leading-6">
                                    <label htmlFor="offers" className="font-medium text-gray-900">
                                        Offers
                                    </label>
                                    <p className="text-gray-500">Get notified when a candidate accepts or rejects an offer.</p>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend className="text-sm font-semibold leading-6 text-gray-900">Push Notifications</legend>
                        <p className="mt-1 text-sm leading-6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
                        <div className="mt-6 space-y-6">
                            <div className="flex items-center gap-x-3">
                                <input
                                    id="push-everything"
                                    name="push-notifications"
                                    type="radio"
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-gray-900">
                                    Everything
                                </label>
                            </div>
                            <div className="flex items-center gap-x-3">
                                <input
                                    id="push-email"
                                    name="push-notifications"
                                    type="radio"
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-gray-900">
                                    Same as email
                                </label>
                            </div>
                            <div className="flex items-center gap-x-3">
                                <input
                                    id="push-nothing"
                                    name="push-notifications"
                                    type="radio"
                                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                                <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">
                                    No push notifications
                                </label>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div> */}
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    {isSubmitting ? 'Seaving...' : "Save"}
                </button>
            </div>
        </Form>
    )
}