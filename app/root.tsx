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
  useCatch,
} from "@remix-run/react";
import ErrorComponent from "./components/ErrorComponent";
import Footer from "./components/Footer";
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
const Boundary = () => {
  const caught = useCatch();
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body className="h-screen">
        <h1>
          {caught.status} {caught.statusText}
        </h1>
        <Scripts />
      </body>
    </html>
  );
};
export const CatchBoundary = ClerkCatchBoundary(Boundary); /* 2 */

function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
export default ClerkApp(App);
export const ErrorBoundary = ({ error }: { error: Error }) => {
  return <ErrorComponent error={error} />;
};
