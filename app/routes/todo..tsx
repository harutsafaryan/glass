import { Outlet } from "@remix-run/react";

export default function TodoDetailsPage() {
    return (
        <div>
            <p className="text-center underline text-lg font-medium">Todo info</p>
            <Outlet />
        </div>
    )
}