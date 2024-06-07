
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";


import logo from "~/images/logo.png";
import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Remix App" }];

export default function Index() {
  const user = useOptionalUser();

  return (
    <div className="relative">
      <div className="grid grid-rows-2 gap-4 place-content-center">
        <div>
          <img src={logo} alt="logo" width={400} height={400} />
        </div>
        <div>
        {!user ? <div>
            <Link
              to="/join"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-50 sm:px-8"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center rounded-md bg-blue-500 px-4 py-3 font-medium text-white hover:bg-blue-600"
            >
              Log In
            </Link>
          </div> : null
          }
        </div>

      </div>
    </div>
  );
}
