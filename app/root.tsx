import { ClerkApp, ClerkCatchBoundary } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { Statut } from "@prisma/client";
import { json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "@remix-run/react";
import ErrorComponent from "./components/ErrorComponent";
import Footer from "./components/Footer";
import Menu from "./components/Menu";
import styles from "./styles/app.css";
import directStyle from "./styles/style.css";
import { getCurrentUser } from "./utils/newAuth.server";

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
    async ({ request }) => {
      const { userId } = request.auth;
      const userStatut = userId ? (await getCurrentUser(request)).statut : null;
      return {
        userId,
        userStatut,
      };
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
type LoaderData = {
  userId: string;
};
function App() {
  const { userId } = useLoaderData<LoaderData>();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="">
        <div className="min-h-[90vh]">
          {userId && <Menu />}
          <div className="min-h-[70vh]">
            <Outlet />
          </div>
        </div>
        <Footer />
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
