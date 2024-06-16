import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

interface Errors {
    name: string | null,
    manufacturer: string | null,
    year: string | null,
    serialNumber: string | null,
    department: string | null
}

export async function action({ request }: ActionFunctionArgs) {
    const formData = await request.formData();

    const name = formData.get("name");
    const manufacturer = formData.get("manufacturer");
    const year = formData.get("year");
    const serialNumber = formData.get("serialNumber");
    const department = formData.get("department");

    const errors: Errors = {
        name: null,
        manufacturer: null,
        year: null,
        serialNumber: null,
        department: null
    }

    if (typeof name !== "string" || name.length === 0)
        errors.name = "name is required"

    if (typeof year !== 'number' || year < 1980 || year > 2030)
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

    return null;
}

export default function NewMachinePage() {
    const actionData = useActionData<typeof action>();

    const nameRef = useRef<HTMLInputElement>(null);
    const yearRef = useRef<HTMLInputElement>(null);
    const manufacturerRef = useRef<HTMLInputElement>(null);
    const serialNumberRef = useRef<HTMLInputElement>(null);
    const departmentRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (actionData?.errors?.name) nameRef.current?.focus();
        if (actionData?.errors?.year) yearRef.current?.focus();
        if (actionData?.errors?.manufacturer) manufacturerRef.current?.focus();
        if (actionData?.errors?.serialNumber) serialNumberRef.current?.focus();
        if (actionData?.errors?.departmnet) departmentRef.current?.focus();

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
                <label className="flex  gap-1">
                    <span>manufacturer: </span>
                    <input
                        ref={manufacturerRef}
                        className="border border-red-200"
                        type="text"
                        name="manufacturer" />
                </label>

                <label className="flex  gap-1">
                    <span>Year: </span>
                    <input
                        ref={yearRef}
                        className="border border-red-200"
                        type="text"
                        name="year" />
                </label>

                <label className="flex  gap-1">
                    <span>serialNumber: </span>
                    <input
                        ref={serialNumberRef}
                        className="border border-red-200"
                        type="text"
                        name="serialNumber" />
                </label>

                <label className="flex  gap-1">
                    <span>department: </span>
                    <input
                        ref={departmentRef}
                        className="border border-red-200"
                        type="text"
                        name="department" />
                </label>

                <button type="submit">Save</button>
            </div>
        </Form>
    )
}
