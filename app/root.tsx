import { ClerkApp, ClerkCatchBoundary } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import styles from "./styles/app.css";
import directStyle from "./styles/style.css";

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: directStyle },
  ];
}
export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "cet Extra!",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(
    args,
    ({ request }) => {
      const { userId } = request.auth;

      return { userId };
    },
    { loadUser: true }
  );
}; /* 1 */
export const CatchBoundary = ClerkCatchBoundary(); /* 2 */

function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="max-w-7xl mx-auto">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
export default ClerkApp(App);
