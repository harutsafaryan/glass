import { Departmnet } from "@prisma/client";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { createMachine } from "~/models/machines.server";
import { requireUserId } from "~/session.server";

const departments = Object.keys(Departmnet);
type DepartmnetKeys = keyof typeof Departmnet;

interface Errors {
    name: string | null,
    manufacturer: string | null,
    year: string | null,
    serialNumber: string | null,
    department: string | null
}

export async function action({ request }: ActionFunctionArgs) {
    const userId = await requireUserId(request);
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const manufacturer = formData.get("manufacturer") as string;
    const year = Number(formData.get("year"));
    const serialNumber = formData.get("serialNumber") as string;
    const department = formData.get("department") as DepartmnetKeys;

    const errors: Errors = {
        name: null,
        manufacturer: null,
        year: null,
        serialNumber: null,
        department: null
    }

    if (typeof name !== "string" || name.length === 0)
        errors.name = "name is required"

    if (typeof year !== 'number')
        errors.year = "please enter valid value"

    if (typeof manufacturer !== "string" || manufacturer.length === 0)
        errors.manufacturer = "manufacturer is required"

    if (typeof serialNumber !== "string" || serialNumber.length === 0)
        errors.serialNumber = "serial number is required"

    if (typeof department !== "string" || department.length === 0)
        errors.department = "departmnet  is required"

    for (const key in errors) {
        if (errors[key as keyof typeof errors])
            return json(
                { errors },
                { status: 400 },
            );
    }

    await createMachine({name, year, manufacturer, serialNumber, department, userId});

    return null;
}

export default function NewMachinePage() {
    const actionData = useActionData<typeof action>();

    const nameRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);
    const manufacturerRef = useRef<HTMLInputElement>(null);
    const serialNumberRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (actionData?.errors?.name) nameRef.current?.focus();
        if (actionData?.errors?.year) yearRef.current?.focus();
        if (actionData?.errors?.manufacturer) manufacturerRef.current?.focus();
        if (actionData?.errors?.serialNumber) serialNumberRef.current?.focus();

    }, [actionData])

    return (
        <Form method="post">
            <div className="inline-block space-y-2">
                <div className="sm:col-span-4">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        <span>Name: </span>
                        <input
                            ref={nameRef}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="text"
                            name="name"
                        />
                        {actionData?.errors?.name ? (
                            <div className="pt-1 text-red-700">
                                {actionData.errors.name}
                            </div>
                        ) : null}
                    </label>
                </div>

                <div className="sm:col-span-4">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        <span>manufacturer: </span>
                        <input
                            ref={manufacturerRef}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="text"
                            name="manufacturer" />
                    </label>
                    {actionData?.errors?.manufacturer ? (
                        <div className="pt-1 text-red-700">
                            {actionData.errors.manufacturer}
                        </div>
                    ) : null}
                </div>

                <div className="sm:col-span-4">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        <span>Year: </span>
                        <input
                            ref={yearRef}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="number" min={1980} max={2030}
                            name="year" />
                    </label>
                    {actionData?.errors?.year ? (
                        <div className="pt-1 text-red-700">
                            {actionData.errors.year}
                        </div>
                    ) : null}
                </div>

                <div className="sm:col-span-4">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        <span>serialNumber: </span>
                        <input
                            ref={serialNumberRef}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            type="text"
                            name="serialNumber" />
                    </label>
                    {actionData?.errors?.serialNumber ? (
                        <div className="pt-1 text-red-700">
                            {actionData.errors.serialNumber}
                        </div>
                    ) : null}
                </div>

                <div className="sm:col-span-4">
                    <label className="block text-sm font-medium leading-6 text-gray-900">
                        <span>department: </span>
                        <select
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            name="department">
                        {departments.map((dep, index) => (<option key={index} value={dep}>{dep}</option>))}
                        </select>
                    </label>
                </div>

                <button type="submit">Save</button>
            </div>
        </Form>
    )
}
